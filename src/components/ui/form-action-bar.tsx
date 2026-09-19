"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormActionBarProps {
  onCancel?: () => void;
  onReset?: () => void;
  onPreview?: () => void;
  onSubmit?: () => void;
  onCreate?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  previewLabel?: string;
  resetLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  className?: string;
  submitType?: "button" | "submit";
}

export function FormActionBar({
  onCancel,
  onReset,
  onPreview,
  onSubmit,
  onCreate,
  cancelLabel = "Cancel",
  submitLabel = "Create",
  previewLabel = "Preview",
  resetLabel = "Reset",
  isLoading = false,
  loadingLabel = "Creating...",
  disabled = false,
  className,
  submitType = "button",
}: FormActionBarProps) {
  const handleSubmit = onSubmit || onCreate;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex items-center justify-end gap-3",
        className
      )}
    >
      {/* Cancel Button */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading || disabled}
          className="min-w-[120px] px-8 py-2.5 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelLabel}
        </button>
      )}

      {/* Reset Button */}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading || disabled}
          className="min-w-[120px] px-8 py-2.5 rounded-lg border border-[#eab308] text-[#ca8a04] bg-white hover:bg-amber-50/70 text-sm font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetLabel}
        </button>
      )}

      {/* Preview Button (optional) */}
      {onPreview && (
        <button
          type="button"
          onClick={onPreview}
          disabled={isLoading || disabled}
          className="min-w-[120px] px-8 py-2.5 rounded-lg bg-[#489b6b] hover:bg-[#3d8559] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {previewLabel}
        </button>
      )}

      {/* Submit / Action Button */}
      {handleSubmit ? (
        <button
          type={submitType}
          onClick={submitType === "button" ? handleSubmit : undefined}
          disabled={isLoading || disabled}
          className="min-w-[120px] px-8 py-2.5 rounded-lg bg-[#5066be] hover:bg-[#4357a7] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isLoading ? loadingLabel : submitLabel}</span>
        </button>
      ) : submitType === "submit" ? (
        <button
          type="submit"
          disabled={isLoading || disabled}
          className="min-w-[120px] px-8 py-2.5 rounded-lg bg-[#5066be] hover:bg-[#4357a7] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isLoading ? loadingLabel : submitLabel}</span>
        </button>
      ) : null}
    </div>
  );
}

export default FormActionBar;
