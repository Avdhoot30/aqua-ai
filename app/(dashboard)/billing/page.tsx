import { Suspense } from "react";

import BillingContent from "./billing-content";

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          Loading billing...
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}