import { requireUser } from "@/lib/auth/require-user";
import WaterQuickAdd from "./water-quick-add";
import { Suspense } from "react";

// 1️⃣ The layout shell remains static and builds flawlessly
export default function TrackerPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Hydration Tracker</h1>

        <p className="mt-2 text-slate-400">
          Log every drink throughout your day.
        </p>

        {/* 🌟 Suspense boundary isolates the dynamic authorization check */}
        <Suspense
          fallback={
            <div className="mt-8 text-slate-400">Loading your tracker...</div>
          }
        >
          <AuthenticatedTrackerSection />
        </Suspense>
      </div>
    </main>
  );
}

// 2️⃣ The dynamic auth check and child component execution is safely handled here
async function AuthenticatedTrackerSection() {
  await requireUser();

  return (
    <div className="mt-8">
      <WaterQuickAdd />
    </div>
  );
}
