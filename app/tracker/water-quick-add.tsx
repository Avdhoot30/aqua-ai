"use client";

import { useState, useTransition } from "react";
import { addWater } from "@/app/tracker/actions";

const amounts = [250, 350, 500, 750];

export default function WaterQuickAdd() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleAdd(amount: number) {
    setMessage("");

    startTransition(async () => {
      try {
        await addWater(amount);
        setMessage(`Added ${amount} ml`);
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">Log water</h2>

      <p className="mt-1 text-sm text-slate-400">
        Quickly add your latest drink.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {amounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleAdd(amount)}
            disabled={isPending}
            className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 font-medium text-cyan-200 transition hover:bg-cyan-400/20 disabled:opacity-50"
          >
            +{amount} ml
          </button>
        ))}
      </div>

      {message && (
        <p className="mt-4 text-sm text-slate-300">{message}</p>
      )}
    </div>
  );
}