"use client";

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useOptionalStockIn } from "./stock-in-context";
import {
  MASTER_PRODUCT_OPTIONS,
  COLOR_OPTIONS,
  GENDER_OPTIONS,
  DEFAULT_SIZES,
} from "@/lib/constants/inventory-options";

export interface FGProductItem {
  id: number;
  name: string;
  masterProduct: string;
  color: string;
  gender: string;
  materialName: string;
  productsPerPacket: string;
  modelNumber: string;
  stockInDate: string;
  productionDate: string;
  expiryDate: string;
  availableSizes: string[];
  selectedSizes: string[];
}


export function BasicInfo() {
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  // Today's date formatted MM/DD/YYYY
  const today = new Date();
  const formatDisplayDate = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const defaultStockInDate = formatDisplayDate(today);
  const defaultProductionDate = formatDisplayDate(today);
  const defaultExpiryDate = formatDisplayDate(nextYear);

  const stockInCtx = useOptionalStockIn();
  const [internalProducts, setInternalProducts] = useState<FGProductItem[]>([
    {
      id: 1,
      name: "FG Product 1",
      masterProduct: "",
      color: "",
      gender: "",
      materialName: "",
      productsPerPacket: "",
      modelNumber: "",
      stockInDate: defaultStockInDate,
      productionDate: defaultProductionDate,
      expiryDate: defaultExpiryDate,
      availableSizes: [],
      selectedSizes: [],
    },
  ]);

  const products = stockInCtx ? stockInCtx.products : internalProducts;
  const setProducts = stockInCtx ? stockInCtx.setProducts : setInternalProducts;

  const [activeProductId, setActiveProductId] = useState<number>(1);
  const [customSizeInput, setCustomSizeInput] = useState<string>("");

  const currentProduct =
    products.find((p) => p.id === activeProductId) || products[0];

  const updateCurrentProduct = (updates: Partial<FGProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === currentProduct.id ? { ...p, ...updates } : p))
    );
  };

  // Add new FG product card/tab
  const handleAddProduct = () => {
    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: FGProductItem = {
      id: nextId,
      name: `FG Product ${nextId}`,
      masterProduct: "",
      color: "",
      gender: "",
      materialName: "",
      productsPerPacket: "",
      modelNumber: "",
      stockInDate: defaultStockInDate,
      productionDate: defaultProductionDate,
      expiryDate: defaultExpiryDate,
      availableSizes: [],
      selectedSizes: [],
    };
    setProducts((prev) => [...prev, newProduct]);
    setActiveProductId(nextId);
  };

  // When Master Product changes, auto-fill Material and recalculate variant if Color/Gender set
  const handleMasterProductChange = (masterValue: string) => {
    const foundMaster = MASTER_PRODUCT_OPTIONS.find((m) => m.value === masterValue);
    const material = foundMaster?.material || "";
    const hasColorAndGender = currentProduct.color && currentProduct.gender;

    let sizes = currentProduct.availableSizes;
    let ppp = currentProduct.productsPerPacket;
    let modelNo = currentProduct.modelNumber;

    if (masterValue && hasColorAndGender) {
      sizes = sizes.length ? sizes : DEFAULT_SIZES;
      ppp = ppp || "12";
      modelNo = `${foundMaster?.model || "MOD"}-${currentProduct.color.slice(0, 3).toUpperCase()}-${currentProduct.gender[0]}`;
    } else if (!masterValue) {
      sizes = [];
      ppp = "";
      modelNo = "";
    }

    updateCurrentProduct({
      masterProduct: masterValue,
      materialName: material,
      availableSizes: sizes,
      productsPerPacket: ppp,
      modelNumber: modelNo,
    });
  };

  // When Color changes
  const handleColorChange = (colorValue: string) => {
    const hasMaster = !!currentProduct.masterProduct;
    const hasGender = !!currentProduct.gender;
    const masterObj = MASTER_PRODUCT_OPTIONS.find(
      (m) => m.value === currentProduct.masterProduct
    );

    let sizes = currentProduct.availableSizes;
    let ppp = currentProduct.productsPerPacket;
    let modelNo = currentProduct.modelNumber;

    if (hasMaster && colorValue && hasGender) {
      sizes = sizes.length ? sizes : DEFAULT_SIZES;
      ppp = ppp || "12";
      modelNo = `${masterObj?.model || "MOD"}-${colorValue.slice(0, 3).toUpperCase()}-${currentProduct.gender[0]}`;
    }

    updateCurrentProduct({
      color: colorValue,
      availableSizes: sizes,
      productsPerPacket: ppp,
      modelNumber: modelNo,
    });
  };

  // When Gender changes
  const handleGenderChange = (genderValue: string) => {
    const hasMaster = !!currentProduct.masterProduct;
    const hasColor = !!currentProduct.color;
    const masterObj = MASTER_PRODUCT_OPTIONS.find(
      (m) => m.value === currentProduct.masterProduct
    );

    let sizes = currentProduct.availableSizes;
    let ppp = currentProduct.productsPerPacket;
    let modelNo = currentProduct.modelNumber;

    if (hasMaster && hasColor && genderValue) {
      sizes = sizes.length ? sizes : DEFAULT_SIZES;
      ppp = ppp || "12";
      modelNo = `${masterObj?.model || "MOD"}-${currentProduct.color.slice(0, 3).toUpperCase()}-${genderValue[0]}`;
    }

    updateCurrentProduct({
      gender: genderValue,
      availableSizes: sizes,
      productsPerPacket: ppp,
      modelNumber: modelNo,
    });
  };

  // Toggle size selection
  const handleToggleSize = (size: string) => {
    const isSelected = currentProduct.selectedSizes.includes(size);
    const updated = isSelected
      ? currentProduct.selectedSizes.filter((s) => s !== size)
      : [...currentProduct.selectedSizes, size];
    updateCurrentProduct({ selectedSizes: updated });
  };

  // Add custom size
  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSizeInput.trim();
    if (!trimmed) return;

    const existingSizes = currentProduct.availableSizes;
    const updatedSizes = existingSizes.includes(trimmed)
      ? existingSizes
      : [...existingSizes, trimmed];

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
            Basic Information
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsSectionOpen((prev) => !prev)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md focus:outline-none"
          aria-label={isSectionOpen ? "Collapse section" : "Expand section"}
        >
          {isSectionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Collapsible Content */}
      {isSectionOpen && (
        <div className="p-6">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5">
            {/* Top Row: FG Product Badge & ADD Button */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {products.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setActiveProductId(prod.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      prod.id === currentProduct.id
                        ? "bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs font-semibold"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {prod.name}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddProduct}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>ADD</span>
              </button>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
              {/* Row 1, Col 1: Master Product * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Master Product <span className="text-red-500 font-semibold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={currentProduct.masterProduct}
                    onChange={(e) => handleMasterProductChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Master
                    </option>
                    {MASTER_PRODUCT_OPTIONS.map((opt) => (
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

              {/* Row 1, Col 2: Color * */}
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
                    {COLOR_OPTIONS.map((col) => (
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

              {/* Row 1, Col 3: Gender * */}
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
                    {GENDER_OPTIONS.map((gen) => (
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

              {/* Row 2, Col 1: Material Name */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Material Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentProduct.materialName}
                  placeholder="Auto-filled from master"
                  className="w-full rounded-lg border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-xs sm:text-sm text-slate-600 placeholder:text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              {/* Row 2, Col 2: Products Per Packet */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Products Per Packet
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentProduct.productsPerPacket}
                  placeholder="Auto-filled from variant"
                  className="w-full rounded-lg border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-xs sm:text-sm text-slate-600 placeholder:text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              {/* Row 2, Col 3: Model Number */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Model Number
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentProduct.modelNumber}
                  placeholder="Auto-filled from variant"
                  className="w-full rounded-lg border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-xs sm:text-sm text-slate-600 placeholder:text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              {/* Row 3, Col 1: Stock In Date * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Stock In Date <span className="text-red-500 font-semibold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentProduct.stockInDate}
                    onChange={(e) =>
                      updateCurrentProduct({ stockInDate: e.target.value })
                    }
                    placeholder="MM/DD/YYYY"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none"
                  />
                </div>
              </div>

              {/* Row 3, Col 2: Production Date * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Production Date <span className="text-red-500 font-semibold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentProduct.productionDate}
                    onChange={(e) =>
                      updateCurrentProduct({ productionDate: e.target.value })
                    }
                    placeholder="MM/DD/YYYY"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none"
                  />
                </div>
              </div>

              {/* Row 3, Col 3: Expiry Date */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Expiry Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentProduct.expiryDate}
                    onChange={(e) =>
                      updateCurrentProduct({ expiryDate: e.target.value })
                    }
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

            {/* Available Sizes Section */}
            <div className="mt-5 space-y-2.5">
              <label className="block text-xs font-medium text-slate-800">
                Available Sizes
              </label>

              {/* Sizes Display Box */}
              <div className="w-full rounded-lg border border-slate-200 bg-[#f8fafc] px-4 py-2.5 min-h-[44px] flex flex-wrap items-center gap-2">
                {!isReadyForSizes && currentProduct.availableSizes.length === 0 ? (
                  <span className="text-xs text-slate-400">
                    Select Master Product, Color and Gender to load available sizes
                  </span>
                ) : (
                  currentProduct.availableSizes.map((sz) => {
                    const isSelected = currentProduct.selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-[#476ab8] text-white border-[#476ab8] shadow-2xs"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        <span>{sz}</span>
                        {isSelected && <span className="text-xs">✓</span>}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Add Custom Size input row */}
              <form
                onSubmit={handleAddCustomSize}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  placeholder="Add custom size (e.g. 42)"
                  className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-24 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>ADD</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasicInfo;

