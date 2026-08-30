import { Suspense } from "react";

import DashboardContent from "./dashboard-content";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <DashboardLoading />
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-muted" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-muted"
              />
            ),
          )}
        </div>

        <div className="h-80 animate-pulse rounded-3xl bg-muted" />
      </div>
    </div>
  );
}