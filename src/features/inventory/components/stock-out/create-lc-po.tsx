"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronsUpDown, ChevronUp, Check } from "lucide-react";
import { DEFAULT_BUYERS, DEFAULT_LCS } from "@/lib/constants/inventory-options";

export interface CreateLcPoProps {
  onLcCreate?: (data: { lcNo: string; buyer: string }) => void;
  onPoCreate?: (data: { poNo: string; lc: string }) => void;
  buyerOptions?: string[];
  lcOptions?: string[];
}

export function CreateLcPo({
  onLcCreate,
  onPoCreate,
  buyerOptions = DEFAULT_BUYERS,
  lcOptions = DEFAULT_LCS,
}: CreateLcPoProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Row 1: LC creation state
  const [lcNo, setLcNo] = useState("");
  const [buyer, setBuyer] = useState("");
  const [lcFeedback, setLcFeedback] = useState<string | null>(null);

  // Row 2: PO creation state
  const [poNo, setPoNo] = useState("");
  const [selectedLc, setSelectedLc] = useState("");
  const [poFeedback, setPoFeedback] = useState<string | null>(null);

  const handleCreateLc = () => {
    if (!lcNo.trim()) return;
    onLcCreate?.({ lcNo: lcNo.trim(), buyer });
    setLcFeedback(`LC "${lcNo.trim()}" created`);
    setLcNo("");
    setTimeout(() => setLcFeedback(null), 3000);
  };

  const handleCreatePo = () => {
    if (!poNo.trim()) return;
    onPoCreate?.({ poNo: poNo.trim(), lc: selectedLc });
    setPoFeedback(`PO "${poNo.trim()}" created`);
    setPoNo("");
    setTimeout(() => setPoFeedback(null), 3000);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-[#476ab8]" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Create LC / PO
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

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-6 space-y-4">
          {/* Row 1: LC No, Buyer, Create LC */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-x-5 gap-y-3 items-end">
            {/* LC No */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                LC No
              </label>
              <input
                type="text"
                value={lcNo}
                onChange={(e) => setLcNo(e.target.value)}
                placeholder="Enter LC No"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all"
              />
            </div>

            {/* Buyer */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Buyer
              </label>
              <div className="relative">
                <select
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="" disabled>
                    Select Buyer
                  </option>
                  {buyerOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronsUpDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Create LC Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreateLc}
                className="w-full md:w-auto min-w-[100px] px-5 py-2.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none shrink-0"
              >
                Create LC
              </button>
              {lcFeedback && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <Check size={14} /> {lcFeedback}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: PO No, LC, Create PO */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-x-5 gap-y-3 items-end">
            {/* PO No */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                PO No
              </label>
              <input
                type="text"
                value={poNo}
                onChange={(e) => setPoNo(e.target.value)}
                placeholder="Enter PO No"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all"
              />
            </div>

            {/* LC */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                LC
              </label>
              <div className="relative">
                <select
                  value={selectedLc}
                  onChange={(e) => setSelectedLc(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="" disabled>
                    Select LC
                  </option>
                  {lcOptions.map((lc) => (
                    <option key={lc} value={lc}>
                      {lc}
                    </option>
                  ))}
                </select>
                <ChevronsUpDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Create PO Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreatePo}
                className="w-full md:w-auto min-w-[100px] px-5 py-2.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none shrink-0"
              >
                Create PO
              </button>
              {poFeedback && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <Check size={14} /> {poFeedback}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateLcPo;

