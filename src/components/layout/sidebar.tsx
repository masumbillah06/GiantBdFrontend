"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { sidebarNav } from "@/lib/constants/sidebar-nav-data";
import { SidebarNavItem } from "./sidebar-nav-item";
import { useSidebar } from "./sidebar-context";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type SidebarUser = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type SidebarProps = {
  user: SidebarUser;
  onLogout?: () => void;
  logoSrc?: string;
  logoHref?: string;
  isCollapsed?: boolean;
};

export function Sidebar({
  user,
  onLogout,
  logoSrc = "/image.png",
  logoHref = "/inventory/dashboard",
  isCollapsed: propIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed: contextIsCollapsed } = useSidebar();
  const isCollapsed = propIsCollapsed ?? contextIsCollapsed;
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <aside
      className={cx(
        "flex h-full min-h-0 shadow-md flex-col bg-slate-50 text-slate-900 shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header — fixed */}
      <div className="flex h-16 shrink-0 items-center justify-center px-2">
        <Link
          href={logoHref}
          title="Giant BD"
          className="flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A33D]/70 overflow-hidden"
        >
          <Image
            src={logoSrc}
            alt="GiantBD logo"
            width={170}
            height={64}
            priority
            className={
              isCollapsed
                ? "h-9 w-auto max-w-[48px] object-contain"
                : "h-22 w-auto object-contain"
            }
          />
        </Link>
      </div>

      {/* Navigation — the ONLY scrollable region */}
      <nav
        aria-label="Main navigation"
        className={cx(
          "min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-3",
          isCollapsed ? "px-2" : "px-3"
        )}
      >
        <div className="space-y-0.5">
          {sidebarNav.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              pathname={pathname}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* Footer — fixed */}
      <div className="shrink-0 border-t border-gray-300">
        <div
          className={cx(
            "bg-[#476ab8] rounded-xl transition-all",
            isCollapsed ? "m-2 p-2 flex items-center justify-center" : "m-3 px-3 py-2"
          )}
        >
          <div className={cx("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={36}
                height={36}
                title={user.name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                title={user.name}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6c84b9] text-sm font-medium text-white"
              >
                {initial}
              </span>
            )}

            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-white">{user.email}</p>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  aria-label="Log out"
                  title="Log out"
                  className="shrink-0 rounded-md p-2 text-white transition-colors hover:bg-white/[0.06] hover:text-[#E8EAF0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A33D]/70"
                >
                  <LogOut size={17} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}