"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronsUpDown, ChevronUp, Plus, X } from "lucide-react";
import {
  DEFAULT_MASTER_OPTIONS,
  DEFAULT_COLOR_OPTIONS,
  DEFAULT_GENDER_OPTIONS,
  DEFAULT_SIZES,
} from "@/lib/constants/inventory-options";

export interface StockOutProductItem {
  id: number;
  name: string;
  masterProduct: string;
  color: string;
  gender: string;
  availableSizes: string[];
  selectedSizes: string[];
  quantities?: Record<string, number>;
}

export interface StockOutProductDetailsProps {
  products?: StockOutProductItem[];
  onChange?: (products: StockOutProductItem[]) => void;
  masterOptions?: { value: string; label: string }[];
  colorOptions?: string[];
  genderOptions?: string[];
}

export function ProductDetails({
  products: initialProducts,
  onChange,
  masterOptions = DEFAULT_MASTER_OPTIONS,
  colorOptions = DEFAULT_COLOR_OPTIONS,
  genderOptions = DEFAULT_GENDER_OPTIONS,
}: StockOutProductDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);

  const [products, setProducts] = useState<StockOutProductItem[]>(
    initialProducts && initialProducts.length > 0
      ? initialProducts
      : [
          {
            id: 1,
            name: "Product 1",
            masterProduct: "",
            color: "",
            gender: "",
            availableSizes: [],
            selectedSizes: [],
          },
        ]
  );

  const [activeProductId, setActiveProductId] = useState<number>(products[0]?.id || 1);
  const [customSizeInput, setCustomSizeInput] = useState<string>("");

  const currentProduct =
    products.find((p) => p.id === activeProductId) || products[0];

  const updateCurrentProduct = (updates: Partial<StockOutProductItem>) => {
    setProducts((prev) => {
      const next = prev.map((p) =>
        p.id === currentProduct.id ? { ...p, ...updates } : p
      );
      onChange?.(next);
      return next;
    });
  };

  const handleAddProduct = () => {
    const nextId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: StockOutProductItem = {
      id: nextId,
      name: `Product ${nextId}`,
      masterProduct: "",
      color: "",
      gender: "",
      availableSizes: [],
      selectedSizes: [],
    };
    const next = [...products, newProduct];
    setProducts(next);
    setActiveProductId(nextId);
    onChange?.(next);
  };

  const handleRemoveProduct = (id: number) => {
    if (products.length <= 1) return;
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    if (activeProductId === id) {
      setActiveProductId(next[0].id);
    }
    onChange?.(next);
  };

  // When master/color/gender are changed, update available sizes if all 3 are set
  const handleMasterChange = (masterValue: string) => {
    const hasColorAndGender = currentProduct.color && currentProduct.gender;
    const sizes =
      masterValue && hasColorAndGender
        ? currentProduct.availableSizes.length
          ? currentProduct.availableSizes
          : DEFAULT_SIZES
        : [];
    updateCurrentProduct({
      masterProduct: masterValue,
      availableSizes: sizes,
    });
  };

  const handleColorChange = (colorValue: string) => {
    const hasMasterAndGender = currentProduct.masterProduct && currentProduct.gender;
    const sizes =
      colorValue && hasMasterAndGender
        ? currentProduct.availableSizes.length
          ? currentProduct.availableSizes
          : DEFAULT_SIZES
        : [];
    updateCurrentProduct({
      color: colorValue,
      availableSizes: sizes,
    });
  };

  const handleGenderChange = (genderValue: string) => {
    const hasMasterAndColor = currentProduct.masterProduct && currentProduct.color;
    const sizes =
      genderValue && hasMasterAndColor
        ? currentProduct.availableSizes.length
          ? currentProduct.availableSizes
          : DEFAULT_SIZES
        : [];
    updateCurrentProduct({
      gender: genderValue,
      availableSizes: sizes,
    });
  };

  const handleToggleSize = (size: string) => {
    const isSelected = currentProduct.selectedSizes.includes(size);
    const updated = isSelected
      ? currentProduct.selectedSizes.filter((s) => s !== size)
      : [...currentProduct.selectedSizes, size];
    updateCurrentProduct({ selectedSizes: updated });
  };

  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSizeInput.trim();
    if (!trimmed) return;

    const existing = currentProduct.availableSizes;
    const updatedSizes = existing.includes(trimmed)
      ? existing
      : [...existing, trimmed];
    const updatedSelected = currentProduct.selectedSizes.includes(trimmed)
      ? currentProduct.selectedSizes
      : [...currentProduct.selectedSizes, trimmed];

    updateCurrentProduct({
      availableSizes: updatedSizes,
      selectedSizes: updatedSelected,
    });
    setCustomSizeInput("");
  };

  const isReadyForSizes =
    !!currentProduct.masterProduct &&
    !!currentProduct.color &&
    !!currentProduct.gender;

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-[#476ab8]" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Product Details
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
          <div className="rounded-xl border border-slate-200/90 bg-white p-5">
            {/* Top Bar: Product Badges & ADD button */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {products.map((prod) => (
                  <div key={prod.id} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => setActiveProductId(prod.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        prod.id === currentProduct.id
                          ? "bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent"
                      }`}
                    >
                      {prod.name}
                    </button>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(prod.id)}
                        className="ml-1 p-1 text-slate-400 hover:text-red-500 transition-colors rounded-full"
                        title="Remove product"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddProduct}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>ADD</span>
              </button>
            </div>

            {/* 3 Columns: Master Product, Color, Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
              {/* Master Product * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Master Product <span className="text-red-500 font-semibold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={currentProduct.masterProduct}
                    onChange={(e) => handleMasterChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Master...
                    </option>
                    {masterOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Color * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Color <span className="text-red-500 font-semibold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={currentProduct.color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Color
                    </option>
                    {colorOptions.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Gender * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Gender <span className="text-red-500 font-semibold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={currentProduct.gender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    {genderOptions.map((gen) => (
                      <option key={gen} value={gen}>
                        {gen}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Available Sizes Section */}
            <div className="mt-5 space-y-2">
              <label className="block text-xs font-medium text-slate-800">
                Available Sizes
              </label>

              {/* Sizes Container */}
              <div className="w-full rounded-lg border border-slate-200 bg-[#f8fafc] px-4 py-3 min-h-[46px] flex flex-wrap items-center gap-2">
                {!isReadyForSizes || currentProduct.availableSizes.length === 0 ? (
                  <span className="text-xs sm:text-sm text-slate-400">
                    Select Master Product, Color and Gender to load sizes
                  </span>
                ) : (
                  <>
                    {currentProduct.availableSizes.map((sz) => {
                      const isSelected = currentProduct.selectedSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleToggleSize(sz)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-[#476ab8] text-white border-[#476ab8] shadow-2xs"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          <span>{sz}</span>
                          {isSelected && <span className="text-xs">✓</span>}
                        </button>
                      );
                    })}

                    {/* Add Custom Size Form */}
                    <div className="ml-auto flex items-center gap-1.5">
                      <input
                        type="text"
                        value={customSizeInput}
                        onChange={(e) => setCustomSizeInput(e.target.value)}
                        placeholder="+ Custom"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomSize();
                          }
                        }}
                        className="w-20 px-2 py-1 text-xs rounded border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#476ab8]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomSize()}
                        className="px-2 py-1 text-xs rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const StockOutProductDetails = ProductDetails;
export default ProductDetails;

