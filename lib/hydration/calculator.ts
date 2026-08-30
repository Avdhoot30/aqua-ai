export type ActivityLevel =
  | "low"
  | "moderate"
  | "high";

export type HydrationInput = {
  weightKg: number;
  activityLevel: ActivityLevel;
  exerciseMinutes: number;
};

export type HydrationResult = {
  baseTargetMl: number;
  activityAdjustmentMl: number;
  exerciseAdjustmentMl: number;
  recommendedTargetMl: number;
};

const ACTIVITY_ADJUSTMENTS: Record<
  ActivityLevel,
  number
> = {
  low: 0,
  moderate: 250,
  high: 500,
};

export function calculateHydration(
  input: HydrationInput,
): HydrationResult {
  const baseTargetMl = Math.round(
    input.weightKg * 35,
  );

  const activityAdjustmentMl =
    ACTIVITY_ADJUSTMENTS[input.activityLevel];

  const exerciseAdjustmentMl =
    Math.round(input.exerciseMinutes / 30) * 250;

  const recommendedTargetMl =
    baseTargetMl +
    activityAdjustmentMl +
    exerciseAdjustmentMl;

  return {
    baseTargetMl,
    activityAdjustmentMl,
    exerciseAdjustmentMl,
    recommendedTargetMl,
  };
}