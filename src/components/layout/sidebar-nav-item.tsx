"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { NavItem } from "@/lib/constants/sidebar-nav-data";
import { useSidebar } from "./sidebar-context";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** True if the item's href matches the pathname or if pathname is a sub-route (e.g. /new). */
function isRouteActive(href: string | undefined, pathname: string): boolean {
  if (!href) return false;
  if (href === pathname) return true;
  if (href !== "/" && pathname.startsWith(href + "/")) return true;
  return false;
}

/** True if this item or any descendant matches the current path. */
function branchIsActive(item: NavItem, pathname: string): boolean {
  if (isRouteActive(item.href, pathname)) return true;
  return item.children?.some((child) => branchIsActive(child, pathname)) ?? false;
}

type SidebarNavItemProps = {
  item: NavItem;
  pathname: string;
  level?: number;
  isCollapsed?: boolean;
};

export function SidebarNavItem({
  item,
  pathname,
  level = 0,
  isCollapsed: propIsCollapsed,
}: SidebarNavItemProps) {
  const { isCollapsed: contextIsCollapsed, openSidebar } = useSidebar();
  const isCollapsed = propIsCollapsed ?? contextIsCollapsed;

  const hasChildren = !!item.children?.length;
  const isItemActive = isRouteActive(item.href, pathname);
  const isActiveBranch = branchIsActive(item, pathname);

  const [userOpen, setUserOpen] = useState<boolean | undefined>(undefined);
  const open = userOpen ?? isActiveBranch;

  // Keep active branch open whenever navigating to a sub-route
  useEffect(() => {
    if (isActiveBranch) {
      setUserOpen(true);
    }
  }, [isActiveBranch, pathname]);

  const Icon = item.icon;
  const paddingLeft = 10 + level * 2;

  // In collapsed mode, hide items that do not have an icon
  if (isCollapsed && !Icon) {
    return null;
  }

  const rowClasses = cx(
    "group flex w-full items-center rounded-xl transition-colors cursor-pointer",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A33D]/70",
    isCollapsed ? "justify-center py-2.5 px-0" : "gap-2.5 py-3 text-sm",
    isItemActive
      ? "bg-[#476ab8] text-white font-medium"
      : isActiveBranch
        ? "bg-[#476ab8] font-medium text-white"
        : "text-slate-900 hover:bg-black/[0.04]"
  );

  if (!hasChildren) {
    return (
      <div>
        <Link
          href={item.href ?? "#"}
          aria-current={isItemActive ? "page" : undefined}
          title={isCollapsed ? item.label : undefined}
          onClick={(e) => {
            if (isCollapsed) {
              e.preventDefault();
              openSidebar();
            }
          }}
          className={rowClasses}
          style={isCollapsed ? undefined : { paddingLeft, paddingRight: 12 }}
        >
          {Icon && (
            <div className="bg-white border border-slate-300 rounded-xl p-1 shrink-0">
              <Icon color="#476ab8" size={20} strokeWidth={2} className="shrink-0" />
            </div>
          )}
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={(e) => {
          if (isCollapsed) {
            e.preventDefault();
            openSidebar();
            setUserOpen(true);
          } else {
            setUserOpen(!open);
          }
        }}
        aria-expanded={isCollapsed ? false : open}
        title={isCollapsed ? item.label : undefined}
        className={cx(rowClasses, !isCollapsed && "justify-between")}
        style={isCollapsed ? undefined : { paddingLeft, paddingRight: 12 }}
      >
        <span className={cx("flex min-w-0 items-center", isCollapsed ? "justify-center" : "gap-2.5")}>
          {Icon && (
            <div className="bg-white border border-slate-300 rounded-xl p-1 shrink-0">
              <Icon color="#476ab8" size={20} strokeWidth={2} className="shrink-0" />
            </div>
          )}
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </span>
        {!isCollapsed && (
          open ? (
            <ChevronDown size={15} className="shrink-0 opacity-60" />
          ) : (
            <ChevronRight size={15} className="shrink-0 opacity-60" />
          )
        )}
      </button>

      {/* Grid-rows trick animates to an unknown content height smoothly. */}
      {!isCollapsed && (
        <div
          className={cx(
            "grid transition-[grid-template-rows] duration-200 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div
              className={cx(
                "relative mt-0.5 py-1 space-y-2.5 border-0 border-white/[0.07]",
                "ml-[var(--rail)]"
              )}
              style={{ ["--rail" as string]: `${paddingLeft + 4}px` }}
            >
              {item.children!.map((child) => (
                <SidebarNavItem
                  key={child.label}
                  item={child}
                  pathname={pathname}
                  level={level + 1}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}