import { Suspense } from "react";

import AnalyticsContent from "./analytics-content";
import AnalyticsLoading from "./loading";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsContent />
    </Suspense>
  );
}