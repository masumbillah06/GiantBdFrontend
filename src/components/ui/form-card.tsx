"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormCardProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  headerRight?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormCard({
  title,
  children,
  collapsible = true,
  defaultCollapsed = false,
  headerRight,
  className,
  contentClassName,
}: FormCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all",
        isCollapsed ? "overflow-hidden" : "overflow-visible",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-6 py-4 select-none",
          isCollapsed ? "rounded-2xl" : "rounded-t-2xl border-b border-slate-100",
          collapsible && "cursor-pointer hover:bg-slate-50/40 transition-colors"
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <div className="flex items-center gap-3">
          {/* Accent indicator bar */}
          <span
            className="w-1.5 h-5 rounded-full bg-[#5066be] shrink-0"
            aria-hidden="true"
          />
          <h2 className="text-sm md:text-base font-semibold text-slate-800">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {headerRight && <div onClick={(e) => e.stopPropagation()}>{headerRight}</div>}

          {collapsible && (
            <button
              type="button"
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label={isCollapsed ? "Expand section" : "Collapse section"}
            >
              {isCollapsed ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {!isCollapsed && (
        <div className={cn("p-6 rounded-b-2xl", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}

export default FormCard;

