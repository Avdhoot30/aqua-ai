"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const reminderSchema = z.object({
  reminderTime: z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
  ),

  amountMl: z
    .number()
    .int()
    .min(50)
    .max(2000),

  mode: z.enum(["fixed", "smart"]),

  daysOfWeek: z
    .array(z.number().int().min(1).max(7))
    .min(1),
});

export async function createReminder(
  input: unknown,
) {
  const parsed =
    reminderSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid reminder.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const { error } = await supabase
    .from("reminders")
    .insert({
      user_id: user.id,
      reminder_time:
        parsed.data.reminderTime,
      amount_ml: parsed.data.amountMl,
      mode: parsed.data.mode,
      days_of_week:
        parsed.data.daysOfWeek,
      enabled: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/reminders");
}