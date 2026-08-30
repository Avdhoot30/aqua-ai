import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getHydrationAnalytics } from "@/lib/hydration/analytics";
import { HydrationTrendChart } from "@/components/charts/hydration-trend-chart";
import { WeekdayChart } from "@/components/charts/weekday-chart";
import { TimeOfDayChart } from "@/components/charts/time-of-day-chart";

export default async function AnalyticsContent() {
  const user = await requireOnboardedUser();

  const analytics = await getHydrationAnalytics(user.id, 30);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="mt-6 rounded-2xl border bg-card p-6">
        <div>
          <h2 className="font-semibold">Hydration trend</h2>

          <p className="text-sm text-muted-foreground">
            Your daily intake compared with your target.
          </p>
        </div>

        <div className="mt-6">
          <HydrationTrendChart
            data={analytics.days.map((day) => ({
              date: day.date.slice(5),
              intake: day.totalMl,
              goal: day.goalMl,
            }))}
          />
        </div>
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <div>
            <h2 className="font-semibold">Performance by weekday</h2>

            <p className="text-sm text-muted-foreground">
              Which days are easiest for staying hydrated?
            </p>
          </div>

          <div className="mt-6">
            <WeekdayChart data={analytics.weekdayStats} />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div>
            <h2 className="font-semibold">When you drink</h2>

            <p className="text-sm text-muted-foreground">
              Distribution of your logged drinks.
            </p>
          </div>

          <div className="mt-6">
            <TimeOfDayChart data={analytics.timeOfDayStats} />
          </div>
        </div>
      </section>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          label="Daily average"
          value={`${(analytics.averageMl / 1000).toFixed(2)} L`}
        />

        <AnalyticsCard
          label="Goal completion"
          value={`${analytics.averageGoalCompletion}%`}
        />

        <AnalyticsCard
          label="Current streak"
          value={`${analytics.currentStreak} days`}
        />

        <AnalyticsCard
          label="Longest streak"
          value={`${analytics.longestStreak} days`}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="rounded-2xl border bg-card p-6">
          <div>
            <h2 className="font-semibold">Last 30 days</h2>

            <p className="text-sm text-muted-foreground">
              Daily intake vs. your target.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {analytics.days.map((day) => (
              <div
                key={day.date}
                className="grid grid-cols-[90px_1fr_70px] items-center gap-3"
              >
                <span className="text-xs text-muted-foreground">
                  {day.date.slice(5)}
                </span>

                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      day.goalCompleted ? "bg-cyan-400" : "bg-cyan-400/50"
                    }`}
                    style={{
                      width: `${day.percentage}%`,
                    }}
                  />
                </div>

                <span className="text-right text-xs font-medium">
                  {day.totalMl} ml
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="font-semibold">Best day</h2>

          {analytics.bestDay ? (
            <>
              <p className="mt-5 text-4xl font-bold">
                {(analytics.bestDay.totalMl / 1000).toFixed(2)}L
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {analytics.bestDay.date}
              </p>

              <p className="mt-4 text-sm text-cyan-300">
                {analytics.bestDay.percentage}% of your goal
              </p>
            </>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              Keep logging drinks to see your best day.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function AnalyticsCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}
