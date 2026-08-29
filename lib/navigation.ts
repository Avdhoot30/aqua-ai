import {
  BarChart3,
  Bell,
  Bot,
  CreditCard,
  Droplets,
  History,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";

export const mainNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tracker",
    href: "/tracker",
    icon: Droplets,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
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
    title: "Reminders",
    href: "/reminders",
    icon: Bell,
  },
];

export const secondaryNavigation = [
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];