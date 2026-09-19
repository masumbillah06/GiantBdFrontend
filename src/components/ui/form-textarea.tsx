"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      id,
      name,
      rows = 3,
      className,
      wrapperClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const textareaId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("w-full flex flex-col", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 text-sm font-semibold text-slate-800"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors duration-150 resize-y",
            "focus:border-[#5066be] focus:ring-1 focus:ring-[#5066be]",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />

        {error ? (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;

