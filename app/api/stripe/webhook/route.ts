import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/stripe/server";

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature.", {
      status: 400,
    });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not configured.",
    );

    return new NextResponse(
      "Webhook secret is not configured.",
      {
        status: 500,
      },
    );
  }

  // Stripe signature verification requires the raw body.
  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error,
    );

    return new NextResponse(
      "Invalid Stripe signature.",
      {
        status: 400,
      },
    );
  }

  const supabase = getAdminClient();

  console.log(
    `Processing Stripe event: ${event.id} (${event.type})`,
  );

  try {
    // --------------------------------------------------
    // 1. Idempotency check
    // --------------------------------------------------

    const { data: existingEvent, error: findEventError } =
      await supabase
        .from("stripe_events")
        .select("id, status")
        .eq("stripe_event_id", event.id)
        .maybeSingle();

    if (findEventError) {
      throw new Error(
        `Failed to check Stripe event: ${findEventError.message}`,
      );
    }

    if (existingEvent?.status === "processed") {
      console.log(
        `Stripe event ${event.id} was already processed.`,
      );

      return NextResponse.json({
        received: true,
      });
    }

    // --------------------------------------------------
    // 2. Register event if it doesn't exist
    // --------------------------------------------------

    if (!existingEvent) {
      const { error: insertEventError } =
        await supabase
          .from("stripe_events")
          .insert({
            stripe_event_id: event.id,
            event_type: event.type,
            status: "processing",
          });

      if (insertEventError) {
        // Another concurrent request may have inserted it.
        if (insertEventError.code === "23505") {
          return NextResponse.json({
            received: true,
          });
        }

        throw new Error(
          `Failed to register Stripe event: ${insertEventError.message}`,
        );
      }
    }

    // --------------------------------------------------
    // 3. Process event
    // --------------------------------------------------

    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        await handleCheckoutCompleted(session);

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        await handleSubscription(subscription);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        await handleSubscriptionDeleted(subscription);

        break;
      }

      case "invoice.payment_failed": {
        const invoice =
          event.data.object as Stripe.Invoice;

        await handlePaymentFailed(invoice);

        break;
      }

      default: {
        console.log(
          `Unhandled Stripe event type: ${event.type}`,
        );
      }
    }

    // --------------------------------------------------
    // 4. Mark event as processed
    // --------------------------------------------------

    const { error: processedError } =
      await supabase
        .from("stripe_events")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("stripe_event_id", event.id);

    if (processedError) {
      throw new Error(
        `Failed to mark Stripe event as processed: ${processedError.message}`,
      );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      `Stripe event ${event.id} failed:`,
      error,
    );

    await supabase
      .from("stripe_events")
      .update({
        status: "failed",
        error_message:
          error instanceof Error
            ? error.message
            : "Unknown webhook processing error",
      })
      .eq("stripe_event_id", event.id);

    return new NextResponse(
      "Webhook processing failed.",
      {
        status: 500,
      },
    );
  }
}

// ======================================================
// Checkout completed
// ======================================================

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
) {
  const userId =
    session.metadata?.supabase_user_id;

  if (!userId) {
    throw new Error(
      "Checkout session is missing supabase_user_id metadata.",
    );
  }

  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : null;

  const customerEmail =
    session.customer_details?.email ?? null;

  const supabase = getAdminClient();

  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        customer_email: customerEmail,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

  if (error) {
    throw new Error(
      `Failed to save Checkout customer: ${error.message}`,
    );
  }
}

// ======================================================
// Subscription created / updated
// ======================================================

async function handleSubscription(
  subscription: Stripe.Subscription,
) {
  const userId =
    subscription.metadata?.supabase_user_id;

  if (!userId) {
    throw new Error(
      "Stripe subscription is missing supabase_user_id metadata.",
    );
  }

  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : null;

  const priceId =
    subscription.items.data[0]?.price?.id ?? null;

  const status = subscription.status;

  const isPremium =
    status === "active" ||
    status === "trialing";

  const plan = isPremium
    ? "premium"
    : "free";

  const supabase = getAdminClient();

  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,

        stripe_customer_id:
          stripeCustomerId,

        stripe_subscription_id:
          subscription.id,

        stripe_price_id:
          priceId,

        plan,

        status,

        raw_status:
          status,

        cancel_at_period_end:
          subscription.cancel_at_period_end,

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

  if (error) {
    throw new Error(
      `Failed to update subscription: ${error.message}`,
    );
  }

  console.log(
    `Subscription ${subscription.id} -> ${plan}/${status}`,
  );
}

// ======================================================
// Subscription deleted
// ======================================================

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
) {
  const userId =
    subscription.metadata?.supabase_user_id;

  if (!userId) {
    console.error(
      "Deleted subscription is missing supabase_user_id metadata.",
    );

    return;
  }

  const supabase = getAdminClient();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan: "free",
      status: "canceled",
      raw_status: "canceled",
      cancel_at_period_end: false,
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    throw new Error(
      `Failed to mark subscription as canceled: ${error.message}`,
    );
  }

  console.log(
    `Subscription ${subscription.id} canceled.`,
  );
}

// ======================================================
// Payment failed
// ======================================================

async function handlePaymentFailed(
  invoice: Stripe.Invoice,
) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : null;

  if (!customerId) {
    console.error(
      "Payment failure does not contain a Stripe customer ID.",
    );

    return;
  }

  const supabase = getAdminClient();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      raw_status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq(
      "stripe_customer_id",
      customerId,
    );

  if (error) {
    throw new Error(
      `Failed to mark subscription as past_due: ${error.message}`,
    );
  }

  console.log(
    `Payment failed for Stripe customer ${customerId}.`,
  );
}