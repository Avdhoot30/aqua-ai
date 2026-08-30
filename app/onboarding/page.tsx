import { Suspense } from "react";

import { OnboardingContent } from "./onboarding-content";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <Suspense
          fallback={
            <div className="text-sm text-slate-400">
              Loading onboarding...
            </div>
          }
        >
          <OnboardingContent />
        </Suspense>
      </div>
    </main>
  );
}