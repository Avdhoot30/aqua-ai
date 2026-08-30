import { createClient } from "@/lib/supabase/server";
import { WaterLog } from "@/types/hydration";

export async function getActiveHydrationGoal(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hydration_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("effective_from", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getTodayWaterLogs(
  userId: string,
): Promise<WaterLog[]> {
  const supabase = await createClient();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const { data, error } = await supabase
    .from("water_logs")
    .select(
      "id, amount_ml, beverage_type, logged_at, source",
    )
    .eq("user_id", userId)
    .gte("logged_at", start.toISOString())
    .lt("logged_at", end.toISOString())
    .order("logged_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as WaterLog[];
}

export async function getTodayHydration(userId: string) {
  const [goal, logs] = await Promise.all([
    getActiveHydrationGoal(userId),
    getTodayWaterLogs(userId),
  ]);

  const totalMl = logs.reduce(
    (total, log) => total + log.amount_ml,
    0,
  );

  const goalMl = goal?.daily_target_ml ?? 2800;

  const percentage =
    goalMl > 0
      ? Math.min(
          Math.round((totalMl / goalMl) * 100),
          100,
        )
      : 0;

  return {
    goal,
    logs,
    totalMl,
    goalMl,
    percentage,
    remainingMl: Math.max(goalMl - totalMl, 0),
  };
}