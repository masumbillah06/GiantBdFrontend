"use client";

import React, { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormTagsInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  wrapperClassName?: string;
  className?: string;
  disabled?: boolean;
}

export function FormTagsInput({
  label,
  required,
  error,
  helperText,
  tags = [],
  onChange,
  placeholder = "Add custom",
  wrapperClassName,
  className,
  disabled = false,
}: FormTagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (disabled) return;
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className={cn("w-full flex flex-col", wrapperClassName)}>
      {label && (
        <label className="mb-1.5 text-sm font-semibold text-slate-800">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Tags Box Container */}
      <div
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 transition-colors",
          error && "border-red-500",
          className
        )}
      >
        {/* Chip list */}
        <div className="flex flex-wrap items-center gap-2">
          {tags.length === 0 ? (
            <span className="text-xs text-slate-400 italic py-1">
              No sizes selected. Add sizes below.
            </span>
          ) : (
            tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200/80"
              >
                <span>{tag}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="rounded-full p-0.5 text-slate-400 hover:bg-slate-300/60 hover:text-slate-700 focus:outline-none cursor-pointer"
                    aria-label={`Remove ${tag}`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}
              </span>
            ))
          )}
        </div>

        {/* Custom Tag Input Bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 pr-10 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors",
              "focus:border-[#5066be] focus:ring-1 focus:ring-[#5066be]",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
            )}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={disabled || !inputValue.trim()}
            className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            aria-label="Add custom size"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

export default FormTagsInput;

