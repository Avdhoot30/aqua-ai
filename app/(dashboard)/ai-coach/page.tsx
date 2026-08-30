import { Suspense } from "react";

import AICoachContent from "./ai-coach-content";
import AICoachLoading from "./loading";

export default function AICoachPage() {
  console.log("Node Environment:", process.env.NODE_ENV);
  return (
    <Suspense fallback={<AICoachLoading />}>
      <AICoachContent />
    </Suspense>
  );
}
