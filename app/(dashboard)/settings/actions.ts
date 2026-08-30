"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const settingsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1)
    .max(100),

  timezone: z.string().min(1),

  wakeTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid wake time.",
    ),

  sleepTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid sleep time.",
    ),

  emailRemindersEnabled: z.boolean(),

  reminderFrequencyMinutes: z
    .number()
    .int()
    .refine(
      (value) =>
        [30, 60, 90, 120, 180].includes(value),
      "Invalid reminder frequency.",
    ),
});

export async function updateSettings(
  input: unknown,
) {
  const parsed =
    settingsSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid settings.",
    );
  }

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const { error } =
    await supabase
      .from("profiles")
      .update({
        full_name:
          parsed.data.fullName,

        timezone:
          parsed.data.timezone,

        wake_time:
          parsed.data.wakeTime,

        sleep_time:
          parsed.data.sleepTime,

        email_reminders_enabled:
          parsed.data
            .emailRemindersEnabled,

        reminder_frequency_minutes:
          parsed.data
            .reminderFrequencyMinutes,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/settings");
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}