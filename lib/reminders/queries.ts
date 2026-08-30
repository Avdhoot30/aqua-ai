import { createClient } from "@/lib/supabase/server";

export async function getReminders(
  userId: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("reminder_time", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}