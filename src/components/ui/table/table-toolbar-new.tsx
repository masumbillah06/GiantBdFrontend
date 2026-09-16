"use client";

import React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TableToolbarNewProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function TableToolbarNew({
  onClick,
  label = "New",
  disabled = false,
  className,
}: TableToolbarNewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `
          flex
          cursor-pointer
          items-center
          gap-1.5
          rounded-lg
          bg-[#476ab8]
          px-3
          py-1.5
          text-xs
          font-semibold
          text-white
          shadow-xs
          transition-colors

          hover:bg-[#3b5998]

          disabled:cursor-not-allowed
          disabled:opacity-50
        `,
        className
      )}
    >
      <Plus size={14} />

      {label}
    </button>
  );
}

export default TableToolbarNew;