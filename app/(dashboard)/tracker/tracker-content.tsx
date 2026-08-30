import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getTodayHydration } from "@/lib/hydration/queries";

import { WaterQuickAdd } from "@/components/tracker/water-quick-add";
import { CustomWaterForm } from "@/components/tracker/custom-water-form";
import { WaterLogItem } from "@/components/tracker/water-log-item";

export async function TrackerContent() {
  const user = await requireOnboardedUser();

  const hydration = await getTodayHydration(
    user.id,
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">
          Today
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Hydration Tracker
        </h1>

        <p className="mt-2 text-muted-foreground">
          Every sip counts.
        </p>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            {"Today's intake"}
          </p>

          <p className="mt-3 text-5xl font-bold">
            {(hydration.totalMl / 1000).toFixed(
              2,
            )}
            <span className="ml-1 text-xl text-muted-foreground">
              L
            </span>
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            of{" "}
            {(hydration.goalMl / 1000).toFixed(
              1,
            )}{" "}
            L goal
          </p>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all"
              style={{
                width: `${hydration.percentage}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-cyan-300">
              {hydration.percentage}% complete
            </span>

            <span className="text-muted-foreground">
              {(hydration.remainingMl / 1000).toFixed(
                2,
              )}{" "}
              L left
            </span>
          </div>
        </div>

        <WaterQuickAdd />
      </section>

      <section className="mt-6">
        <CustomWaterForm />
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              {"Today's timeline"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {hydration.logs.length}{" "}
              {hydration.logs.length === 1
                ? "entry"
                : "entries"}{" "}
              today
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {hydration.logs.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="font-medium">
                No drinks logged yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Start with one of the quick-add buttons
                above.
              </p>
            </div>
          ) : (
            hydration.logs.map((log) => (
              <WaterLogItem
                key={log.id}
                log={log}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}