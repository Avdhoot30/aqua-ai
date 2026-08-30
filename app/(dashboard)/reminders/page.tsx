import { Suspense } from "react";

import RemindersContent from "./reminders-content";
import RemindersLoading from "./loading";

export default function RemindersPage() {
  return (
    <Suspense
      fallback={<RemindersLoading />}
    >
      <RemindersContent />
    </Suspense>
  );
}