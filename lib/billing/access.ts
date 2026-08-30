import { createClient } from "@/lib/supabase/server";

const PREMIUM_STATUSES = [
  "active",
  "trialing",
];

export async function getUserPlan(
  userId: string,
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("subscriptions")
      .select(
        `
        plan,
        status,
        current_period_end,
        cancel_at_period_end
        `,
      )
      .eq(
        "user_id",
        userId,
      )
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
      data?.current_period_end ??
      null,

    cancelAtPeriodEnd:
      data?.cancel_at_period_end ??
      false,
  };
}

export async function hasPremiumAccess(
  userId: string,
) {
  const subscription =
    await getUserPlan(userId);

  return (
    subscription.plan ===
      "premium" &&
    PREMIUM_STATUSES.includes(
      subscription.status,
    )
  );
}