"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  Moon,
  TextAlignJustify,
  User,
} from "lucide-react";
import SearchDropdown from "@/components/ui/search-dropdown";
import { useSidebar } from "@/components/layout/sidebar-context";
import { useAuthStore } from "@/store/auth.store";
import { logout as apiLogout } from "@/features/auth/services/auth.service";
import { getFileUrl } from "@/lib/utils";

function getInitials(name?: string): string {
  if (!name) return "MB";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header() {
  const router = useRouter();
  const { toggleSidebar, isCollapsed } = useSidebar();
  const user = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    router.push("/user/details");
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      await apiLogout();
    } catch (e) {
      console.warn("Logout API error:", e);
    } finally {
      storeLogout();
      router.push("/login");
    }
  };

  const initials = getInitials(user?.name);
  const avatarUrl = user?.image || user?.avatar ? getFileUrl(user.image || user.avatar) : null;

  return (
    <header className="h-16 w-full shrink-0 bg-white shadow border-slate-500">
      <div className="flex items-center justify-between gap-x-3 h-full px-4">
        <div>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#476ab8]"
          >
            <TextAlignJustify height={14} width={14} />
          </button>
        </div>
        <div className="flex justify-center items-center gap-x-3">
          <div className="w-92">
            <SearchDropdown />
          </div>
          <div>
            <button
              type="button"
              className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Bell height={14} width={14} />
            </button>
          </div>
          <div>
            <button
              type="button"
              className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Moon height={14} width={14} />
            </button>
          </div>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
              className="h-8 min-w-[5.2rem] px-2 rounded-lg bg-slate-100 flex items-center justify-between border border-blue-700 cursor-pointer hover:bg-slate-200/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user?.name || "User Avatar"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <CircleUserRound height={18} width={18} className="text-slate-600" />
                )}
              </div>
              <span className="mx-1 text-xs font-semibold text-slate-900 tracking-wide">
                {initials}
              </span>
              <ChevronDown
                height={14}
                width={14}
                className={`text-slate-700 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Popup Card */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white shadow-xl border border-blue-200/70 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <User className="h-4 w-4 text-slate-600" />
                  <span>Profile</span>
                </button>

                <div className="border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#dc2626] hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}