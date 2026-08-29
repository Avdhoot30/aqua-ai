export type Plan = "free" | "premium";

export type Feature =
  | "basic_tracking"
  | "basic_history"
  | "basic_analytics"
  | "ai_coach"
  | "advanced_analytics"
  | "data_export"
  | "smart_reminders";

const FEATURES: Record<Plan, Feature[]> = {
  free: [
    "basic_tracking",
    "basic_history",
    "basic_analytics",
  ],
  premium: [
    "basic_tracking",
    "basic_history",
    "basic_analytics",
    "ai_coach",
    "advanced_analytics",
    "data_export",
    "smart_reminders",
  ],
};

export function hasFeature(
  plan: Plan,
  feature: Feature,
) {
  return FEATURES[plan]?.includes(feature) ?? false;
}