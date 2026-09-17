"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { FGProductItem } from "./basic-info";
import type { DocumentItem } from "./documents";
import { useCreateStockIn } from "../../hooks/use-stock-in";

export interface StockInContextValue {
  products: FGProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<FGProductItem[]>>;
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  remarks: string;
  setRemarks: React.Dispatch<React.SetStateAction<string>>;
  resetForm: () => void;
  handleCreate: () => void;
  handlePreview: () => void;
  isLoading: boolean;
  statusMessage: string | null;
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
    masterProduct: "",
    color: "",
    gender: "",
    materialName: "",
    productsPerPacket: "",
    modelNumber: "",
    stockInDate: formatDisplayDate(today),
    productionDate: formatDisplayDate(today),
    expiryDate: formatDisplayDate(nextYear),
    availableSizes: [],
    selectedSizes: [],
  };
};

export function StockInProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<FGProductItem[]>([createDefaultProduct(1)]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [remarks, setRemarks] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const createStockInMut = useCreateStockIn();

  const resetForm = useCallback(() => {
    setProducts([createDefaultProduct(1)]);
    setDocuments([]);
    setRemarks("");
    setStatusMessage("Form has been reset.");
    setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  const handleCreate = useCallback(() => {
    setIsLoading(true);
    setStatusMessage("Saving stock in record to backend...");

    const items = products.flatMap((p) =>
      p.selectedSizes.map((size) => ({
        size,
        gender: (p.gender?.toUpperCase() || 'MALE') as any,
        receivedQty: Number(p.productsPerPacket) || 10,
        itemsPerPacket: Number(p.productsPerPacket) || 1,
        locationId: 'default-location',
      }))
    );

    const payload = {
      productionDate: new Date().toISOString(),
      note: remarks,
      items: items.length > 0 ? items : [{ receivedQty: 10, locationId: 'default-location' }],
    };

    createStockInMut.mutate(
      { payload },
      {
        onSuccess: () => {
          setIsLoading(false);
          setStatusMessage("Stock In record created successfully!");
          setTimeout(() => setStatusMessage(null), 3000);
          resetForm();
        },
        onError: (err: any) => {
          setIsLoading(false);
          setStatusMessage("Error creating Stock In: " + (err?.response?.data?.message || err.message));
          setTimeout(() => setStatusMessage(null), 5000);
        },
      }
    );
  }, [products, documents, remarks, createStockInMut, resetForm]);

  const handlePreview = useCallback(() => {
    console.log("[Stock In Preview]", { products, documents, remarks });
    alert(
      `Stock In Preview:\n- Products: ${products.length}\n- Documents: ${documents.length}\n- Remarks: ${remarks || "(none)"}`
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
        resetForm,
        handleCreate,
        handlePreview,
        isLoading,
        statusMessage,
      }}
    >
      {children}
    </StockInContext.Provider>
  );
}

export default StockInProvider;

