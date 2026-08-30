import { ReactNode } from "react";
import { requireUser } from "@/lib/auth/require-user";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { AppHeader } from "@/components/dashboard/app-header";
import { MobileNav } from "@/components/dashboard/mobile-nav";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export async function AuthenticatedShell({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <AppHeader user={user} />

        <main className="min-h-[calc(100vh-4rem)] bg-muted/30 pb-24 md:pb-6">
          {children}
        </main>
      </SidebarInset>

      <MobileNav />
    </SidebarProvider>
  );
}