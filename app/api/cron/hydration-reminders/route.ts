import { NextRequest } from "next/server";

import { getAdminClient } from "@/lib/supabase/admin";

import { sendHydrationReminder } from "@/lib/email/send-hydration-reminder";

import { getReminderSlot } from "@/lib/reminders/time";

import { isReminderDue } from "@/lib/reminders/eligibility";

function authorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  const expected = `Bearer ${process.env.CRON_SECRET}`;

  return authHeader === expected;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const supabase = getAdminClient();

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
        timezone,
        email_reminders_enabled
      `,
    )
    .eq("email_reminders_enabled", true);

  if (profileError) {
    console.error("Profile query failed:", profileError);

    return new Response("Failed to load profiles.", {
      status: 500,
    });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const profile of profiles ?? []) {
    try {
      const timezone = profile.timezone ?? "UTC";

      /*
       * Get enabled reminders for this user.
       */
      const { data: reminders, error: reminderError } = await supabase
        .from("reminders")
        .select(
          `
            id,
            reminder_time,
            amount_ml,
            mode,
            enabled,
            days_of_week
          `,
        )
        .eq("user_id", profile.id)
        .eq("enabled", true);

      if (reminderError) {
        throw new Error(`Failed to load reminders: ${reminderError.message}`);
      }

      if (!reminders?.length) {
        console.log(`No enabled reminders for ${profile.id}`);

        skipped++;
        continue;
      }

      /*
       * Process each reminder separately.
       */
      for (const reminder of reminders) {
        try {
          const due = isReminderDue(reminder, timezone);

          if (!due) {
            continue;
          }

          const scheduledFor = getReminderSlot(
            timezone,
            reminder.reminder_time,
          );

          /*
           * Check whether this exact reminder
           * has already been delivered.
           */
          const { data: existingDelivery } = await supabase
            .from("reminder_deliveries")
            .select("id")
            .eq("reminder_id", reminder.id)
            .eq("scheduled_for", scheduledFor)
            .eq("channel", "email")
            .maybeSingle();

          if (existingDelivery) {
            console.log(`Already sent reminder ${reminder.id}`);

            continue;
          }

          /*
           * Get active hydration goal.
           */
          const { data: goal, error: goalError } = await supabase
            .from("hydration_goals")
            .select("daily_target_ml")
            .eq("user_id", profile.id)
            .eq("is_active", true)
            .maybeSingle();

          if (goalError) {
            throw new Error(
              `Failed to load hydration goal: ${goalError.message}`,
            );
          }

          if (!goal) {
            console.log(`No active goal for ${profile.id}`);

            continue;
          }

          /*
           * Determine today's local date range.
           */
          const todayStart = getTodayStartUtc(timezone);

          const tomorrowStart = getTomorrowStartUtc(timezone);

          const { data: logs, error: logsError } = await supabase
            .from("water_logs")
            .select("amount_ml")
            .eq("user_id", profile.id)
            .gte("logged_at", todayStart)
            .lt("logged_at", tomorrowStart);

          if (logsError) {
            throw new Error(`Failed to load water logs: ${logsError.message}`);
          }

          const consumedMl = (logs ?? []).reduce(
            (total, log) => total + log.amount_ml,
            0,
          );

          const remainingMl = Math.max(goal.daily_target_ml - consumedMl, 0);

          /*
           * Goal already completed.
           */
          if (remainingMl <= 0) {
            console.log(`Goal completed for ${profile.id}`);

            continue;
          }

          /*
           * Get auth email.
           */
          const email = await getUserEmail(profile.id);

          if (!email) {
            console.log(`No email found for ${profile.id}`);

            continue;
          }

          const reminderAmount =
            reminder.mode === "smart"
              ? Math.min(
                  calculateSmartAmount(remainingMl, goal.daily_target_ml),
                  remainingMl,
                )
              : Math.min(reminder.amount_ml ?? 250, remainingMl);

          const idempotencyKey = `${profile.id}:${reminder.id}:${scheduledFor}:email`;

          console.log("Sending reminder:", {
            userId: profile.id,
            reminderId: reminder.id,
            reminderTime: reminder.reminder_time,
            scheduledFor,
            amountMl: reminderAmount,
            remainingMl,
          });

          const result = await sendHydrationReminder({
            to: email,
            name: profile.full_name ?? "there",
            amountMl: reminderAmount,
            remainingMl,
            goalMl: goal.daily_target_ml,
            idempotencyKey,
          });

          const { error: deliveryInsertError } = await supabase
            .from("reminder_deliveries")
            .insert({
              reminder_id: reminder.id,
              user_id: profile.id,
              scheduled_for: scheduledFor,
              channel: "email",
              status: "sent",
              provider_message_id: result?.id ?? null,
            });

          if (deliveryInsertError) {
            throw new Error(
              `Failed to save reminder delivery: ${deliveryInsertError.message}`,
            );
          }

          sent++;
        } catch (error) {
          console.error(
            `Reminder ${reminder.id} failed for ${profile.id}:`,
            error,
          );

          failed++;
        }
      }
    } catch (error) {
      console.error(`Profile ${profile.id} processing failed:`, error);

      failed++;
    }
  }

  return Response.json({
    sent,
    skipped,
    failed,
  });
}

function calculateSmartAmount(remainingMl: number, goalMl: number) {
  const remainingPercentage = goalMl > 0 ? remainingMl / goalMl : 0;

  if (remainingPercentage > 0.6) {
    return 300;
  }

  if (remainingPercentage > 0.3) {
    return 250;
  }

  return 200;
}

function getTodayStartUtc(timezone: string) {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(now);

  const year = parts.find((p) => p.type === "year")?.value;

  const month = parts.find((p) => p.type === "month")?.value;

  const day = parts.find((p) => p.type === "day")?.value;

  /*
   * Use the timezone-aware helper from
   * Intl to determine the calendar date.
   *
   * The exact UTC boundary will be refined
   * through the shared date service later.
   */
  const localMidnight = `${year}-${month}-${day}T00:00:00`;

  const parsed = new Date(localMidnight);

  return parsed.toISOString();
}

function getTomorrowStartUtc(timezone: string) {
  const start = new Date(getTodayStartUtc(timezone));

  start.setUTCDate(start.getUTCDate() + 1);

  return start.toISOString();
}

async function getUserEmail(userId: string) {
  const supabase = getAdminClient();

  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) {
    console.error("Failed to load user email:", error);

    return null;
  }

  return data.user?.email ?? null;
}
