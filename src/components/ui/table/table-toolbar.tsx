"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TableToolbarActions } from "./table-toolbar-actions";
import { TableToolbarSearch } from "./table-toolbar-search";
import { TableToolbarExport } from "./table-toolbar-export";
import { TableToolbarReload } from "./table-toolbar-reload";
import { TableToolbarPrint } from "./table-toolbar-print";
import { TableToolbarPageSize } from "./table-toolbar-page-size";
import { TableToolbarNew } from "./table-toolbar-new";

export interface TableToolbarProps {
  children?: React.ReactNode;
  className?: string;
  // Optional direct props for self-contained usage
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  debounceMs?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  onReload?: () => unknown;
  onExport?: () => void;
  onPrint?: () => void;
  onNew?: () => void;
  newButtonLabel?: string;
  newHref?: string;
  showSearch?: boolean;
  showExport?: boolean;
  showReload?: boolean;
  showPrint?: boolean;
  showPageSize?: boolean;
  showNew?: boolean;
  isLoading?: boolean;
}

export function TableToolbar({
  children,
  className,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  debounceMs,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  onReload,
  onExport,
  onPrint,
  onNew,
  newButtonLabel,
  newHref,
  showSearch = true,
  showExport = true,
  showReload = true,
  showPrint = true,
  showPageSize = true,
  showNew = true,
  isLoading,
}: TableToolbarProps) {
  // If children are passed, render compound components mode
  if (children) {
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

  // Self-contained default rendering mode
  return (
    <div
      className={cn(
        "min-h-16 w-full flex flex-wrap items-center justify-between gap-3 px-4 py-2.5",
        className
      )}
    >
      {showSearch && (
        <TableToolbarSearch
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          debounceMs={debounceMs}
        />
      )}

      <TableToolbarActions>
        {showExport && (
          <TableToolbarExport
            onClick={onExport}
            disabled={isLoading}
          />
        )}
        {showReload && (
          <TableToolbarReload
            onClick={onReload}
            isLoading={isLoading}
          />
        )}
        {showPrint && (
          <TableToolbarPrint
            onClick={onPrint}
            disabled={isLoading}
          />
        )}
        {showPageSize && (
          <TableToolbarPageSize
            value={pageSize}
            onChange={onPageSizeChange}
            options={pageSizeOptions}
            disabled={isLoading}
          />
        )}
        {showNew && (
          <TableToolbarNew
            onClick={onNew}
            label={newButtonLabel}
            href={newHref}
            disabled={isLoading}
          />
        )}
      </TableToolbarActions>
    </div>
  );
}

export default TableToolbar;