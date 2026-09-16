"use client";

import React from "react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Sidebar, type SidebarUser } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

export const DEFAULT_SIDEBAR_USER: SidebarUser = {
  name: "Masum Billah",
  email: "masum@example.com",
};

export interface DashboardShellProps {
  children: React.ReactNode;
  user?: SidebarUser;
  contentClassName?: string;
}

export function DashboardShell({
  children,
  user = DEFAULT_SIDEBAR_USER,
  contentClassName,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar user={user} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header />
        <main className={cn("min-h-0 flex-1 overflow-y-auto p-5", contentClassName)}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default DashboardShell;

