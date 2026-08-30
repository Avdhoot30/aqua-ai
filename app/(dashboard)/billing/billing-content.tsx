import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getUserPlan } from "@/lib/billing/access";
import { PricingCard } from "@/components/billing/pricing-card";
import { BillingAlert } from "@/components/billing/billing-alert";
export default async function BillingContent() {
  const user = await requireOnboardedUser();

  const subscription = await getUserPlan(user.id);

  const premium =
    subscription.plan === "premium" &&
    ["active", "trialing"].includes(subscription.status);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-cyan-300">AquaAI Premium</p>

        <BillingAlert status={subscription.status} />

        <p className="mt-2 text-muted-foreground">
          Unlock the full AquaAI experience.
        </p>
      </div>

      {premium ? (
        <PremiumStatus
          status={subscription.status}
          currentPeriodEnd={subscription.currentPeriodEnd}
        />
      ) : (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <PricingCard
            title="Monthly"
            price="₹299"
            period="/month"
            priceId={process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!}
          />

          <PricingCard
            title="Yearly"
            price="₹2,499"
            period="/year"
            priceId={process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!}
            popular
          />
        </section>
      )}
    </div>
  );
}

function PremiumStatus({
  status,
  currentPeriodEnd,
}: {
  status: string;
  currentPeriodEnd: string | null;
}) {
  return (
    <div className="mt-8 rounded-3xl border border-cyan-400/30 bg-cyan-400/5 p-8">
      <div className="flex size-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
        ✨
      </div>

      <h2 className="mt-5 text-2xl font-bold">{"You're a Premium member"}</h2>

      <p className="mt-2 text-muted-foreground">Status: {status}</p>

      {currentPeriodEnd && (
        <p className="mt-1 text-sm text-muted-foreground">
          Current period ends on{" "}
          {new Date(currentPeriodEnd).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
