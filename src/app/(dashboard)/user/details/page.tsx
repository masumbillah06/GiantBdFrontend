"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Breadcrumb,
} from "@/components/ui";
import {
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Pencil,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCurrentUser, useUserDetail } from "@/features/iam/hooks/use-iam";
import { getFileUrl } from "@/lib/utils";

function UserDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const authUser = useAuthStore((state) => state.user);

  // If queryId is provided, query by ID; otherwise, query me
  const { data: userById, isLoading: isLoadingById } = useUserDetail(queryId || "");
  const { data: currentUser, isLoading: isLoadingMe } = useCurrentUser();

  const user = queryId ? userById : (currentUser || authUser);
  const isLoading = queryId ? isLoadingById : isLoadingMe && !authUser;

  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#476ab8]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          title="User"
          items={[
            { label: "User", href: "/user" },
            { label: "Details" },
          ]}
        />
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-slate-600 text-sm">User details not found.</p>
          <button
            type="button"
            onClick={() => router.push("/user")}
            className="mt-4 px-6 py-2 rounded-lg bg-[#5066be] text-white text-sm font-semibold hover:bg-[#4357a7] transition-colors cursor-pointer"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = user.image || user.avatar ? getFileUrl(user.image || user.avatar) : null;
  const signatureUrl = user.signature ? getFileUrl(user.signature) : null;

  const roleName =
    typeof user.role === "string"
      ? user.role
      : user.role?.name || "super_admin";

  const editHref = queryId ? `/user/edit?id=${queryId}` : `/user/edit?id=${user.id}`;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb Bar ── */}
      <Breadcrumb
        title="User"
        items={[
          { label: "User", href: "/user" },
          { label: "Details" },
        ]}
      />

      {/* ── Main Two-Column Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Left Column: Profile Card & Signature ── */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
          {/* Avatar Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-100 relative">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={user.name || "User Avatar"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <UserIcon className="h-16 w-16 text-slate-400" />
              )}
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800 leading-tight uppercase truncate max-w-full">
              {user.name || "User"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium lowercase">
              {roleName}
            </p>
          </div>

          {/* Navigation Pill & Signature Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-left bg-[#edf2fe] text-[#476ab8] transition-colors cursor-default"
            >
              Personal Info
            </button>

            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Signature</h4>
              <div className="w-full h-32 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-center p-3 relative overflow-hidden">
                {signatureUrl ? (
                  <Image
                    src={signatureUrl}
                    alt="User Signature"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    No signature uploaded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Info Card ── */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6">
            {/* Header */}
            <div
              className="flex items-center justify-between pb-3 border-b border-slate-100 cursor-pointer select-none"
              onClick={() => setIsPersonalInfoOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#476ab8] rounded-full" />
                <h3 className="text-sm font-bold text-slate-800">Personal Info</h3>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Toggle Personal Info"
              >
                {isPersonalInfoOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {isPersonalInfoOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Row 1: First Name & Number */}
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                    First Name
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 min-h-[42px] flex items-center">
                    {user.name || "-"}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                    Number
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 min-h-[42px] flex items-center">
                    {user.phone || "-"}
                  </div>
                </div>

                {/* Row 2: Email & Role */}
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                    Email
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 min-h-[42px] flex items-center">
                    {user.email || "-"}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                    Role
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 min-h-[42px] flex items-center lowercase">
                    {roleName}
                  </div>
                </div>

                {/* Row 3: Status & Gender */}
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                    Status
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 min-h-[42px] flex items-center lowercase">
                    {user.status || "active"}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                    Gender
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 min-h-[42px] flex items-center lowercase">
                    {user.gender || "male"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="min-w-[120px] px-8 py-2.5 rounded-lg bg-[#b81d24] hover:bg-[#9c181e] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => router.push(editHref)}
          className="min-w-[120px] px-6 py-2.5 rounded-lg bg-[#5066be] hover:bg-[#4357a7] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 flex items-center justify-center gap-2"
        >
          <Pencil size={15} />
          <span>Edit Details</span>
        </button>
      </div>
    </div>
  );
}

export default function UserDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#476ab8]" />
        </div>
      }
    >
      <UserDetailsContent />
    </Suspense>
  );
}

