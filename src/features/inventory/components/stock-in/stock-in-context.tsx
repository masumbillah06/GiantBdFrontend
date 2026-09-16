"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { FGProductItem } from "./basic-info";
import type { DocumentItem } from "./documents";

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

  const resetForm = useCallback(() => {
    setProducts([createDefaultProduct(1)]);
    setDocuments([]);
    setRemarks("");
    setStatusMessage("Form has been reset.");
    setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  const handleCreate = useCallback(() => {
    setIsLoading(true);
    setStatusMessage("Saving stock in record...");

    // Simulated submission payload
    const payload = {
      products,
      documents,
      remarks,
      createdAt: new Date().toISOString(),
    };

    console.log("[Stock In Created]", payload);

    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage("Stock In record created successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    }, 600);
  }, [products, documents, remarks]);

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

