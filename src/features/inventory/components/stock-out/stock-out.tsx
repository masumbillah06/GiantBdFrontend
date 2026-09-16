"use client";

import React, { useState } from "react";
import { CreateLcPo } from "./create-lc-po";
import { BasicInfo, type BasicInfoData } from "./basic-info";
import { ProductDetails, type StockOutProductItem } from "./product-details";
import { FormActionBar } from "@/components/ui/form-action-bar";

export interface StockOutProps {
  onSuccess?: () => void;
}

const INITIAL_LCS = [
  "LC-2026-001",
  "LC-2026-002",
  "LC-2026-003",
  "LC-2026-004",
];

const INITIAL_POS_MAP: Record<string, string[]> = {
  "LC-2026-001": ["PO-88310", "PO-88311"],
  "LC-2026-002": ["PO-88320", "PO-88321"],
  "LC-2026-003": ["PO-88330"],
  "LC-2026-004": ["PO-88340"],
};

export function StockOut({ onSuccess }: StockOutProps) {
  const [lcs, setLcs] = useState<string[]>(INITIAL_LCS);
  const [posMap, setPosMap] = useState<Record<string, string[]>>(INITIAL_POS_MAP);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);

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
    shipmentPo: "",
    buyer: "",
    toLocation: "",
    stockOutDate: getTodayFormatted(),
  });

  const [products, setProducts] = useState<StockOutProductItem[]>([
    {
      id: 1,
      name: "Product 1",
      masterProduct: "",
      color: "",
      gender: "",
      availableSizes: [],
      selectedSizes: [],
    },
  ]);

  // Handle new LC created in CreateLcPo component
  const handleLcCreated = ({ lcNo, buyer }: { lcNo: string; buyer: string }) => {
    if (!lcs.includes(lcNo)) {
      setLcs((prev) => [lcNo, ...prev]);
    }
    if (buyer && !basicInfo.buyer) {
      setBasicInfo((prev) => ({ ...prev, buyer }));
    }
    setMessage({ type: "success", text: `LC "${lcNo}" added successfully.` });
    setTimeout(() => setMessage(null), 4000);
  };

  // Handle new PO created in CreateLcPo component
  const handlePoCreated = ({ poNo, lc }: { poNo: string; lc: string }) => {
    setPosMap((prev) => {
      const targetLc = lc || (lcs[0] ?? "DEFAULT");
      const existing = prev[targetLc] || [];
      return {
        ...prev,
        [targetLc]: existing.includes(poNo) ? existing : [poNo, ...existing],
      };
    });
    setMessage({ type: "success", text: `PO "${poNo}" added successfully.` });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleReset = () => {
    setBasicInfo({
      shipmentLc: "",
      shipmentPo: "",
      buyer: "",
      toLocation: "",
      stockOutDate: getTodayFormatted(),
    });
    setProducts([
      {
        id: 1,
        name: "Product 1",
        masterProduct: "",
        color: "",
        gender: "",
        availableSizes: [],
        selectedSizes: [],
      },
    ]);
    setMessage({ type: "info", text: "Form reset to default." });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePreview = () => {
    setMessage({
      type: "info",
      text: `Stock Out Summary: LC: ${basicInfo.shipmentLc || "N/A"} | PO: ${basicInfo.shipmentPo || "N/A"} | Buyer: ${basicInfo.buyer || "N/A"} | Products: ${products.length}`,
    });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreate = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: "success", text: "Stock out recorded successfully!" });
      onSuccess?.();
      setTimeout(() => setMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-5">
      {/* Toast / Notification Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between transition-all ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : message.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-xs font-semibold hover:opacity-75 cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Create LC / PO */}
      <CreateLcPo
        lcOptions={lcs}
        onLcCreate={handleLcCreated}
        onPoCreate={handlePoCreated}
      />

      {/* 2. Basic Information */}
      <BasicInfo
        data={basicInfo}
        onChange={setBasicInfo}
        lcOptions={lcs}
        poOptionsMap={posMap}
      />

      {/* 3. Product Details */}
      <ProductDetails
        products={products}
        onChange={setProducts}
      />

      {/* 4. Action Buttons */}
      <FormActionBar
        onReset={handleReset}
        onPreview={handlePreview}
        onCreate={handleCreate}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default StockOut;

