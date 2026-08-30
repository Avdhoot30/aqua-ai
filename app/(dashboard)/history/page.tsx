import { Suspense } from "react";

import HistoryContent from "./history-content";
import HistoryLoading from "./loading";

export default function HistoryPage() {
  return (
    <Suspense fallback={<HistoryLoading />}>
      <HistoryContent />
    </Suspense>
  );
}