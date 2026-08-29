import Link from "next/link";
import { ArrowRight, Droplets, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Saturday, August 29</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Good afternoon 👋
          </h1>

          <p className="mt-2 text-muted-foreground">
            {`Let's keep your hydration on track today.`}
          </p>
        </div>

        <Link
          href="/tracker"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          <Droplets className="size-4" />
          Log water
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Today's intake"
          value="1.75 L"
          description="of 2.80 L goal"
        />

        <DashboardCard
          title="Progress"
          value="62%"
          description="1.05 L remaining"
        />

        <DashboardCard
          title="Current streak"
          value="5 days"
          description="Keep it going!"
        />

        <DashboardCard
          title="Weekly average"
          value="2.41 L"
          description="+8% from last week"
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{`Today's hydration`}</h2>

              <p className="text-sm text-muted-foreground">
                {"You're making good progress."}
              </p>
            </div>

            <span className="text-sm font-medium text-cyan-300">62%</span>
          </div>

          <div className="mt-8 flex justify-center">
            <HydrationProgress />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <Stat label="Consumed" value="1.75 L" />
            <Stat label="Remaining" value="1.05 L" />
            <Stat label="Goal" value="2.80 L" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
              <Sparkles className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">AI insight</h2>

              <p className="text-xs text-muted-foreground">
                {`Based on today's activity`}
              </p>
            </div>
          </div>

          <p className="mt-6 leading-7 text-muted-foreground">
            {`You're slightly behind your usual hydration pace.`}
            {`Try logging another 300–400 ml before the evening.`}
          </p>

          <Link
            href="/ai-coach"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            Talk to your AI Coach
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-3 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function HydrationProgress() {
  const percentage = 62;

  return (
    <div
      className="relative flex size-52 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(
          hsl(188 86% 53%) ${percentage}%,
          hsl(var(--muted)) ${percentage}% 100%
        )`,
      }}
    >
      <div className="flex size-40 flex-col items-center justify-center rounded-full bg-card">
        <Droplets className="size-7 text-cyan-300" />

        <span className="mt-2 text-4xl font-bold">{percentage}%</span>

        <span className="text-sm text-muted-foreground">complete</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
