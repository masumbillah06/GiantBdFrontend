"use client";

import React, { useState } from "react";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterCardField {
  key: string;
  label: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number } | string>;
  width?: string;
}

export interface FilterCardProps {
  title?: string;
  fields?: FilterCardField[];
  values?: Record<string, string | number>;
  onChange?: (key: string, value: string | number) => void;
  onReset?: () => void;
  className?: string;
}

const DEFAULT_FIELDS: FilterCardField[] = [
  { key: "master", label: "Master", placeholder: "Filter by master...", width: "w-52" },
  { key: "material", label: "Material", placeholder: "Filter by material...", width: "w-48" },
  { key: "size", label: "Size", placeholder: "Filter by size...", width: "w-36" },
  { key: "color", label: "Color", placeholder: "Filter by color...", width: "w-40" },
  { key: "gender", label: "Gender", placeholder: "Filter by gender...", width: "w-40" },
];

export default function FilterCard({
  title = "Filters",
  fields = DEFAULT_FIELDS,
  values: propValues,
  onChange,
  onReset,
  className,
}: FilterCardProps) {
  const [internalValues, setInternalValues] = useState<Record<string, string | number>>({});
  const currentValues = propValues ?? internalValues;

  const handleChange = (key: string, value: string) => {
    if (!propValues) {
      setInternalValues((prev) => ({ ...prev, [key]: value }));
    }
    onChange?.(key, value);
  };

  const handleReset = () => {
    if (!propValues) {
      setInternalValues({});
    }
    onReset?.();
  };

  return (
    <div className={cn("bg-card flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Title */}
        <div className="text-sm font-bold text-slate-800">{title}</div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {fields.map((field) => {
            const rawOpts = field.options || [];
            const normalizedOpts = rawOpts.map((opt) =>
              typeof opt === "object" ? opt : { label: String(opt), value: opt }
            );

            return (
              <div key={field.key} className={field.width || "w-44"}>
                <Select
                  value={currentValues[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder || `Filter by ${field.label.toLowerCase()}...`}
                  options={normalizedOpts}
                  size="sm"
                />
              </div>
            );
          })}

          {onReset && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2 cursor-pointer transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}