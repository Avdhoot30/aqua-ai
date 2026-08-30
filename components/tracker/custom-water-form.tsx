"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";

import { addWater } from "@/app/(dashboard)/tracker/actions";

export function CustomWaterForm() {
  const [amount, setAmount] = useState("");
  const [beverage, setBeverage] =
    useState("water");

  const [isPending, startTransition] =
    useTransition();

  const [error, setError] =
    useState("");

  function submit() {
    setError("");

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    startTransition(async () => {
      try {
        await addWater(
          Math.round(value),
          beverage as
            | "water"
            | "tea"
            | "coffee"
            | "milk"
            | "electrolyte"
            | "other",
        );

        setAmount("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong.",
        );
      }
    });
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div>
        <h2 className="font-semibold">
          Custom entry
        </h2>

        <p className="text-sm text-muted-foreground">
          Add an exact amount.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_180px_auto]">
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium"
          >
            Amount (ml)
          </label>

          <input
            id="amount"
            type="number"
            min="10"
            max="5000"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="400"
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label
            htmlFor="beverage"
            className="mb-2 block text-sm font-medium"
          >
            Beverage
          </label>

          <select
            id="beverage"
            value={beverage}
            onChange={(e) =>
              setBeverage(e.target.value)
            }
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-cyan-400"
          >
            <option value="water">Water</option>
            <option value="tea">Tea</option>
            <option value="coffee">Coffee</option>
            <option value="milk">Milk</option>
            <option value="electrolyte">
              Electrolyte
            </option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="self-end rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            <Plus className="size-4" />
            Add
          </span>
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}