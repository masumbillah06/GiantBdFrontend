"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import {
  DEFAULT_LCS,
  DEFAULT_POS_MAP,
  DEFAULT_BUYERS,
  DEFAULT_LOCATIONS,
} from "@/lib/constants/inventory-options";
import { useLCs, usePOs, useRawBuyers } from "@/features/crm/hooks/use-buyers";
import type { StockOutType } from "@/features/inventory/types/inventory.types";

export interface BasicInfoData {
  shipmentLc: string;
  shipmentLcId?: string;
  shipmentPo: string;
  shipmentPoId?: string;
  buyer: string;
  buyerId?: string;
  stockOutType: StockOutType;
  toLocation: string;
  stockOutDate: string;
  note?: string;
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

  // Live CRM Queries
  const { data: liveLCs = [] } = useLCs();
  const { data: livePOs = [] } = usePOs();
  const { data: liveBuyers = [] } = useRawBuyers();

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
    shipmentLcId: data?.shipmentLcId || "",
    shipmentPo: data?.shipmentPo || "",
    shipmentPoId: data?.shipmentPoId || "",
    buyer: data?.buyer || "",
    buyerId: data?.buyerId || "",
    stockOutType: data?.stockOutType || "PO_SHIPMENT",
    toLocation: data?.toLocation || "",
    stockOutDate: data?.stockOutDate || getTodayFormatted(),
    note: data?.note || "",
  });

  // Synchronize when external props change
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }
  }, [data]);

  const updateField = (field: keyof BasicInfoData, value: any) => {
    let updated = { ...formData, [field]: value };

    // When LC changes
    if (field === "shipmentLc") {
      const matchedLc = liveLCs.find((l) => l.id === value || l.lcNumber === value);
      updated.shipmentLc = matchedLc ? matchedLc.lcNumber : value;
      updated.shipmentLcId = matchedLc ? matchedLc.id : value;
      updated.shipmentPo = "";
      updated.shipmentPoId = "";

      // Auto-assign buyer if available on LC
      if (matchedLc?.buyerId) {
        const foundBuyer = liveBuyers.find((b) => b.id === matchedLc.buyerId);
        if (foundBuyer) {
          updated.buyer = foundBuyer.name;
          updated.buyerId = foundBuyer.id;
        }
      }
    }

    // When PO changes
    if (field === "shipmentPo") {
      const matchedPo = livePOs.find((p) => p.id === value || p.poNumber === value);
      updated.shipmentPo = matchedPo ? matchedPo.poNumber : value;
      updated.shipmentPoId = matchedPo ? matchedPo.id : value;

      // Auto-assign buyer if available on PO
      if (matchedPo?.buyerId) {
        const foundBuyer = liveBuyers.find((b) => b.id === matchedPo.buyerId);
        if (foundBuyer) {
          updated.buyer = foundBuyer.name;
          updated.buyerId = foundBuyer.id;
        }
      }

      // Auto-assign LC if available on PO
      if (matchedPo?.lcId) {
        const foundLc = liveLCs.find((l) => l.id === matchedPo.lcId);
        if (foundLc) {
          updated.shipmentLc = foundLc.lcNumber;
          updated.shipmentLcId = foundLc.id;
        }
      }
    }

    // When Buyer changes
    if (field === "buyer") {
      const foundBuyer = liveBuyers.find((b) => b.id === value || b.name === value);
      updated.buyer = foundBuyer ? foundBuyer.name : value;
      updated.buyerId = foundBuyer ? foundBuyer.id : value;
    }

    setFormData(updated);
    onChange?.(updated);
  };

  // Filter available POs based on selected LC
  const availablePOs = formData.shipmentLcId
    ? livePOs.filter((p) => p.lcId === formData.shipmentLcId || p.lc?.lcNumber === formData.shipmentLc)
    : livePOs;

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
            {/* Stock Out Type */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Stock Out Reason / Type <span className="text-red-500 font-semibold">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.stockOutType}
                  onChange={(e) => updateField("stockOutType", e.target.value as StockOutType)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="PO_SHIPMENT">PO Shipment (Export / Client Delivery)</option>
                  <option value="DIRECT_SALE">Direct Sale</option>
                  <option value="SAMPLE_DISPATCH">Sample Dispatch</option>
                  <option value="DAMAGE_SCRAP">Damage / Scrap Disposal</option>
                  <option value="INTERNAL_TRANSFER">Internal Warehouse Transfer</option>
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Shipment (LC) */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Shipment (LC) {formData.stockOutType === "PO_SHIPMENT" && <span className="text-red-500 font-semibold">*</span>}
              </label>
              <div className="relative">
                <select
                  value={formData.shipmentLcId || formData.shipmentLc}
                  onChange={(e) => updateField("shipmentLc", e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="">Select LC</option>
                  {liveLCs.length > 0 ? (
                    liveLCs.map((lc) => (
                      <option key={lc.id} value={lc.id}>
                        {lc.lcNumber} {lc.buyer?.name ? `(${lc.buyer.name})` : ""}
                      </option>
                    ))
                  ) : (
                    lcOptions.map((lc) => (
                      <option key={lc} value={lc}>
                        {lc}
                      </option>
                    ))
                  )}
                </select>
                <ChevronsUpDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Shipment (PO) */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Shipment (PO) {formData.stockOutType === "PO_SHIPMENT" && <span className="text-red-500 font-semibold">*</span>}
              </label>
              <div className="relative">
                <select
                  value={formData.shipmentPoId || formData.shipmentPo}
                  onChange={(e) => updateField("shipmentPo", e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="">Select PO</option>
                  {availablePOs.length > 0 ? (
                    availablePOs.map((po) => (
                      <option key={po.id} value={po.id}>
                        {po.poNumber} {po.buyer?.name ? `(${po.buyer.name})` : ""}
                      </option>
                    ))
                  ) : (
                    Object.values(poOptionsMap).flat().map((po) => (
                      <option key={po} value={po}>
                        {po}
                      </option>
                    ))
                  )}
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
                  value={formData.buyerId || formData.buyer}
                  onChange={(e) => updateField("buyer", e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                >
                  <option value="">Select Buyer</option>
                  {liveBuyers.length > 0 ? (
                    liveBuyers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))
                  ) : (
                    buyerOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* To / Destination Location */}
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1.5">
                Destination Store / Delivery Point
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.toLocation}
                  onChange={(e) => updateField("toLocation", e.target.value)}
                  placeholder="e.g. Export Dock 3 / Buyer Central Hub"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all"
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
