import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { createClient } from "@/lib/supabase/server";

import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsContent() {
  const user =
    await requireOnboardedUser();

  const supabase =
    await createClient();

  const { data: profile, error } =
    await supabase
      .from("profiles")
      .select(
        `
        full_name,
        timezone,
        wake_time,
        sleep_time,
        email_reminders_enabled,
        reminder_frequency_minutes
        `,
      )
      .eq("id", user.id)
      .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-cyan-300">
          Your preferences
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Personalize how AquaAI works for you.
        </p>
      </div>

      <div className="mt-8">
        <SettingsForm
          initialValues={{
            fullName:
              profile?.full_name ?? "",

            timezone:
              profile?.timezone ??
              "UTC",

            wakeTime:
              profile?.wake_time ??
              "07:00",

            sleepTime:
              profile?.sleep_time ??
              "23:00",

            emailRemindersEnabled:
              profile
                ?.email_reminders_enabled ??
              true,

            reminderFrequencyMinutes:
              profile
                ?.reminder_frequency_minutes ??
              120,
          }}
        />
      </div>
    </div>
  );
}