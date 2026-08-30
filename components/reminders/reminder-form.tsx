"use client";

import { useState, useTransition } from "react";
import { createReminder } from "@/app/(dashboard)/reminders/actions";

const days = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 7, label: "Sun" },
];

export function ReminderForm() {
  const [
    reminderTime,
    setReminderTime,
  ] = useState("10:00");

  const [amountMl, setAmountMl] =
    useState("250");

  const [mode, setMode] =
    useState<"fixed" | "smart">(
      "smart",
    );

  const [
    daysOfWeek,
    setDaysOfWeek,
  ] = useState<number[]>(
    days.map((day) => day.value),
  );

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [message, setMessage] =
    useState("");

  function toggleDay(day: number) {
    setDaysOfWeek((current) =>
      current.includes(day)
        ? current.filter(
            (item) => item !== day,
          )
        : [...current, day].sort(),
    );
  }

  function submit() {
    setMessage("");

    startTransition(async () => {
      try {
        await createReminder({
          reminderTime,
          amountMl: Number(
            amountMl,
          ),
          mode,
          daysOfWeek,
        });

        setMessage(
          "Reminder created.",
        );
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      }
    });
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="font-semibold">
        Add reminder
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Build a hydration habit that fits your day.
      </p>

      <div className="mt-6 grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Reminder time
          </label>

          <input
            type="time"
            value={reminderTime}
            onChange={(event) =>
              setReminderTime(
                event.target.value,
              )
            }
            className="rounded-xl border bg-background px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Amount
          </label>

          <input
            type="number"
            min={50}
            max={2000}
            value={amountMl}
            onChange={(event) =>
              setAmountMl(
                event.target.value,
              )
            }
            className="w-full rounded-xl border bg-background px-4 py-3"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">
            Reminder mode
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setMode("smart")
              }
              className={`rounded-xl border p-4 text-left ${
                mode === "smart"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : ""
              }`}
            >
              <p className="font-semibold">
                Smart
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Adapts to your progress.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setMode("fixed")
              }
              className={`rounded-xl border p-4 text-left ${
                mode === "fixed"
                  ? "border-cyan-400 bg-cyan-400/10"
                  : ""
              }`}
            >
              <p className="font-semibold">
                Fixed
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Always follows this schedule.
              </p>
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">
            Days
          </p>

          <div className="flex flex-wrap gap-2">
            {days.map((day) => {
              const active =
                daysOfWeek.includes(
                  day.value,
                );

              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() =>
                    toggleDay(
                      day.value,
                    )
                  }
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    active
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "text-muted-foreground"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
        >
          {isPending
            ? "Creating..."
            : "Create reminder"}
        </button>

        {message && (
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}