export default function DashboardLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-cyan-400" />

        <p className="text-sm text-muted-foreground">
          Loading AquaAI...
        </p>
      </div>
    </div>
  );
}