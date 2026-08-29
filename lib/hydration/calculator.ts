export type ActivityLevel = "low" | "moderate" | "high";

export type HydrationInput = {
  weightKg: number;
  activityLevel: ActivityLevel;
  exerciseMinutes: number;
};

export type HydrationResult = {
  baseTargetMl: number;
  exerciseAdjustmentMl: number;
  recommendedTargetMl: number;
};

const ACTIVITY_ADJUSTMENTS: Record<ActivityLevel, number> = {
  low: 0,
  moderate: 250,
  high: 500,
};

export function calculateHydration(
  input: HydrationInput,
): HydrationResult {
  const weightBasedTarget = input.weightKg * 35;

  const activityAdjustment =
    ACTIVITY_ADJUSTMENTS[input.activityLevel];

  const exerciseAdjustment =
    Math.round(input.exerciseMinutes / 30) * 250;

  const recommendedTarget =
    weightBasedTarget +
    activityAdjustment +
    exerciseAdjustment;

  return {
    baseTargetMl: Math.round(weightBasedTarget),
    exerciseAdjustmentMl: exerciseAdjustment,
    recommendedTargetMl: Math.round(recommendedTarget),
  };
}