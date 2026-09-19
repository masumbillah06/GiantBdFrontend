"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronsUpDown, Search, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  label: string;
  value: string | number;
  sublabel?: string;
  disabled?: boolean;
}

export interface FormSearchableSelectProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: SearchableSelectOption[];
  value?: string | number;
  onChange?: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  wrapperClassName?: string;
  className?: string;
  clearable?: boolean;
}

export function FormSearchableSelect({
  label,
  required,
  error,
  helperText,
  placeholder = "Search and select category...",
  options = [],
  value,
  onChange,
  disabled = false,
  isLoading = false,
  wrapperClassName,
  className,
  clearable = true,
}: FormSearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">("bottom");
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value));
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(term))
    );
  }, [options, searchTerm]);

  // Handle outside clicks to close dropdown and position calculation
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      // Determine whether to open upward or downward
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const estimatedDropdownHeight = 260;

        if (spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }

      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange?.(String(optionValue));
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
    setSearchTerm("");
  };

  return (
    <div
      ref={containerRef}
      className={cn("w-full flex flex-col", isOpen ? "relative z-30" : "", wrapperClassName)}
    >
      {label && (
        <label className="mb-1.5 text-sm font-semibold text-slate-800">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger Button & Dropdown Container */}
      <div className="relative w-full">
        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-left text-sm transition-colors duration-150 cursor-pointer outline-none",
            "focus:border-[#5066be] focus:ring-1 focus:ring-[#5066be]",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          aria-expanded={isOpen}
        >
          <span
            className={cn(
              "truncate",
              selectedOption ? "text-slate-700 font-normal" : "text-slate-400"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            ) : (
              <>
                {clearable && selectedOption && !disabled && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={handleClear}
                    onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
                    className="p-0.5 rounded-full hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                    aria-label="Clear selection"
                  >
                    <X size={14} />
                  </span>
                )}
                <ChevronsUpDown size={16} className="text-slate-400" />
              </>
            )}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={cn(
              "absolute left-0 right-0 z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100",
              dropdownPosition === "top"
                ? "bottom-[calc(100%+4px)]"
                : "top-[calc(100%+4px)]"
            )}
          >
            {/* Inner Search Box */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 mb-2">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
            </div>

            {/* Options List */}
            <ul className="max-h-56 overflow-y-auto space-y-0.5 py-0.5">
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-3 text-center text-xs text-slate-500">
                  No results found
                </li>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <li key={String(opt.value)}>
                      <button
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => handleSelect(opt.value)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer",
                          isSelected
                            ? "bg-indigo-50 font-medium text-[#5066be]"
                            : "text-slate-700 hover:bg-slate-50",
                          opt.disabled && "cursor-not-allowed opacity-50"
                        )}
                      >
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                          {opt.sublabel && (
                            <span className="text-xs text-slate-400">
                              {opt.sublabel}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <Check size={16} className="text-[#5066be] shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

export default FormSearchableSelect;

