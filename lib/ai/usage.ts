import { createClient } from "@/lib/supabase/server";

export async function getTodayAIUsage(
  userId: string,
) {
  const supabase = await createClient();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(
    end.getDate() + 1,
  );

  const {
    count,
    error,
  } = await supabase
    .from("ai_messages")
    .select(
      "id, ai_conversations!inner(user_id)",
      {
        count: "exact",
        head: true,
      },
    )
    .eq(
      "role",
      "user",
    )
    .eq(
      "ai_conversations.user_id",
      userId,
    )
    .gte(
      "created_at",
      start.toISOString(),
    )
    .lt(
      "created_at",
      end.toISOString(),
    );

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}