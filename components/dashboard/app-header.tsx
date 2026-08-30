"use client";

import { Bell, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

type AppUser = {
  id: string;
  email?: string;
};

type AppHeaderProps = {
  user: AppUser;
};

export function AppHeader({ user }: AppHeaderProps) {
  const { toggleSidebar } = useSidebar();

  const email = user.email ?? "";
  const initial = email.charAt(0).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex size-9 items-center justify-center rounded-lg border md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="size-5" />
        </button>

        <div className="md:hidden">
          <span className="font-semibold">
            AquaAI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative inline-flex size-9 items-center justify-center rounded-lg border"
          aria-label="Notifications"
        >
          <Bell className="size-4" />

          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-400" />
        </button>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-cyan-400 font-semibold text-slate-950"
          aria-label={`Account for ${email}`}
        >
          {initial}
        </button>
      </div>
    </header>
  );
}