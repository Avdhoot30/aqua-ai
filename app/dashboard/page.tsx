import { requireUser } from "@/lib/auth/require-user";
import { getTodayHydration } from "@/lib/hydration/get-today";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireUser();

  const hydration = await getTodayHydration(user.id);

  const dailyGoal = 2800;

  const percentage = Math.min(
    Math.round((hydration.totalMl / dailyGoal) * 100),
    100,
  );

  const remaining = Math.max(dailyGoal - hydration.totalMl, 0);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-400">Today</p>

            <h1 className="mt-1 text-3xl font-bold">Your hydration</h1>
          </div>

          <Link
            href="/tracker"
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
          >
            + Add water
          </Link>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">{"Today's intake"}</p>

            <p className="mt-3 text-4xl font-bold">
              {(hydration.totalMl / 1000).toFixed(2)} L
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Goal: {(dailyGoal / 1000).toFixed(1)} L
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Progress</p>

            <p className="mt-3 text-4xl font-bold">{percentage}%</p>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Remaining</p>

            <p className="mt-3 text-4xl font-bold">
              {(remaining / 1000).toFixed(2)} L
            </p>

            <p className="mt-2 text-sm text-slate-500">Keep going.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
