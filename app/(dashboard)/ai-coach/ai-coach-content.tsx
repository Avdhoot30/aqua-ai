import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getUserPlan } from "@/lib/billing/access";
import {AICoachChat} from "@/components/ai/ai-coach-chat";

export default async function AICoachContent() {
  const user =
    await requireOnboardedUser();

  const subscription =
    await getUserPlan(user.id);

  const premium =
    subscription.plan ===
    "premium" &&
    ["active", "trialing"].includes(
      subscription.status,
    );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm text-cyan-300">
          Personal hydration intelligence
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          AI Coach
        </h1>

        <p className="mt-2 text-muted-foreground">
          Understand your hydration habits and get practical
          personalized guidance.
        </p>
      </div>

      {!premium ? (
        <AICoachChat />
      ) : (
        <PremiumAICard />
      )}
    </div>
  );
}



function PremiumAICard() {
  return (
    <div className="rounded-3xl border bg-card p-8 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
        ✨
      </div>

      <h2 className="mt-6 text-2xl font-bold">
        Unlock AquaAI Coach
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
        Get personalized hydration insights based on your
        goals, activity and hydration patterns.
      </p>

      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left">
        {[
          "Personalized daily insights",
          "Hydration habit analysis",
          "Weekly AI summaries",
          "Ask questions about your progress",
        ].map((feature) => (
          <div
            key={feature}
            className="rounded-xl bg-muted/50 px-4 py-3 text-sm"
          >
            ✓ {feature}
          </div>
        ))}
      </div>

      <a
        href="/billing"
        className="mt-8 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950"
      >
        Upgrade to Premium
      </a>
    </div>
  );
}