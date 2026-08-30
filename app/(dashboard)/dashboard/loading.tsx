export default function DashboardLoading() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-cyan-400" />

        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}