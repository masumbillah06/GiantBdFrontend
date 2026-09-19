"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { FGProductItem } from "./basic-info";
import type { DocumentItem } from "./documents";
import { useCreateStockIn } from "../../hooks/use-stock-in";
import { useLocations } from "@/features/attributes/hooks/use-attributes";

export interface StockInContextValue {
  products: FGProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<FGProductItem[]>>;
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  remarks: string;
  setRemarks: React.Dispatch<React.SetStateAction<string>>;
  batchId: string;
  setBatchId: React.Dispatch<React.SetStateAction<string>>;
  batchNumber: string;
  setBatchNumber: React.Dispatch<React.SetStateAction<string>>;
  resetForm: () => void;
  handleCreate: () => void;
  handlePreview: () => void;
  isLoading: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
  dismissStatus: () => void;
}

const StockInContext = createContext<StockInContextValue | undefined>(undefined);

export function useStockIn(): StockInContextValue {
  const ctx = useContext(StockInContext);
  if (!ctx) {
    throw new Error("useStockIn must be used within a StockInProvider");
  }
  return ctx;
}

export function useOptionalStockIn(): StockInContextValue | undefined {
  return useContext(StockInContext);
}

export const createDefaultProduct = (id: number): FGProductItem => {
  const today = new Date();
  const formatDisplayDate = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  return {
    id,
    name: `FG Product ${id}`,
    masterProductId: "",
    masterProduct: "",
    colorId: "",
    color: "",
    gender: "MALE",
    materialName: "",
    productsPerPacket: "10",
    modelNumber: "",
    stockInDate: formatDisplayDate(today),
    productionDate: formatDisplayDate(today),
    expiryDate: formatDisplayDate(nextYear),
    availableSizes: ["38", "40", "42", "44"],
    selectedSizes: ["38", "40"],
    sizeQuantities: { "38": 10, "40": 10 },
    variantMap: {},
  };
};

export function StockInProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<FGProductItem[]>([createDefaultProduct(1)]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [remarks, setRemarks] = useState<string>("");
  const [batchId, setBatchId] = useState<string>("");
  const [batchNumber, setBatchNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: locations = [] } = useLocations();
  const createStockInMut = useCreateStockIn();

  const dismissStatus = useCallback(() => {
    setStatusMessage(null);
    setErrorMessage(null);
  }, []);

  const resetForm = useCallback(() => {
    setProducts([createDefaultProduct(1)]);
    setDocuments([]);
    setRemarks("");
    setBatchId("");
    setBatchNumber("");
    setStatusMessage("Form has been reset.");
    setErrorMessage(null);
    setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  const handleCreate = useCallback(() => {
    setIsLoading(true);
    setStatusMessage("Saving stock in record to backend...");
    setErrorMessage(null);

    // Validate products
    const validProduct = products.find(
      (p) => (p.masterProductId || p.masterProduct) && (p.colorId || p.color)
    );

    if (!validProduct) {
      setIsLoading(false);
      setStatusMessage(null);
      setErrorMessage("Please select at least one Master Product and Color before receiving stock.");
      return;
    }

    // Default fallback storage location
    const fallbackLocationId = locations[0]?.id;

    // Build items strictly compliant with backend StockInItemDTO
    const items: any[] = [];

    products.forEach((p) => {
      const selectedSizes = p.selectedSizes.length > 0 ? p.selectedSizes : ["M"];
      const resolvedLocationId = p.locationId || (p.rackId ? undefined : fallbackLocationId);

      selectedSizes.forEach((sz) => {
        const qty = p.sizeQuantities?.[sz] ?? (Number(p.productsPerPacket) || 10);
        const variantId = p.variantMap?.[sz];

        items.push({
          ...(variantId ? { variantProductId: variantId } : {}),
          size: sz,
          gender: (p.gender?.toUpperCase() || "MALE") as any,
          ...(p.colorId ? { colorId: p.colorId } : {}),
          receivedQty: qty,
          itemsPerPacket: Number(p.productsPerPacket) || 1,
          ...(p.rackId ? { rackId: p.rackId } : {}),
          ...(resolvedLocationId ? { locationId: resolvedLocationId } : {}),
        });
      });
    });

    const parseToIso = (dateStr: string) => {
      if (!dateStr) return new Date().toISOString();
      const parsed = new Date(dateStr);
      return !isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
    };

    const firstProduct = products[0] || {};
    const payload: any = {
      productionDate: parseToIso(firstProduct.productionDate),
      ...(firstProduct.expiryDate ? { expirationDate: parseToIso(firstProduct.expiryDate) } : {}),
      ...(firstProduct.masterProductId ? { masterProductId: firstProduct.masterProductId } : {}),
      ...(firstProduct.colorId ? { colorId: firstProduct.colorId } : {}),
      ...(firstProduct.gender ? { gender: firstProduct.gender } : {}),
      ...(batchId.trim() ? { batch_id: batchId.trim() } : {}),
      ...(batchNumber.trim() ? { batch_number: batchNumber.trim() } : {}),
      ...(remarks.trim() ? { note: remarks.trim() } : {}),
      ...(fallbackLocationId ? { defaultLocationId: fallbackLocationId } : {}),
      items,
    };

    // Find first attached document file (if any)
    const attachedFile = documents.find((doc) => doc.file)?.file;

    createStockInMut.mutate(
      { payload, documentFile: attachedFile },
      {
        onSuccess: (res: any) => {
          setIsLoading(false);
          const batchCode = res?.batch?.batch_id || res?.data?.batch_id || "Batch Created";
          const totalReceived = res?.batch?.items?.length || items.length;
          setStatusMessage(`Stock In completed successfully! Batch: ${batchCode} (${totalReceived} size variants received).`);
          setErrorMessage(null);
          setTimeout(() => setStatusMessage(null), 5000);
          resetForm();
        },
        onError: (err: any) => {
          setIsLoading(false);
          setStatusMessage(null);
          const msg =
            err?.response?.data?.message ||
            (Array.isArray(err?.response?.data?.errors)
              ? err.response.data.errors.join(", ")
              : err.message) ||
            "Error executing stock in.";
          setErrorMessage(msg);
        },
      }
    );
  }, [products, documents, remarks, batchId, batchNumber, locations, createStockInMut, resetForm]);

  const handlePreview = useCallback(() => {
    const totalSizes = products.reduce((sum, p) => sum + p.selectedSizes.length, 0);
    const totalQty = products.reduce((sum, p) => {
      return (
        sum +
        p.selectedSizes.reduce((sSum, sz) => {
          return sSum + (p.sizeQuantities?.[sz] ?? (Number(p.productsPerPacket) || 10));
        }, 0)
      );
    }, 0);

    alert(
      `Stock In Preview:\n` +
      `- Finished Goods Products: ${products.length}\n` +
      `- Total Sizes to Stock In: ${totalSizes}\n` +
      `- Total Units: ${totalQty}\n` +
      `- Attached Documents: ${documents.length}\n` +
      `- Remarks: ${remarks || "(none)"}`
    );
  }, [products, documents, remarks]);

  return (
    <StockInContext.Provider
      value={{
        products,
        setProducts,
        documents,
        setDocuments,
        remarks,
        setRemarks,
        batchId,
        setBatchId,
        batchNumber,
        setBatchNumber,
        resetForm,
        handleCreate,
        handlePreview,
        isLoading,
        statusMessage,
        errorMessage,
        dismissStatus,
      }}
    >
      {/* Toast Alert Banner for feedback */}
      {(statusMessage || errorMessage) && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between mb-4 transition-all ${
            errorMessage
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <span className="font-medium">{errorMessage || statusMessage}</span>
          <button
            type="button"
            onClick={dismissStatus}
            className="text-xs font-semibold px-2 py-1 rounded hover:bg-black/5 cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}
      {children}
    </StockInContext.Provider>
  );
}

export default StockInProvider;
