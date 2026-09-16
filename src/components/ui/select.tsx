"use client";

import React, { forwardRef } from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options?: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
  size?: "sm" | "md" | "lg";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      wrapperClassName,
      options,
      placeholder,
      children,
      size = "sm",
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 pr-8 text-xs",
      md: "px-3.5 py-2 pr-9 text-sm",
      lg: "px-4 py-2.5 pr-10 text-base",
    }[size];

    return (
      <div className={cn("relative inline-block w-full", wrapperClassName)}>
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-lg border border-slate-300 bg-white text-slate-700",
            "focus:border-[#476ab8] focus:outline-none focus:ring-1 focus:ring-[#476ab8]",
            "transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
            sizeClasses,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={props.required}>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option
                  key={String(opt.value)}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronsUpDown
          size={size === "lg" ? 16 : 14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

