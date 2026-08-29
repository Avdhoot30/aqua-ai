import { Droplets } from "lucide-react";

type AquaLogoProps = {
  collapsed?: boolean;
};

export function AquaLogo({ collapsed = false }: AquaLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-sm">
        <Droplets className="size-5" />
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            AquaAI
          </span>

          <span className="text-[11px] text-muted-foreground">
            Hydration intelligence
          </span>
        </div>
      )}
    </div>
  );
}