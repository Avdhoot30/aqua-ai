"use client";

import { useState } from "react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function manageSubscription() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/stripe/create-portal-session",
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to open the billing portal.",
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe portal URL was not returned.",
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );

      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={manageSubscription}
        disabled={loading}
        className="rounded-xl border px-5 py-3 font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Opening..."
          : "Manage subscription"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}