"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useOptionalStockIn } from "./stock-in-context";

interface RemarksProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function Remarks({ value: propValue, onChange }: RemarksProps) {
  const stockInCtx = useOptionalStockIn();
  const [isOpen, setIsOpen] = useState(true);
  const [internalValue, setInternalValue] = useState("");

  const currentValue =
    propValue !== undefined
      ? propValue
      : stockInCtx
      ? stockInCtx.remarks
      : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (propValue === undefined) {
      if (stockInCtx) {
        stockInCtx.setRemarks(newValue);
      } else {
        setInternalValue(newValue);
      }
    }
    onChange?.(newValue);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-[#476ab8]" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Remarks
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md focus:outline-none cursor-pointer"
          aria-label={isOpen ? "Collapse section" : "Expand section"}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-6">
          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={currentValue}
              onChange={handleChange}
              placeholder=""
              className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all min-h-[120px] resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Remarks;

