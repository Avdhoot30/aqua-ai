import { requireOnboardedUser } from "@/lib/auth/require-onboarded-user";
import { getReminders } from "@/lib/reminders/queries";
import { ReminderForm } from "@/components/reminders/reminder-form";

export default async function RemindersContent() {
  const user =
    await requireOnboardedUser();

  const reminders =
    await getReminders(user.id);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">
          Stay consistent
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Reminders
        </h1>

        <p className="mt-2 text-muted-foreground">
          Let AquaAI help you remember to drink.
        </p>
      </div>

      <div className="mt-8">
        <ReminderForm />
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">
          Your reminders
        </h2>

        {reminders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You haven't created any reminders yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {reminders.map(
              (reminder) => (
                <div
                  key={reminder.id}
                  className="flex flex-col justify-between gap-3 rounded-xl bg-muted/40 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-lg font-semibold">
                      {reminder.reminder_time.slice(
                        0,
                        5,
                      )}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {reminder.amount_ml} ml
                      {" · "}
                      {reminder.mode ===
                      "smart"
                        ? "Smart"
                        : "Fixed"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {reminder.days_of_week?.map(
                      (day: number) => (
                        <span
                          key={day}
                          className="rounded-lg bg-background px-2 py-1 text-xs"
                        >
                          {
                            [
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                              "Sun",
                            ][day - 1]
                          }
                        </span>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}