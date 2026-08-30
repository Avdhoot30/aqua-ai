import { getAdminClient } from "@/lib/supabase/admin";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function getTodayAIUsage(
  userId: string,
) {
  const supabase = getAdminClient();

  const today = getTodayDate();

  const { data, error } = await supabase
    .from("ai_usage_daily")
    .select("request_count")
    .eq("user_id", userId)
    .eq("usage_date", today)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to read AI usage: ${error.message}`,
    );
  }

  return data?.request_count ?? 0;
}

export async function tryConsumeAIRequest(
  userId: string,
  dailyLimit: number,
) {
  const supabase = getAdminClient();

  const today = getTodayDate();

  const { data, error } = await supabase.rpc(
    "try_consume_ai_request",
    {
      p_user_id: userId,
      p_usage_date: today,
      p_daily_limit: dailyLimit,
    },
  );

  if (error) {
    throw new Error(
      `Unable to consume AI usage: ${error.message}`,
    );
  }

  const result = data?.[0];

  return {
    allowed: result?.allowed ?? false,
    usageCount: result?.usage_count ?? 0,
  };
}