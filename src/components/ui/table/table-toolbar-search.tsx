"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableContext } from "./table-context";

export interface TableToolbarSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  showClearButton?: boolean;
}

export function TableToolbarSearch({
  value: propValue,
  onChange: propOnChange,
  placeholder: propPlaceholder,
  debounceMs = 250,
  className,
  showClearButton = true,
}: TableToolbarSearchProps) {
  const context = useTableContext();

  const isControlled = propValue !== undefined;
  const activeValue = isControlled ? propValue : context?.searchQuery ?? "";
  const activeOnChange = propOnChange ?? context?.setSearchQuery;
  const activePlaceholder =
    propPlaceholder ?? context?.searchPlaceholder ?? "Search records...";

  const [localSearch, setLocalSearch] = useState(activeValue);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Keep local input synchronized when the parent or context
   * changes the search value externally.
   */
  useEffect(() => {
    setLocalSearch(activeValue);
  }, [activeValue]);

  /*
   * Cleanup debounce timer when component unmounts.
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (newValue: string) => {
    setLocalSearch(newValue);

    if (!activeOnChange) {
      return;
    }

    if (debounceMs <= 0) {
      activeOnChange(newValue);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      activeOnChange(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalSearch("");
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    activeOnChange?.("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      handleClear();
      return;
    }

    if (event.key === "Enter" && debounceMs > 0 && activeOnChange) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      activeOnChange(localSearch);
    }
  };

  return (
    <div className={cn("relative w-64 max-w-full", className)}>
      <input
        type="text"
        value={localSearch}
        onChange={(event) => handleInputChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={activePlaceholder}
        className="
          w-full
          rounded-lg
          border border-slate-200
          bg-slate-50/80
          py-1.5
          pl-9
          pr-8
          text-xs
          text-slate-700
          outline-none
          transition-all
          placeholder:text-slate-400
          focus:border-[#476ab8]
          focus:bg-white
          focus:ring-1
          focus:ring-[#476ab8]
        "
      />

      <Search
        size={14}
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      {showClearButton && localSearch.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="
            absolute
            right-2.5
            top-1/2
            -translate-y-1/2
            rounded-full
            p-0.5
            text-slate-400
            hover:bg-slate-200
            hover:text-slate-600
            transition-colors
            cursor-pointer
          "
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

export default TableToolbarSearch;