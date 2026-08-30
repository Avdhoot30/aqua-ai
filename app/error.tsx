"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
          💧
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-muted-foreground">
          AquaAI couldn't complete that request.
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
        >
          Try again
        </button>
      </div>
    </main>
  );
}