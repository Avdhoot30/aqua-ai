"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Droplets,
  Home,
  MoreHorizontal,
} from "lucide-react";

const items = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Track",
    href: "/tracker",
    icon: Droplets,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "AI Coach",
    href: "/ai-coach",
    icon: Bot,
  },
  {
    title: "More",
    href: "/settings",
    icon: MoreHorizontal,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] ${
                active
                  ? "text-cyan-300"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}