"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Select, type SelectOption } from "@/components/ui/select";
import { useTableContext } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface FilterCardFieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FilterCardField {
  key: string;
  label: string;
  placeholder?: string;
  options?: Array<FilterCardFieldOption | string>;
  width?: string;
  className?: string;
}

export interface FilterCardProps {
  title?: string;
  fields?: FilterCardField[];
  data?: Array<Record<string, unknown>>;
  values?: Record<string, string | number>;
  onChange?: (key: string, value: string | number) => void;
  onReset?: () => void;
  className?: string;
  showReset?: boolean;
  headerRight?: React.ReactNode;
}

export const DEFAULT_FILTER_FIELDS: FilterCardField[] = [
  { key: "masterProduct", label: "Master", placeholder: "Filter by master...", width: "w-48" },
  { key: "material", label: "Material", placeholder: "Filter by material...", width: "w-44" },
  { key: "size", label: "Size", placeholder: "Filter by size...", width: "w-32" },
  { key: "color", label: "Color", placeholder: "Filter by color...", width: "w-36" },
  { key: "gender", label: "Gender", placeholder: "Filter by gender...", width: "w-36" },
  { key: "status", label: "Status", placeholder: "Filter by status...", width: "w-36" },
];

export default function FilterCard({
  title = "Filters",
  fields = DEFAULT_FILTER_FIELDS,
  data: propData,
  values: propValues,
  onChange,
  onReset,
  className,
  showReset,
  headerRight,
}: FilterCardProps) {
  const tableContext = useTableContext();
  const [internalValues, setInternalValues] = useState<Record<string, string | number>>({});

  // Active filter values priority: controlled prop > TableContext > local state
  const currentValues = propValues ?? tableContext?.filters ?? internalValues;

  const handleChange = (key: string, value: string | number) => {
    if (propValues !== undefined) {
      onChange?.(key, value);
    } else if (tableContext) {
      tableContext.setFilter(key, value);
      onChange?.(key, value);
    } else {
      setInternalValues((prev) => {
        const next = { ...prev };
        if (value === "" || value === undefined || value === null) {
          delete next[key];
        } else {
          next[key] = value;
        }
        return next;
      });
      onChange?.(key, value);
    }
  };

  const handleReset = () => {
    if (propValues !== undefined) {
      onReset?.();
    } else if (tableContext) {
      tableContext.resetFilters();
      onReset?.();
    } else {
      setInternalValues({});
      onReset?.();
    }
  };

  // Count active filters
  const activeCount = useMemo(() => {
    return Object.values(currentValues).filter(
      (val) => val !== undefined && val !== null && String(val).trim() !== ""
    ).length;
  }, [currentValues]);

  // Determine whether to show the reset button
  const canReset = showReset ?? (activeCount > 0 || Boolean(onReset));

  // Resolve options for each field (derive from dataset if not explicitly specified)
  const resolvedFields = useMemo(() => {
    const rawDataset =
      propData ??
      (tableContext?.registeredTable?.rawData as Array<Record<string, unknown>> | undefined) ??
      (tableContext?.registeredTable?.data as Array<Record<string, unknown>> | undefined) ??
      [];

    return fields.map((field) => {
      // 1. If explicit options are provided, normalize and return them
      if (field.options && field.options.length > 0) {
        const normalizedOptions: SelectOption[] = field.options.map((opt) =>
          typeof opt === "object" ? opt : { label: String(opt), value: opt }
        );
        return {
          ...field,
          normalizedOptions,
        };
      }

      // 2. Otherwise, derive unique values dynamically from table data
      if (rawDataset.length > 0) {
        const uniqueValues = new Set<string | number>();
        for (const item of rawDataset) {
          let val = item[field.key];
          if (val === undefined) {
            if (field.key === "master" || field.key === "masterProduct") {
              val =
                item.masterProduct ??
                item.masterProductName ??
                item.master ??
                item.productName;
            }
          }
          if (val !== undefined && val !== null && String(val).trim() !== "") {
            uniqueValues.add(val as string | number);
          }
        }

        const derivedOptions: SelectOption[] = Array.from(uniqueValues)
          .sort((a, b) =>
            String(a).localeCompare(String(b), undefined, { numeric: true })
          )
          .map((val) => {
            const str = String(val);
            // Capitalize simple lowercase strings for clean presentation
            const label =
              typeof val === "string" && str === str.toLowerCase()
                ? str.charAt(0).toUpperCase() + str.slice(1)
                : str;
            return {
              label,
              value: val,
            };
          });

        return {
          ...field,
          normalizedOptions: derivedOptions,
        };
      }

      return {
        ...field,
        normalizedOptions: [] as SelectOption[],
      };
    });
  }, [
    fields,
    propData,
    tableContext?.registeredTable?.rawData,
    tableContext?.registeredTable?.data,
  ]);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs",
        className
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Title and Active Badge */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-bold text-slate-800">{title}</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              {activeCount} active
            </span>
          )}
        </div>

        {/* Filter controls and optional Header Right */}
        <div className="flex flex-wrap items-center gap-2.5">
          {resolvedFields.map((field) => (
            <div
              key={field.key}
              className={cn(field.width || "w-44", field.className)}
            >
              <Select
                value={currentValues[field.key] ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={
                  field.placeholder || `Filter by ${field.label.toLowerCase()}...`
                }
                options={field.normalizedOptions}
                size="sm"
              />
            </div>
          ))}

          {canReset && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3 text-slate-400" />
              <span>Reset{activeCount > 0 ? ` (${activeCount})` : ""}</span>
            </button>
          )}

          {headerRight}
        </div>
      </div>
    </div>
  );
}