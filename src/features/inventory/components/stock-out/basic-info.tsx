"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import {
  DEFAULT_LCS,
  DEFAULT_POS_MAP,
  DEFAULT_BUYERS,
  DEFAULT_LOCATIONS,
} from "@/lib/constants/inventory-options";

export interface BasicInfoData {
  shipmentLc: string;
  shipmentPo: string;
  buyer: string;
  toLocation: string;
  stockOutDate: string;
}

export interface StockOutBasicInfoProps {
  data?: Partial<BasicInfoData>;
  onChange?: (data: BasicInfoData) => void;
  lcOptions?: string[];
  poOptionsMap?: Record<string, string[]>;
  buyerOptions?: string[];
  toLocationOptions?: string[];
}

export function BasicInfo({
  data,
  onChange,
  lcOptions = DEFAULT_LCS,
  poOptionsMap = DEFAULT_POS_MAP,
  buyerOptions = DEFAULT_BUYERS,
  toLocationOptions = DEFAULT_LOCATIONS,
}: StockOutBasicInfoProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Format today's date MM/DD/YYYY
  const getTodayFormatted = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const [formData, setFormData] = useState<BasicInfoData>({
    shipmentLc: data?.shipmentLc || "",
    shipmentPo: data?.shipmentPo || "",
    buyer: data?.buyer || "",
    toLocation: data?.toLocation || "",
    stockOutDate: data?.stockOutDate || getTodayFormatted(),
  });

  const updateField = (field: keyof BasicInfoData, value: string) => {
    const updated = { ...formData, [field]: value };
    // If changing LC, reset PO if current PO doesn't belong to new LC
    if (field === "shipmentLc") {
      updated.shipmentPo = "";
    }
    setFormData(updated);
    onChange?.(updated);
  };

  // PO options based on selected LC
  const currentPoOptions = formData.shipmentLc
    ? poOptionsMap[formData.shipmentLc] || [
        `PO-${formData.shipmentLc.slice(-3)}-01`,
        `PO-${formData.shipmentLc.slice(-3)}-02`,
      ]
    : [];

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-[#476ab8]" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Basic Information
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
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
            {/* Shipment (LC) * */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Shipment (LC) <span className="text-red-500 font-semibold">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.shipmentLc}
                  onChange={(e) => updateField("shipmentLc", e.target.value)}
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

            {/* Shipment (PO) * */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Shipment (PO) <span className="text-red-500 font-semibold">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.shipmentPo}
                  onChange={(e) => updateField("shipmentPo", e.target.value)}
                  disabled={!formData.shipmentLc}
                  className={`w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 ${
                    !formData.shipmentLc
                      ? "bg-slate-50/70 text-slate-400 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <option value="" disabled>
                    {formData.shipmentLc ? "Select PO" : "Select LC first"}
                  </option>
                  {currentPoOptions.map((po) => (
                    <option key={po} value={po}>
                      {po}
                    </option>
                  ))}
                </select>
                <ChevronsUpDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Buyer * */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Buyer <span className="text-red-500 font-semibold">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.buyer}
                  onChange={(e) => updateField("buyer", e.target.value)}
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
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* To */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                To
              </label>
              <div className="relative">
                <select
                  value={formData.toLocation}
                  onChange={(e) => updateField("toLocation", e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="" disabled>
                    Select Customer Location
                  </option>
                  {toLocationOptions.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Stock Out Date * */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Stock Out Date <span className="text-red-500 font-semibold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.stockOutDate}
                  onChange={(e) => updateField("stockOutDate", e.target.value)}
                  placeholder="MM/DD/YYYY"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9"
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const StockOutBasicInfo = BasicInfo;
export default BasicInfo;

