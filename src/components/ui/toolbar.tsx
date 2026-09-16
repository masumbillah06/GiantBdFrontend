"use client";

import React, { useEffect, useState, useRef } from "react";
import { Download, Printer, RotateCcw, Plus, Search } from "lucide-react";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { cn } from "@/lib/utils";

export interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  /** Milliseconds to debounce onSearchChange when user types. Defaults to 0 (immediate). */
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
  /** Whether an async operation (like reloading or table fetching) is in flight. */
  isLoading?: boolean;
  /** Specific loading state for reloading animation. */
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
  const [prevSearchValue, setPrevSearchValue] = useState(searchValue);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Synchronize local search state during render when external prop changes (React 19 pattern)
  if (searchValue !== prevSearchValue) {
    setPrevSearchValue(searchValue);
    setLocalSearch(searchValue);
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (val: string) => {
    setLocalSearch(val);
    if (!onSearchChange) return;

    if (debounceMs > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onSearchChange(val);
      }, debounceMs);
    } else {
      onSearchChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && debounceMs > 0 && onSearchChange) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearchChange(localSearch);
    }
  };

  const isBusy = isLoading || isReloading;

  return (
    <div
      className={cn(
        "min-h-16 w-full flex flex-wrap items-center justify-end gap-3 px-4 py-2.5",
        className
      )}
    >
      {/* Search Bar */}
      {showSearch && (
        <div className="relative w-64 max-w-full">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-9 pr-3 py-1.5 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#476ab8] focus:bg-white focus:ring-1 focus:ring-[#476ab8]"
          />
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {showExport && (
          <ActionButton
            label="Download/Export"
            icon={Download}
            disabled={isBusy}
            onClick={onExport}
          />
        )}
        {showReload && (
          <ActionButton
            label={isReloading ? "Reloading..." : "Reload Data"}
            icon={RotateCcw}
            disabled={isBusy}
            className={isReloading ? "animate-spin" : ""}
            onClick={onReload}
          />
        )}
        {showPrint && (
          <ActionButton
            label="Print List"
            icon={Printer}
            disabled={isBusy}
            onClick={onPrint}
          />
        )}

        {showPageSize && (
          <div className="relative">
            <select
              value={pageSize}
              disabled={isBusy}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none transition-colors cursor-pointer hover:border-slate-300 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] disabled:opacity-50"
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>
                  {sz} / page
                </option>
              ))}
            </select>
          </div>
        )}

        {showNew && (
          <button
            type="button"
            onClick={onNew}
            disabled={isBusy}
            className="flex items-center gap-1.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5998] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus size={14} />
            {newButtonLabel}
          </button>
        )}

        {children}
      </div>
    </div>
  );
}

export default TableToolbar;
