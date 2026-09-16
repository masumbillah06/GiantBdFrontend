"use client";

import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { AVAILABLE_YEARS } from "@/lib/mock-data/reports/delivery-summary.mock";

export interface DeliverySummaryHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  availableYears?: number[];
}

export function DeliverySummaryHeader({
  selectedYear,
  onYearChange,
  availableYears = AVAILABLE_YEARS,
}: DeliverySummaryHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      {/* Left side: Titles */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Select Year
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Delivery Summary &gt; {selectedYear}
        </p>
      </div>

      {/* Right side: Year Dropdown */}
      <div className="relative min-w-[120px]">
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2 pr-9 text-xs font-semibold text-slate-700 focus:border-[#476ab8] focus:outline-none focus:ring-1 focus:ring-[#476ab8] cursor-pointer"
        >
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
        <ChevronsUpDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default DeliverySummaryHeader;

