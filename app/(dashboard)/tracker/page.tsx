import { Suspense } from "react";
import TrackerLoading from "./loading";
import {TrackerContent} from "./tracker-content";

export default function TrackerPage() {
  return (
    <Suspense fallback={<TrackerLoading />}>
      <TrackerContent />
    </Suspense>
  );
}