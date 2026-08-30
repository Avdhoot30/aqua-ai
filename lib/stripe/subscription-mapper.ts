import Stripe from "stripe";

export function mapStripeSubscription(
  subscription: Stripe.Subscription,
) {
  const priceId =
    subscription.items.data[0]?.price?.id ??
    null;

  const status = subscription.status;

  const plan =
    status === "active" ||
    status === "trialing"
      ? "premium"
      : "free";

  return {
    stripe_subscription_id:
      subscription.id,

    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : null,

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
  };
}