"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "./actions";

const steps = [
  "About you",
  "Activity",
  "Schedule",
  "Your goal",
];

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] =
    useTransition();

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    sex: "prefer_not_to_say",
    heightCm: "",
    weightKg: "",
    activityLevel: "moderate",
    exerciseMinutes: "30",
    wakeTime: "07:00",
    sleepTime: "23:00",
    timezone:
      Intl.DateTimeFormat().resolvedOptions()
        .timeZone,
  });

  const [error, setError] = useState("");

  function updateField(
    field: string,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function next() {
    setError("");

    if (step === 0) {
      if (
        !form.fullName ||
        !form.dateOfBirth ||
        !form.heightCm ||
        !form.weightKg
      ) {
        setError(
          "Please complete all required fields.",
        );
        return;
      }
    }

    setStep((current) => Math.min(current + 1, 3));
  }

  function previous() {
    setError("");
    setStep((current) =>
      Math.max(current - 1, 0),
    );
  }

  function submit() {
    setError("");

    startTransition(async () => {
      const result = await completeOnboarding({
        ...form,
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        exerciseMinutes: Number(
          form.exerciseMinutes,
        ),
      });

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  const estimatedGoal =
    form.weightKg
      ? Math.round(Number(form.weightKg) * 35)
      : 0;

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </span>

          <span className="text-sm text-muted-foreground">
            {steps[step]}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">
                Tell us about yourself
              </h1>

              <p className="mt-2 text-muted-foreground">
                This helps AquaAI personalize your
                hydration target.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full name
              </label>

              <input
                value={form.fullName}
                onChange={(e) =>
                  updateField(
                    "fullName",
                    e.target.value,
                  )
                }
                placeholder="Your name"
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Date of birth
              </label>

              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) =>
                  updateField(
                    "dateOfBirth",
                    e.target.value,
                  )
                }
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sex
              </label>

              <select
                value={form.sex}
                onChange={(e) =>
                  updateField(
                    "sex",
                    e.target.value,
                  )
                }
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
              >
                <option value="prefer_not_to_say">
                  Prefer not to say
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Height (cm)
                </label>

                <input
                  type="number"
                  value={form.heightCm}
                  onChange={(e) =>
                    updateField(
                      "heightCm",
                      e.target.value,
                    )
                  }
                  placeholder="170"
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Weight (kg)
                </label>

                <input
                  type="number"
                  value={form.weightKg}
                  onChange={(e) =>
                    updateField(
                      "weightKg",
                      e.target.value,
                    )
                  }
                  placeholder="70"
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">
                How active are you?
              </h1>

              <p className="mt-2 text-muted-foreground">
                We'll factor your activity into your
                hydration recommendation.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  value: "low",
                  label: "Low",
                  description:
                    "Mostly sitting or light daily activity",
                },
                {
                  value: "moderate",
                  label: "Moderate",
                  description:
                    "Regular walking or exercise",
                },
                {
                  value: "high",
                  label: "High",
                  description:
                    "Frequent or intense exercise",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateField(
                      "activityLevel",
                      option.value,
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    form.activityLevel ===
                    option.value
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <p className="font-semibold">
                    {option.label}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Exercise per day (minutes)
              </label>

              <input
                type="number"
                min="0"
                max="600"
                value={form.exerciseMinutes}
                onChange={(e) =>
                  updateField(
                    "exerciseMinutes",
                    e.target.value,
                  )
                }
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">
                Tell us about your day
              </h1>

              <p className="mt-2 text-muted-foreground">
                This helps us eventually schedule smarter
                reminders.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Wake-up time
              </label>

              <input
                type="time"
                value={form.wakeTime}
                onChange={(e) =>
                  updateField(
                    "wakeTime",
                    e.target.value,
                  )
                }
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sleep time
              </label>

              <input
                type="time"
                value={form.sleepTime}
                onChange={(e) =>
                  updateField(
                    "sleepTime",
                    e.target.value,
                  )
                }
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Detected timezone
              </p>

              <p className="mt-1 font-medium">
                {form.timezone}
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
              💧
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Your AquaAI goal
            </h1>

            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Based on the information you've provided,
              AquaAI has calculated an initial hydration
              target.
            </p>

            <div className="mt-8 rounded-3xl bg-muted/50 p-8">
              <p className="text-sm text-muted-foreground">
                Estimated daily target
              </p>

              <p className="mt-2 text-5xl font-bold">
                {(estimatedGoal / 1000).toFixed(1)} L
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                We'll refine your recommendations as AquaAI
                learns your habits.
              </p>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              This is a wellness estimate, not medical advice.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={previous}
              disabled={isPending}
              className="rounded-xl border px-5 py-3 font-medium transition hover:bg-muted"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={isPending}
              className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
            >
              {isPending
                ? "Setting up..."
                : "Finish setup"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}