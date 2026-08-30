import Link from "next/link";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type Props = {
  summary: string;
  recommendation: string | null;
  severity:
    | "normal"
    | "positive"
    | "warning";
};

export function AIInsightCard({
  summary,
  recommendation,
  severity,
}: Props) {
  const Icon =
    severity === "positive"
      ? TrendingUp
      : severity === "warning"
        ? TrendingDown
        : Sparkles;

  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-300">
                Daily AI insight
              </p>

              <h2 className="mt-1 font-semibold">
                Your hydration today
              </h2>
            </div>

            <Link
              href="/ai-coach"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Ask AquaAI →
            </Link>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {summary}
          </p>

          {recommendation && (
            <div className="mt-4 rounded-xl bg-muted/50 p-4">
              <p className="text-xs font-medium text-cyan-300">
                Recommendation
              </p>

              <p className="mt-1 text-sm">
                {recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}