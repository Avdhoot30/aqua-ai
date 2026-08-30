import { ReactNode, Suspense } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardShellLoading />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}

function DashboardShellLoading() {
  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-cyan-400" />

          <p className="text-sm text-muted-foreground">
            Loading AquaAI...
          </p>
        </div>
      </div>
    </div>
  );
}