"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TableToolbarActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function TableToolbarActions({
  children,
  className,
}: TableToolbarActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export default TableToolbarActions; 