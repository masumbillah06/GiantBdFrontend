"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTableContext } from "./table-context";

export interface TableToolbarPageSizeProps {
  value?: number;
  options?: number[];
  onChange?: (size: number) => void;
  disabled?: boolean;
  className?: string;
}

export function TableToolbarPageSize({
  value: propValue,
  options: propOptions,
  onChange: propOnChange,
  disabled: propDisabled,
  className,
}: TableToolbarPageSizeProps) {
  const context = useTableContext();

  const isControlled = propValue !== undefined;
  const activeValue = isControlled ? propValue : context?.pageSize ?? 10;
  const activeOptions =
    propOptions ?? context?.pageSizeOptions ?? [10, 20, 30, 50, 100];
  const activeOnChange = propOnChange ?? context?.setPageSize;
  const activeDisabled =
    propDisabled ?? context?.isLoading ?? false;

  return (
    <select
      value={activeValue}
      disabled={activeDisabled}
      aria-label="Records per page"
      onChange={(event) => activeOnChange?.(Number(event.target.value))}
      className={cn(
        `
          cursor-pointer
          rounded-lg
          border border-slate-200
          bg-white
          px-2.5
          py-1.5
          text-xs
          font-medium
          text-slate-700
          outline-none
          transition-colors

          hover:border-slate-300

          focus:border-[#476ab8]
          focus:ring-1
          focus:ring-[#476ab8]

          disabled:cursor-not-allowed
          disabled:opacity-50
        `,
        className
      )}
    >
      {activeOptions.map((size) => (
        <option key={size} value={size}>
          {size} / page
        </option>
      ))}
    </select>
  );
}

export default TableToolbarPageSize;