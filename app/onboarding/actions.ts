"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { calculateHydration } from "@/lib/hydration/calculator";
import { onboardingSchema } from "@/lib/validations/onboarding";

export async function completeOnboarding(
  rawData: unknown,
) {
  const parsed =
    onboardingSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your information and try again.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const data = parsed.data;

  const hydration = calculateHydration({
    weightKg: data.weightKg,
    activityLevel: data.activityLevel,
    exerciseMinutes: data.exerciseMinutes,
  });

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.fullName,
      date_of_birth: data.dateOfBirth,
      sex: data.sex,
      height_cm: data.heightCm,
      weight_kg: data.weightKg,
      activity_level: data.activityLevel,
      timezone: data.timezone,
      wake_time: data.wakeTime,
      sleep_time: data.sleepTime,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    return {
      success: false,
      error: profileError.message,
    };
  }

  // Deactivate existing goals.
  const { error: deactivateError } = await supabase
    .from("hydration_goals")
    .update({
      is_active: false,
    })
    .eq("user_id", user.id);

  if (deactivateError) {
    return {
      success: false,
      error: deactivateError.message,
    };
  }

  // Create the new goal.
  const { error: goalError } = await supabase
    .from("hydration_goals")
    .insert({
      user_id: user.id,
      daily_target_ml:
        hydration.recommendedTargetMl,
      calculation_method:
        "weight_activity_exercise",
      effective_from: new Date()
        .toISOString()
        .slice(0, 10),
      is_active: true,
    });

  if (goalError) {
    return {
      success: false,
      error: goalError.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  revalidatePath("/settings");
  revalidatePath("/tracker");

  redirect("/dashboard");
}