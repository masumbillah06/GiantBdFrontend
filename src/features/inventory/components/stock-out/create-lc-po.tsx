"use client";

import React, { useState } from "react";
import { ChevronsUpDown, ChevronUp, ChevronDown, Check, Loader2 } from "lucide-react";
import { DEFAULT_BUYERS, DEFAULT_LCS } from "@/lib/constants/inventory-options";
import { useRawBuyers, useLCs, useLCMutations, usePOMutations } from "@/features/crm/hooks/use-buyers";

export interface CreateLcPoProps {
  onLcCreate?: (data: { lcNo: string; buyer: string; lcId?: string; buyerId?: string }) => void;
  onPoCreate?: (data: { poNo: string; lc: string; poId?: string; lcId?: string }) => void;
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

  // Live CRM Queries
  const { data: liveBuyers = [] } = useRawBuyers();
  const { data: liveLCs = [] } = useLCs();
  const { createMut: createLcMut } = useLCMutations();
  const { createMut: createPoMut } = usePOMutations();

  // Row 1: LC creation state
  const [lcNo, setLcNo] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [lcFeedback, setLcFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Row 2: PO creation state
  const [poNo, setPoNo] = useState("");
  const [selectedLcId, setSelectedLcId] = useState("");
  const [poFeedback, setPoFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle LC Creation
  const handleCreateLc = async () => {
    const trimmedLc = lcNo.trim();
    if (!trimmedLc) return;

    try {
      // Find matching live buyer
      const selectedBuyer = liveBuyers.find((b) => b.id === buyerId || b.name === buyerId);
      const buyerName = selectedBuyer ? selectedBuyer.name : (buyerId || "Buyer");
      const targetBuyerId = selectedBuyer?.id || liveBuyers[0]?.id || "default-buyer";

      const defaultExpiry = new Date();
      defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);

      const createdLc = await createLcMut.mutateAsync({
        lcNumber: trimmedLc,
        buyerId: targetBuyerId,
        expiryDate: defaultExpiry.toISOString(),
      });

      onLcCreate?.({
        lcNo: createdLc.lcNumber,
        buyer: buyerName,
        lcId: createdLc.id,
        buyerId: targetBuyerId,
      });

      setLcFeedback({ type: "success", text: `LC "${trimmedLc}" created!` });
      setLcNo("");
      setBuyerId("");
      setTimeout(() => setLcFeedback(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Failed to create LC";
      setLcFeedback({ type: "error", text: msg });
      setTimeout(() => setLcFeedback(null), 5000);
    }
  };

  // Handle PO Creation
  const handleCreatePo = async () => {
    const trimmedPo = poNo.trim();
    if (!trimmedPo) return;

    try {
      // Find matching live LC
      const matchedLc = liveLCs.find((l) => l.id === selectedLcId || l.lcNumber === selectedLcId);
      const lcNumber = matchedLc ? matchedLc.lcNumber : selectedLcId;
      const targetBuyerId = matchedLc?.buyerId || liveBuyers[0]?.id || "default-buyer";

      const createdPo = await createPoMut.mutateAsync({
        poNumber: trimmedPo,
        buyerId: targetBuyerId,
        lcId: matchedLc?.id || undefined,
      });

      onPoCreate?.({
        poNo: createdPo.poNumber,
        lc: lcNumber,
        poId: createdPo.id,
        lcId: matchedLc?.id,
      });

      setPoFeedback({ type: "success", text: `PO "${trimmedPo}" created!` });
      setPoNo("");
      setSelectedLcId("");
      setTimeout(() => setPoFeedback(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Failed to create PO";
      setPoFeedback({ type: "error", text: msg });
      setTimeout(() => setPoFeedback(null), 5000);
    }
  };

  const effectiveBuyerOptions =
    liveBuyers.length > 0
      ? liveBuyers.map((b) => ({ id: b.id, name: b.name }))
      : buyerOptions.map((b) => ({ id: b, name: b }));

  const effectiveLcOptions =
    liveLCs.length > 0
      ? liveLCs.map((l) => ({ id: l.id, lcNumber: l.lcNumber }))
      : lcOptions.map((l) => ({ id: l, lcNumber: l }));

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
                placeholder="Enter LC No (e.g. LC-2026-005)"
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
                  value={buyerId}
                  onChange={(e) => setBuyerId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="">Select Buyer</option>
                  {effectiveBuyerOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
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
                disabled={createLcMut.isPending || !lcNo.trim()}
                className="w-full md:w-auto min-w-[110px] px-5 py-2.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] disabled:bg-slate-300 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none shrink-0 inline-flex items-center justify-center gap-1.5"
              >
                {createLcMut.isPending && <Loader2 size={14} className="animate-spin" />}
                <span>Create LC</span>
              </button>
              {lcFeedback && (
                <span
                  className={`text-xs flex items-center gap-1 ${
                    lcFeedback.type === "success" ? "text-emerald-600 font-medium" : "text-red-600"
                  }`}
                >
                  {lcFeedback.type === "success" && <Check size={14} />} {lcFeedback.text}
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
                placeholder="Enter PO No (e.g. PO-88350)"
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
                  value={selectedLcId}
                  onChange={(e) => setSelectedLcId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="">Select LC</option>
                  {effectiveLcOptions.map((lc) => (
                    <option key={lc.id} value={lc.id}>
                      {lc.lcNumber}
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
                disabled={createPoMut.isPending || !poNo.trim()}
                className="w-full md:w-auto min-w-[110px] px-5 py-2.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] disabled:bg-slate-300 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none shrink-0 inline-flex items-center justify-center gap-1.5"
              >
                {createPoMut.isPending && <Loader2 size={14} className="animate-spin" />}
                <span>Create PO</span>
              </button>
              {poFeedback && (
                <span
                  className={`text-xs flex items-center gap-1 ${
                    poFeedback.type === "success" ? "text-emerald-600 font-medium" : "text-red-600"
                  }`}
                >
                  {poFeedback.type === "success" && <Check size={14} />} {poFeedback.text}
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
