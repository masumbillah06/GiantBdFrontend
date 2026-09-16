"use client";

import React from "react";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FilterRawOption =
  | { label: string; value: string | number; disabled?: boolean }
  | string
  | number;

export interface FilterConfig<T> {
  key: keyof T;
  label: string;
  placeholder?: string;
  options: FilterRawOption[];
  width?: string;
  type?: "string" | "number";
}

export interface DynamicFilterBarProps<T extends object> {
  filters: T;
  config: FilterConfig<T>[];
  onChange: (nextFilters: T) => void;
  onReset?: () => void;
  className?: string;
}

export function DynamicFilterBar<T extends object>({
  filters,
  config,
  onChange,
  onReset,
  className,
}: DynamicFilterBarProps<T>) {
  const handleChange = (
    key: keyof T,
    rawValue: string,
    type?: "string" | "number"
  ) => {
    const value = type === "number" ? (rawValue === "" ? "" : Number(rawValue)) : rawValue;
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2.5", className)}>
      {config.map((field) => {
        const normalizedOptions: SelectOption[] = field.options.map((opt) => {
          if (typeof opt === "object" && opt !== null) {
            return opt;
          }
          return { label: String(opt), value: opt };
        });

        const filterRecord = filters as Record<string, string | number | undefined>;
        const rawVal = filterRecord[String(field.key)];
        const currentValue = rawVal !== undefined && rawVal !== null ? String(rawVal) : "";

        return (
          <div
            key={String(field.key)}
            className={cn("relative", field.width || "min-w-[160px]")}
          >
            <Select
              value={currentValue}
              onChange={(e) =>
                handleChange(field.key, e.target.value, field.type)
              }
              placeholder={field.placeholder || `Filter by ${field.label.toLowerCase()}...`}
              options={normalizedOptions}
              size="sm"
            />
          </div>
        );
      })}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 underline px-2 cursor-pointer transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default DynamicFilterBar;

