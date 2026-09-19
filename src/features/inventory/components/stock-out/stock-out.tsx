"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { CreateLcPo } from "./create-lc-po";
import { BasicInfo, type BasicInfoData } from "./basic-info";
import { ProductDetails, type StockOutAllocatedItem } from "./product-details";
import { useCreateStockOut } from "@/features/inventory/hooks/use-stock-out";
import { FormActionBar } from "@/components/ui/form-action-bar";
import { CheckCircle2, AlertCircle, Truck, FileText, ArrowRight } from "lucide-react";
import type { StockOutPayload } from "@/features/inventory/types/inventory.types";

export function StockOut() {
  // Format today's date MM/DD/YYYY
  const getTodayFormatted = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    shipmentLc: "",
    shipmentLcId: "",
    shipmentPo: "",
    shipmentPoId: "",
    buyer: "",
    buyerId: "",
    stockOutType: "PO_SHIPMENT",
    toLocation: "",
    stockOutDate: getTodayFormatted(),
    note: "",
  });

  const [remarks, setRemarks] = useState<string>("");
  const [allocatedItems, setAllocatedItems] = useState<StockOutAllocatedItem[]>([]);
  const [totalAllocatedQty, setTotalAllocatedQty] = useState<number>(0);
  const [lastChallan, setLastChallan] = useState<{ challanNumber: string; id: string; totalQty: number } | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);

  const createStockOutMut = useCreateStockOut();

  // Reset Form
  const handleReset = useCallback(() => {
    setBasicInfo({
      shipmentLc: "",
      shipmentLcId: "",
      shipmentPo: "",
      shipmentPoId: "",
      buyer: "",
      buyerId: "",
      stockOutType: "PO_SHIPMENT",
      toLocation: "",
      stockOutDate: getTodayFormatted(),
      note: "",
    });
    setRemarks("");
    setAllocatedItems([]);
    setTotalAllocatedQty(0);
    setMessage({ type: "info", text: "Form has been reset." });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  // Handle new LC created in CreateLcPo
  const handleLcCreated = ({
    lcNo,
    buyer,
    lcId,
    buyerId,
  }: {
    lcNo: string;
    buyer: string;
    lcId?: string;
    buyerId?: string;
  }) => {
    setBasicInfo((prev) => ({
      ...prev,
      shipmentLc: lcNo,
      shipmentLcId: lcId || prev.shipmentLcId,
      buyer: buyer || prev.buyer,
      buyerId: buyerId || prev.buyerId,
    }));
    setMessage({ type: "success", text: `LC "${lcNo}" selected.` });
    setTimeout(() => setMessage(null), 4000);
  };

  // Handle new PO created in CreateLcPo
  const handlePoCreated = ({
    poNo,
    lc,
    poId,
    lcId,
  }: {
    poNo: string;
    lc: string;
    poId?: string;
    lcId?: string;
  }) => {
    setBasicInfo((prev) => ({
      ...prev,
      shipmentPo: poNo,
      shipmentPoId: poId || prev.shipmentPoId,
      shipmentLc: lc || prev.shipmentLc,
      shipmentLcId: lcId || prev.shipmentLcId,
    }));
    setMessage({ type: "success", text: `PO "${poNo}" selected.` });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAllocationsChange = useCallback(
    (items: StockOutAllocatedItem[], qty: number) => {
      setAllocatedItems(items);
      setTotalAllocatedQty(qty);
    },
    []
  );

  // Handle Dispatch / Submission
  const handleDispatch = () => {
    if (allocatedItems.length === 0 || totalAllocatedQty <= 0) {
      setMessage({
        type: "error",
        text: "Please allocate at least one warehouse batch item with quantity > 0 to dispatch.",
      });
      return;
    }

    if (basicInfo.stockOutType === "PO_SHIPMENT" && !basicInfo.shipmentPoId) {
      setMessage({
        type: "error",
        text: "Please select a valid Purchase Order (PO) for PO Shipment.",
      });
      return;
    }

    const parseToIso = (dateStr: string) => {
      const d = new Date(dateStr);
      return !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString();
    };

    const payload: StockOutPayload = {
      type: basicInfo.stockOutType,
      ...(basicInfo.shipmentPoId ? { poId: basicInfo.shipmentPoId } : {}),
      ...(basicInfo.buyerId ? { buyerId: basicInfo.buyerId } : {}),
      ...(basicInfo.toLocation.trim() ? { destination: basicInfo.toLocation.trim() } : {}),
      dispatchDate: parseToIso(basicInfo.stockOutDate),
      ...((basicInfo.note || remarks).trim()
        ? { note: (basicInfo.note ? `${basicInfo.note}\n` : "") + remarks }
        : {}),
      items: allocatedItems.map((item) => ({
        batchItemId: item.batchItemId,
        issueQty: item.issueQty,
      })),
    };

    setMessage({ type: "info", text: "Processing stock out and generating delivery challan..." });

    createStockOutMut.mutate(payload, {
      onSuccess: (res: any) => {
        const challan = res?.challan || res?.data || res;
        const chalNum = challan?.challanNumber || "Generated";
        const disQty = res?.summary?.totalDispatchedQty || totalAllocatedQty;

        setLastChallan({
          challanNumber: chalNum,
          id: challan?.id || "",
          totalQty: disQty,
        });

        setMessage({
          type: "success",
          text: `Stock Out dispatched successfully! Delivery Challan: ${chalNum} (${disQty} units issued).`,
        });

        handleReset();
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          (Array.isArray(err?.response?.data?.errors)
            ? err.response.data.errors.join(", ")
            : err.message) ||
          "Failed to execute stock out.";
        setMessage({ type: "error", text: msg });
      },
    });
  };

  const handlePreview = () => {
    alert(
      `Stock Out Dispatch Preview:\n` +
      `- Type: ${basicInfo.stockOutType}\n` +
      `- PO: ${basicInfo.shipmentPo || "(None)"}\n` +
      `- LC: ${basicInfo.shipmentLc || "(None)"}\n` +
      `- Buyer: ${basicInfo.buyer || "(None)"}\n` +
      `- Destination: ${basicInfo.toLocation || "(Not specified)"}\n` +
      `- Dispatched Date: ${basicInfo.stockOutDate}\n` +
      `- Allocated Batch Items: ${allocatedItems.length}\n` +
      `- Total Units to Dispatch: ${totalAllocatedQty}`
    );
  };

  return (
    <div className="space-y-5">
      {/* Toast / Notification Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between transition-all shadow-xs ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : message.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" && <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
            {message.type === "error" && <AlertCircle size={18} className="text-red-600 shrink-0" />}
            {message.type === "info" && <Truck size={18} className="text-blue-600 shrink-0" />}
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-xs font-semibold hover:opacity-75 cursor-pointer ml-4 px-2 py-1 rounded hover:bg-black/5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Challan Card Banner */}
      {lastChallan && (
        <div className="p-5 rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Challan Created & Inventory Deducted
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Challan #{lastChallan.challanNumber}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {lastChallan.totalQty} finished goods units dispatched from warehouse racks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/inventory/stock-out-list"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>View Stock Out List</span>
              <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={() => setLastChallan(null)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-white/60 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 1. Create LC / PO */}
      <CreateLcPo
        onLcCreate={handleLcCreated}
        onPoCreate={handlePoCreated}
      />  

      {/* 2. Basic Information */}
      <BasicInfo
        data={basicInfo}
        onChange={setBasicInfo}
      />

      {/* 3. Product Details & Stock Allocation */}
      <ProductDetails
        poId={basicInfo.shipmentPoId}
        onAllocationsChange={handleAllocationsChange}
      />

      {/* 4. Dispatch Remarks */}
      <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-5 w-1 rounded-full bg-[#476ab8]" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Dispatch Remarks & Shipping Notes
          </h2>
        </div>
        <textarea
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter dispatch notes, vehicle number, driver name, container number, or delivery instructions..."
          className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all resize-y min-h-[90px]"
        />
      </div>

      {/* 5. Actions Bar */}
      <FormActionBar
        submitLabel={`Dispatch Stock Out (${totalAllocatedQty} pcs)`}
        loadingLabel="Dispatching..."
        onReset={handleReset}
        onPreview={handlePreview}
        onCreate={handleDispatch}
        isLoading={createStockOutMut.isPending}
      />
    </div>
  );
}

export default StockOut;
