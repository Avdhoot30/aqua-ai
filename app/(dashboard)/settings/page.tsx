import { Suspense } from "react";

import SettingsContent from "./settings-content";

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          Loading settings...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}