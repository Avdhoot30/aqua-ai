import { requireUser } from "@/lib/auth/require-user";
import WaterQuickAdd from "./water-quick-add";

export default async function TrackerPage() {
  await requireUser();

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Hydration Tracker</h1>

        <p className="mt-2 text-slate-400">
          Log every drink throughout your day.
        </p>

        <div className="mt-8">
          <WaterQuickAdd />
        </div>
      </div>
    </main>
  );
}