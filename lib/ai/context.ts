import { createClient } from "@/lib/supabase/server";
import { getTodayHydration } from "@/lib/hydration/queries";
import { getHydrationAnalytics } from "@/lib/hydration/analytics";

import type {
  AIHydrationContext,
} from "@/types/ai";

export async function buildHydrationContext(
  userId: string,
): Promise<AIHydrationContext> {
  const supabase = await createClient();

  const [
    profileResult,
    hydration,
    analytics,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, activity_level, weight_kg, height_cm",
      )
      .eq("id", userId)
      .maybeSingle(),

    getTodayHydration(userId),

    getHydrationAnalytics(
      userId,
      14,
    ),
  ]);

  if (profileResult.error) {
    throw new Error(
      profileResult.error.message,
    );
  }

  const profile =
    profileResult.data;

  return {
    profile: {
      fullName:
        profile?.full_name ?? null,

      activityLevel:
        profile?.activity_level ?? null,

      weightKg:
        profile?.weight_kg ?? null,

      heightCm:
        profile?.height_cm ?? null,
    },

    goalMl: hydration.goalMl,

    today: {
      totalMl:
        hydration.totalMl,

      percentage:
        hydration.percentage,

      remainingMl:
        hydration.remainingMl,
    },

    recentDays:
      analytics.days,

    streak: {
      current:
        analytics.currentStreak,

      longest:
        analytics.longestStreak,
    },
  };
}