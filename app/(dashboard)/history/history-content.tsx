import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getHydrationAnalytics } from "@/lib/hydration/analytics";

export default async function HistoryContent() {
  const user =
    await requireOnboardedUser();

  const analytics =
    await getHydrationAnalytics(
      user.id,
      30,
    );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">
          Your hydration journey
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          History
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review your last 30 days.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border bg-card p-6">
        <div className="grid grid-cols-7 gap-2">
          {analytics.days.map((day) => {
            const date = new Date(
              `${day.date}T00:00:00`,
            );

            const dayNumber =
              date.getDate();

            return (
              <div
                key={day.date}
                className={`aspect-square rounded-xl border p-2 ${
                  day.goalCompleted
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : day.totalMl > 0
                      ? "bg-muted/50"
                      : "bg-background"
                }`}
              >
                <p className="text-xs text-muted-foreground">
                  {dayNumber}
                </p>

                <p className="mt-2 text-xs font-semibold">
                  {day.percentage}%
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">
          Daily summary
        </h2>

        <div className="mt-4 divide-y">
          {analytics.days
            .slice()
            .reverse()
            .map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-medium">
                    {day.date}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Goal:{" "}
                    {(
                      day.goalMl / 1000
                    ).toFixed(1)}
                    L
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {(
                      day.totalMl / 1000
                    ).toFixed(2)}
                    L
                  </p>

                  <p className="text-sm text-cyan-300">
                    {day.percentage}%
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}