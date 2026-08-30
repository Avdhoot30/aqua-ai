"use client";

import { useSearchParams } from "next/navigation";

export function LoginMessage() {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  const success = searchParams.get("success");

  if (!error && !success) {
    return null;
  }

  if (error) {
    return (
      <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
      {success}
    </div>
  );
}