import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Flame,
  Goal,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";

import { getTodayHydration } from "@/lib/hydration/queries";
import { getHydrationAnalytics } from "@/lib/hydration/analytics";

import { getUserPlan } from "@/lib/billing/access";

import { getOrCreateDailyInsight } from "@/lib/ai/daily-insight";

import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { PremiumAICard } from "@/components/dashboard/premium-ai-card";

export default async function DashboardContent() {
  const user = await requireOnboardedUser();

  /*
   * Fetch the data that the dashboard needs
   * in parallel.
   */
  const [hydration, analytics, subscription] = await Promise.all([
    getTodayHydration(user.id),

    getHydrationAnalytics(user.id, 7),

    getUserPlan(user.id),
  ]);

  const isPremium =
    subscription.plan === "premium" &&
    ["active", "trialing"].includes(subscription.status);

  /*
   * AI should never be allowed to make the
   * entire dashboard fail.
   */
  let dailyInsight = null;

  if (isPremium) {
    try {
      dailyInsight = await getOrCreateDailyInsight(user.id);
    } catch (error) {
      console.error("Dashboard AI insight error:", error);

      dailyInsight = null;
    }
  }

  const displayName =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "there";

  const todayProgress = hydration.percentage;

  const averageLiters = (analytics.averageMl / 1000).toFixed(2);

  const goalLiters = (hydration.goalMl / 1000).toFixed(1);

  const consumedLiters = (hydration.totalMl / 1000).toFixed(2);

  const remainingLiters = (hydration.remainingMl / 1000).toFixed(2);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ---------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------- */}

      <section>
        <p className="text-sm text-muted-foreground">
          Your hydration dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Good day, {displayName} 👋
        </h1>

        <p className="mt-2 text-muted-foreground">
          {"Here's how your hydration is looking today."}
        </p>
      </section>

      {/* ---------------------------------------- */}
      {/* Today's hydration */}
      {/* ---------------------------------------- */}

      <section className="mt-8">
        <div className="overflow-hidden rounded-3xl border bg-card">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Droplets className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      {"Today's hydration"}
                    </p>

                    <p className="font-semibold">Keep your momentum going</p>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold tracking-tight">
                      {consumedLiters}L
                    </span>

                    <span className="pb-1 text-muted-foreground">
                      / {goalLiters}L
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {remainingLiters}L remaining
                  </p>
                </div>
              </div>

              <div className="w-full max-w-md">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Daily goal</span>

                  <span className="font-semibold">{todayProgress}%</span>
                </div>

                <div className="mt-3 h-4 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all"
                    style={{
                      width: `${Math.min(todayProgress, 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/tracker"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    <Droplets className="size-4" />
                    Log water
                  </Link>

                  <Link
                    href="/analytics"
                    className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                  >
                    View analytics
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------- */}
      {/* KPI cards */}
      {/* ---------------------------------------- */}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Droplets className="size-5" />}
          label="Today's intake"
          value={`${consumedLiters} L`}
          description={`of ${goalLiters} L goal`}
        />

        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="7-day average"
          value={`${averageLiters} L`}
          description="per day"
        />

        <StatCard
          icon={<Flame className="size-5" />}
          label="Current streak"
          value={`${analytics.currentStreak}`}
          description={analytics.currentStreak === 1 ? "day" : "days"}
        />

        <StatCard
          icon={<Goal className="size-5" />}
          label="Goals completed"
          value={`${analytics.goalsCompleted}`}
          description="in the last 7 days"
        />
      </section>

      {/* ---------------------------------------- */}
      {/* AI insight */}
      {/* ---------------------------------------- */}

      <section className="mt-6">
        {isPremium && dailyInsight ? (
          <AIInsightCard
            summary={dailyInsight.summary}
            recommendation={dailyInsight.recommendation}
            severity={
              dailyInsight.severity as "normal" | "positive" | "warning"
            }
          />
        ) : (
          <PremiumAICard />
        )}
      </section>

      {/* ---------------------------------------- */}
      {/* Recent activity */}
      {/* ---------------------------------------- */}

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Recent progress</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your hydration performance over the last 7 days.
              </p>
            </div>

            <Link
              href="/history"
              className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
            >
              View history
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {analytics.days
              .slice()
              .reverse()
              .map((day) => (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-20 shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {formatDashboardDate(day.date)}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          day.goalCompleted ? "bg-cyan-400" : "bg-cyan-400/50"
                        }`}
                        style={{
                          width: `${Math.min(day.percentage, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-20 shrink-0 text-right">
                    <p className="text-sm font-semibold">
                      {(day.totalMl / 1000).toFixed(1)}L
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {day.percentage}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ---------------------------------------- */}
        {/* Best day / quick links */}
        {/* ---------------------------------------- */}

        <div className="rounded-3xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Sparkles className="size-5" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Your best day
              </p>

              <h2 className="font-semibold">Keep building the habit</h2>
            </div>
          </div>

          {analytics.bestDay ? (
            <div className="mt-7">
              <p className="text-4xl font-bold">
                {(analytics.bestDay.totalMl / 1000).toFixed(2)}L
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {formatDashboardDate(analytics.bestDay.date)}
              </p>

              <p className="mt-4 text-sm text-cyan-300">
                {analytics.bestDay.percentage}% of your goal
              </p>
            </div>
          ) : (
            <div className="mt-7">
              <p className="text-sm text-muted-foreground">
                Keep logging drinks and AquaAI will identify your strongest
                days.
              </p>
            </div>
          )}

          <div className="mt-7 space-y-2">
            <DashboardLink href="/reminders" label="Manage reminders" />

            <DashboardLink href="/settings" label="Update preferences" />

            <DashboardLink href="/billing" label="Manage Premium" />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          {icon}
        </div>

        <p className="text-sm text-muted-foreground">{label}</p>
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function DashboardLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition hover:bg-muted"
    >
      <span>{label}</span>

      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function formatDashboardDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
