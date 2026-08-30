"use client";

import { useState, useTransition } from "react";

import { updateSettings } from "@/app/(dashboard)/settings/actions";

type Props = {
  initialValues: {
    fullName: string;
    timezone: string;
    wakeTime: string;
    sleepTime: string;
    emailRemindersEnabled: boolean;
    reminderFrequencyMinutes: number;
  };
};

const frequencies = [
  30,
  60,
  90,
  120,
  180,
];

export function SettingsForm({
  initialValues,
}: Props) {
  const [fullName, setFullName] =
    useState(initialValues.fullName);

  const [timezone, setTimezone] =
    useState(initialValues.timezone);

  const [wakeTime, setWakeTime] =
    useState(initialValues.wakeTime);

  const [sleepTime, setSleepTime] =
    useState(initialValues.sleepTime);

  const [
    emailRemindersEnabled,
    setEmailRemindersEnabled,
  ] = useState(
    initialValues.emailRemindersEnabled,
  );

  const [
    reminderFrequencyMinutes,
    setReminderFrequencyMinutes,
  ] = useState(
    initialValues.reminderFrequencyMinutes,
  );

  const [pending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function save() {
    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        await updateSettings({
          fullName,
          timezone,
          wakeTime,
          sleepTime,
          emailRemindersEnabled,
          reminderFrequencyMinutes,
        });

        setMessage(
          "Settings saved successfully.",
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to save settings.",
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">
          Profile
        </h2>

        <div className="mt-5">
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium"
          >
            Full name
          </label>

          <input
            id="fullName"
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold">
          Schedule
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="wakeTime"
              className="mb-2 block text-sm font-medium"
            >
              Wake time
            </label>

            <input
              id="wakeTime"
              type="time"
              value={wakeTime.slice(0, 5)}
              onChange={(event) =>
                setWakeTime(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border bg-background px-4 py-3"
            />
          </div>

          <div>
            <label
              htmlFor="sleepTime"
              className="mb-2 block text-sm font-medium"
            >
              Sleep time
            </label>

            <input
              id="sleepTime"
              type="time"
              value={sleepTime.slice(0, 5)}
              onChange={(event) =>
                setSleepTime(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border bg-background px-4 py-3"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="timezone"
              className="mb-2 block text-sm font-medium"
            >
              Timezone
            </label>

            <input
              id="timezone"
              value={timezone}
              onChange={(event) =>
                setTimezone(event.target.value)
              }
              placeholder="Asia/Kolkata"
              className="w-full rounded-xl border bg-background px-4 py-3"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">
              Email reminders
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Receive hydration reminders by email.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEmailRemindersEnabled(
                (current) => !current,
              )
            }
            className={`relative h-7 w-12 rounded-full transition ${
              emailRemindersEnabled
                ? "bg-cyan-400"
                : "bg-muted"
            }`}
            aria-label="Toggle email reminders"
          >
            <span
              className={`absolute top-1 size-5 rounded-full bg-white transition ${
                emailRemindersEnabled
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="mt-6">
          <label
            htmlFor="frequency"
            className="mb-2 block text-sm font-medium"
          >
            Reminder frequency
          </label>

          <select
            id="frequency"
            value={
              reminderFrequencyMinutes
            }
            onChange={(event) =>
              setReminderFrequencyMinutes(
                Number(event.target.value),
              )
            }
            disabled={
              !emailRemindersEnabled
            }
            className="w-full rounded-xl border bg-background px-4 py-3 disabled:opacity-50"
          >
            {frequencies.map(
              (minutes) => (
                <option
                  key={minutes}
                  value={minutes}
                >
                  Every {minutes} minutes
                </option>
              ),
            )}
          </select>
        </div>
      </section>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50 sm:w-auto"
      >
        {pending
          ? "Saving..."
          : "Save settings"}
      </button>

      {message && (
        <p className="text-sm text-cyan-300">
          {message}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}