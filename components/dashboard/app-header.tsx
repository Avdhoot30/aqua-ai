"use client";

import { Bell, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="inline-flex size-9 items-center justify-center rounded-lg border md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="size-5" />
        </button>

        <div className="md:hidden">
          <span className="font-semibold">AquaAI</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative inline-flex size-9 items-center justify-center rounded-lg border"
          aria-label="Notifications"
        >
          <Bell className="size-4" />

          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-400" />
        </button>

        <button
          className="flex size-9 items-center justify-center rounded-full bg-cyan-400 font-semibold text-slate-950"
          aria-label="Account"
        >
          A
        </button>
      </div>
    </header>
  );
}