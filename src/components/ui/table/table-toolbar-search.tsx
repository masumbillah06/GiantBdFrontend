"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TableToolbarSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function TableToolbarSearch({
  value = "",
  onChange,
  placeholder = "Search records...",
  debounceMs = 0,
  className,
}: TableToolbarSearchProps) {
  const [localSearch, setLocalSearch] = useState(value);

  const debounceTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Keep local input synchronized when the parent
   * changes the search value externally.
   */
  useEffect(() => {
    setLocalSearch(value);
  }, [value]);

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

    if (!onChange) {
      return;
    }

    /*
     * Immediate search
     */
    if (debounceMs <= 0) {
      onChange(newValue);
      return;
    }

    /*
     * Debounced search
     */
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key !== "Enter" ||
      debounceMs <= 0 ||
      !onChange
    ) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    onChange(localSearch);
  };

  return (
    <div
      className={cn(
        "relative w-64 max-w-full",
        className
      )}
    >
      <input
        type="text"
        value={localSearch}
        onChange={(event) =>
          handleInputChange(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          w-full
          rounded-lg
          border border-slate-200
          bg-slate-50/80
          py-1.5
          pl-9
          pr-3
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
    </div>
  );
}

export default TableToolbarSearch;