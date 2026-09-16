"use client";

import React from "react";
import {
  TableToolbar as BaseTableToolbar,
  TableToolbarActions,
  TableToolbarExport,
  TableToolbarNew,
  TableToolbarPageSize,
  TableToolbarPrint,
  TableToolbarReload,
  TableToolbarSearch,
} from "@/components/ui/table";

export interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  debounceMs?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  onReload?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  onNew?: () => void;
  newButtonLabel?: string;
  showSearch?: boolean;
  showExport?: boolean;
  showReload?: boolean;
  showPrint?: boolean;
  showPageSize?: boolean;
  showNew?: boolean;
  isLoading?: boolean;
  isReloading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function TableToolbar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  debounceMs = 0,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  onReload,
  onExport,
  onPrint,
  onNew,
  newButtonLabel = "New",
  showSearch = true,
  showExport = true,
  showReload = true,
  showPrint = true,
  showPageSize = true,
  showNew = true,
  isLoading = false,
  isReloading = false,
  children,
  className,
}: TableToolbarProps) {
  const isBusy = isLoading || isReloading;

  return (
    <BaseTableToolbar className={className}>
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
            disabled={isBusy}
          />
        )}
        {showReload && (
          <TableToolbarReload
            onClick={onReload}
            isLoading={isReloading}
            disabled={isBusy}
          />
        )}
        {showPrint && (
          <TableToolbarPrint
            onClick={onPrint}
            disabled={isBusy}
          />
        )}
        {showPageSize && (
          <TableToolbarPageSize
            value={pageSize}
            onChange={onPageSizeChange}
            options={pageSizeOptions}
            disabled={isBusy}
          />
        )}
        {showNew && (
          <TableToolbarNew
            onClick={onNew}
            label={newButtonLabel}
            disabled={isBusy}
          />
        )}
        {children}
      </TableToolbarActions>
    </BaseTableToolbar>
  );
}

export default TableToolbar;
