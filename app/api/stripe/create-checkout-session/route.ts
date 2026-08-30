import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/server";

export async function POST(
  request: NextRequest,
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    const body =
      await request.json();

    const priceId =
      typeof body.priceId === "string"
        ? body.priceId
        : "";

    const allowedPrices = [
      process.env
        .STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      process.env
        .STRIPE_PREMIUM_YEARLY_PRICE_ID,
    ].filter(Boolean);

    if (
      !priceId ||
      !allowedPrices.includes(priceId)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid subscription plan.",
        },
        {
          status: 400,
        },
      );
    }

    const stripe =
      getStripeClient();

    const { data: existing } =
      await supabase
        .from("subscriptions")
        .select(
          "stripe_customer_id, stripe_subscription_id, plan, status",
        )
        .eq("user_id", user.id)
        .maybeSingle();

    let customerId =
      existing?.stripe_customer_id ??
      undefined;

    if (!customerId) {
      const customer =
        await stripe.customers.create({
          email:
            user.email ?? undefined,
          metadata: {
            supabase_user_id:
              user.id,
          },
        });

      customerId = customer.id;

      await supabase
        .from("subscriptions")
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id:
              customerId,
            customer_email:
              user.email ?? null,
          },
          {
            onConflict: "user_id",
          },
        );
    }

    if (
      existing?.stripe_subscription_id &&
      ["active", "trialing"].includes(
        existing.status,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "You already have an active Premium subscription.",
        },
        {
          status: 409,
        },
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const session =
      await stripe.checkout.sessions.create(
        {
          mode: "subscription",

          customer: customerId,

          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],

          success_url:
            `${appUrl}/billing?success=true`,

          cancel_url:
            `${appUrl}/billing?canceled=true`,

          subscription_data: {
            metadata: {
              supabase_user_id:
                user.id,
            },
          },

          metadata: {
            supabase_user_id:
              user.id,
          },

          allow_promotion_codes: true,

          billing_address_collection:
            "auto",
        },
      );

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Create checkout session error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create checkout session.",
      },
      {
        status: 500,
      },
    );
  }
}