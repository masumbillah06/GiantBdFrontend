"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Sidebar, type SidebarUser } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { logout as authLogout } from "@/features/auth/services/auth.service";
import { isClientAuthenticated } from "@/lib/auth/session";

export const DEFAULT_SIDEBAR_USER: SidebarUser = {
  name: "System Administrator",
  email: "admin@mail.com",
};

export interface DashboardShellProps {
  children: React.ReactNode;
  user?: SidebarUser;
  contentClassName?: string;
}

export function DashboardShell({
  children,
  user,
  contentClassName,
}: DashboardShellProps) {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!user && !isClientAuthenticated()) {
      clearAuth();
      router.replace("/login");
    }
  }, [user, router, clearAuth]);

  const activeUser: SidebarUser = useMemo(() => {
    if (user) return user;
    if (authUser) {
      return {
        name: authUser.name,
        email: authUser.email,
        avatarUrl: authUser.avatar || authUser.image || undefined,
      };
    }
    return DEFAULT_SIDEBAR_USER;
  }, [user, authUser]);

  const handleLogout = async () => {
    try {
      await authLogout();
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar user={activeUser} onLogout={handleLogout} />
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
