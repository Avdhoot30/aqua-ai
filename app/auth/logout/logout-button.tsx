"use client";

import { useTransition } from "react";

import { logout } from "@/app/auth/logout/actions";

export function LogoutButton() {
  const [pending, startTransition] =
    useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(
          async () => {
            await logout();
          },
        );
      }}
      className="w-full rounded-xl px-4 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
    >
      {pending
        ? "Signing out..."
        : "Sign out"}
    </button>
  );
}