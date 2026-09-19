"use client";

import React, { forwardRef } from "react";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: FormSelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
  chevronType?: "down" | "updown";
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      options,
      placeholder,
      children,
      id,
      name,
      className,
      wrapperClassName,
      disabled,
      value,
      chevronType = "down",
      ...props
    },
    ref
  ) => {
    const selectId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("w-full flex flex-col", wrapperClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 text-sm font-semibold text-slate-800"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            required={required}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-700 outline-none transition-colors duration-150 cursor-pointer",
              "focus:border-[#5066be] focus:ring-1 focus:ring-[#5066be]",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              !value && placeholder && "text-slate-400",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="text-slate-700"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          {chevronType === "updown" ? (
            <ChevronsUpDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
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
);

FormSelect.displayName = "FormSelect";

export default FormSelect;

