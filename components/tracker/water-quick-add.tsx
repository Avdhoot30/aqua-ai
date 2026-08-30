"use client";

import { useState, useTransition } from "react";
import { Check, Droplets } from "lucide-react";

import { addWater } from "@/app/(dashboard)/tracker/actions";

const amounts = [250, 350, 500, 750] as const;

export function WaterQuickAdd() {
  const [isPending, startTransition] =
    useTransition();

  const [success, setSuccess] =
    useState<number | null>(null);

  function handleAdd(amount: number) {
    setSuccess(null);

    startTransition(async () => {
      try {
        await addWater(amount, "water");

        setSuccess(amount);

        window.setTimeout(() => {
          setSuccess(null);
        }, 1200);
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
          <Droplets className="size-5" />
        </div>

        <div>
          <h2 className="font-semibold">
            Quick add
          </h2>

          <p className="text-sm text-muted-foreground">
            Log water with one tap.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {amounts.map((amount) => {
          const added = success === amount;

          return (
            <button
              key={amount}
              type="button"
              disabled={isPending}
              onClick={() => handleAdd(amount)}
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-4 font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="size-4" />
                  Added
                </span>
              ) : (
                `+${amount} ml`
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}