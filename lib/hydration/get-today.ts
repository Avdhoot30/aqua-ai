import { createClient } from "@/lib/supabase/server";

export async function getTodayHydration(userId: string) {
  const supabase = await createClient();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("water_logs")
    .select("amount_ml, logged_at")
    .eq("user_id", userId)
    .gte("logged_at", start.toISOString())
    .lte("logged_at", end.toISOString())
    .order("logged_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const totalMl =
    data?.reduce((sum, log) => sum + log.amount_ml, 0) ?? 0;

  return {
    logs: data ?? [],
    totalMl,
  };
}