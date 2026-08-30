import Link from "next/link";
import { Sparkles } from "lucide-react";

export function PremiumAICard() {
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <Sparkles className="size-5" />
        </div>

        <div>
          <p className="text-sm font-semibold">
            Daily AI insights
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Let AquaAI analyze your hydration habits and give
            you a personalized suggestion every day.
          </p>

          <Link
            href="/billing"
            className="mt-4 inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Unlock Premium
          </Link>
        </div>
      </div>
    </div>
  );
}