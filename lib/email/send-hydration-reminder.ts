import { getResendClient } from "@/lib/email/resend";
import {
  HydrationReminderEmail,
} from "@/components/email/hydration-reminder";

type Params = {
  to: string;
  name: string;
  amountMl: number;
  remainingMl: number;
  goalMl: number;
  idempotencyKey: string;
};

export async function sendHydrationReminder({
  to,
  name,
  amountMl,
  remainingMl,
  goalMl,
  idempotencyKey,
}: Params) {
  const resend =
    getResendClient();

  const from =
    process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error(
      "RESEND_FROM_EMAIL is not configured.",
    );
  }

  const result =
    await resend.emails.send({
      from,
      to: [to],
      subject:
        "💧 Time for a hydration check-in",
      react: HydrationReminderEmail({
        name,
        amountMl,
        remainingMl,
        goalMl,
      }),
      headers: {
        "X-AquaAI-Reminder":
          idempotencyKey,
      },
    });

  if (result.error) {
    throw new Error(
      result.error.message,
    );
  }

  return result.data;
}