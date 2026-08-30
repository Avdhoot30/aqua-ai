import { createClient } from "@/lib/supabase/server";

export async function getUserPlan(
  userId: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "plan, status, current_period_end",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    plan:
      data?.plan === "premium"
        ? "premium"
        : "free",

    status:
      data?.status ?? "inactive",

    currentPeriodEnd:
      data?.current_period_end ?? null,
  };
}

export async function hasPremiumAccess(
  userId: string,
) {
  const subscription =
    await getUserPlan(userId);

  return (
    subscription.plan === "premium" &&
    ["active", "trialing"].includes(
      subscription.status,
    )
  );
}