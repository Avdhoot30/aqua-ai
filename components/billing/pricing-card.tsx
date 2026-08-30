"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Props = {
  title: string;
  price: string;
  period: string;
  priceId: string;
  popular?: boolean;
};

export function PricingCard({
  title,
  price,
  period,
  priceId,
  popular = false,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function subscribe() {
    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/stripe/create-checkout-session",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              priceId,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to start checkout.",
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe checkout URL was not returned.",
        );
      }

      window.location.href =
        data.url;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );

      setLoading(false);
    }
  }

  return (
    <div
      className={`relative rounded-3xl border bg-card p-6 ${
        popular
          ? "border-cyan-400 shadow-lg shadow-cyan-400/10"
          : ""
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950">
          Best value
        </span>
      )}

      <p className="text-sm font-medium text-muted-foreground">
        {title}
      </p>

      <div className="mt-4">
        <span className="text-4xl font-bold">
          {price}
        </span>

        <span className="ml-1 text-sm text-muted-foreground">
          {period}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {[
          "Personalized AI Coach",
          "Advanced hydration analytics",
          "Smart reminders",
          "Historical trends",
          "Priority features",
        ].map((feature) => (
          <div
            key={feature}
            className="flex gap-2 text-sm"
          >
            <Check className="mt-0.5 size-4 text-cyan-400" />

            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={subscribe}
        disabled={loading}
        className="mt-8 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Redirecting...
          </span>
        ) : (
          "Choose Premium"
        )}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}