"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TableToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function TableToolbar({
  children,
  className,
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        "min-h-16 w-full flex flex-wrap items-center justify-between gap-3 px-4 py-2.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export default TableToolbar;