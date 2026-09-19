"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Plus,
  Layers,
  MapPin,
  Loader2,
  Package,
} from "lucide-react";
import { useOptionalStockIn } from "./stock-in-context";
import {
  MASTER_PRODUCT_OPTIONS,
  COLOR_OPTIONS,
  DEFAULT_SIZES,
} from "@/lib/constants/inventory-options";
import { useMasterProducts } from "@/features/products/hooks/use-master-products";
import { useColors, useRacks, useLocations } from "@/features/attributes/hooks/use-attributes";
import { previewStockIn } from "@/features/inventory/services/inventory.service";

export const GENDER_SELECT_OPTIONS = [
  { value: "MALE", label: "Men" },
  { value: "LADY", label: "Lady / Women" },
  { value: "KIDS", label: "Kids" },
  { value: "JUNIOR", label: "Junior" },
  { value: "TWIN_JUNIOR", label: "Twin Junior" },
];

export interface FGProductItem {
  id: number;
  name: string;
  masterProductId?: string;
  masterProduct: string;
  colorId?: string;
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
  sizeQuantities?: Record<string, number>;
  variantMap?: Record<string, string>; // size -> variantProductId
  rackId?: string;
  locationId?: string;
}

export function BasicInfo() {
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  // Live Backend Data Queries
  const { data: liveMasterProducts = [], isLoading: isLoadingMasters } = useMasterProducts();
  const { data: liveColors = [], isLoading: isLoadingColors } = useColors();
  const { data: liveRacks = [], isLoading: isLoadingRacks } = useRacks();
  const { data: liveLocations = [], isLoading: isLoadingLocations } = useLocations();

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
      masterProductId: "",
      masterProduct: "",
      colorId: "",
      color: "",
      gender: "MALE",
      materialName: "",
      productsPerPacket: "10",
      modelNumber: "",
      stockInDate: defaultStockInDate,
      productionDate: defaultProductionDate,
      expiryDate: defaultExpiryDate,
      availableSizes: DEFAULT_SIZES,
      selectedSizes: ["38", "40", "42"],
      sizeQuantities: { "38": 10, "40": 10, "42": 10 },
      variantMap: {},
    },
  ]);

  const products = stockInCtx ? stockInCtx.products : internalProducts;
  const setProducts = stockInCtx ? stockInCtx.setProducts : setInternalProducts;

  const [activeProductId, setActiveProductId] = useState<number>(1);
  const [customSizeInput, setCustomSizeInput] = useState<string>("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const currentProduct =
    products.find((p) => p.id === activeProductId) || products[0] || {
      id: 1,
      name: "FG Product 1",
      masterProduct: "",
      color: "",
      gender: "MALE",
      materialName: "",
      productsPerPacket: "10",
      modelNumber: "",
      stockInDate: defaultStockInDate,
      productionDate: defaultProductionDate,
      expiryDate: defaultExpiryDate,
      availableSizes: DEFAULT_SIZES,
      selectedSizes: [],
      sizeQuantities: {},
      variantMap: {},
    };

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
      masterProductId: "",
      masterProduct: "",
      colorId: "",
      color: "",
      gender: "MALE",
      materialName: "",
      productsPerPacket: "10",
      modelNumber: "",
      stockInDate: defaultStockInDate,
      productionDate: defaultProductionDate,
      expiryDate: defaultExpiryDate,
      availableSizes: DEFAULT_SIZES,
      selectedSizes: ["38", "40"],
      sizeQuantities: { "38": 10, "40": 10 },
      variantMap: {},
    };
    setProducts((prev) => [...prev, newProduct]);
    setActiveProductId(nextId);
  };

  // When Master Product changes
  const handleMasterProductChange = (masterIdOrValue: string) => {
    const foundMaster = liveMasterProducts.find(
      (m) =>
        String(m.id) === masterIdOrValue ||
        (m.productName && m.productName === masterIdOrValue) ||
        (m.masterProductName && m.masterProductName === masterIdOrValue) ||
        (m.masterProduct && m.masterProduct === masterIdOrValue) ||
        m.sku === masterIdOrValue
    );

    const productName = foundMaster
      ? foundMaster.productName || foundMaster.masterProductName || foundMaster.masterProduct
      : masterIdOrValue;
    const material = foundMaster?.material || "Standard";
    const masterLabel = foundMaster ? `${productName} (${foundMaster.sku})` : masterIdOrValue;
    const masterId = foundMaster ? String(foundMaster.id) : masterIdOrValue;

    const modelNo = foundMaster
      ? `${foundMaster.sku}-${currentProduct.color.slice(0, 3).toUpperCase() || "CLR"}-${currentProduct.gender?.[0] || "M"}`
      : "";

    updateCurrentProduct({
      masterProductId: masterId,
      masterProduct: masterLabel,
      materialName: material,
      modelNumber: modelNo,
    });
  };

  // When Color changes
  const handleColorChange = (colorIdOrValue: string) => {
    const foundColor = liveColors.find(
      (c) => String(c.id) === colorIdOrValue || c.name.toLowerCase() === colorIdOrValue.toLowerCase()
    );

    const colorName = foundColor ? foundColor.name : colorIdOrValue;
    const colorId = foundColor ? String(foundColor.id) : colorIdOrValue;

    const masterSku = currentProduct.modelNumber?.split("-")[0] || "MOD";
    const modelNo = `${masterSku}-${colorName.slice(0, 3).toUpperCase()}-${currentProduct.gender?.[0] || "M"}`;

    updateCurrentProduct({
      colorId: colorId,
      color: colorName,
      modelNumber: modelNo,
    });
  };

  // When Gender changes
  const handleGenderChange = (genderValue: string) => {
    const masterSku = currentProduct.modelNumber?.split("-")[0] || "MOD";
    const colorCode = currentProduct.color?.slice(0, 3).toUpperCase() || "CLR";
    const modelNo = `${masterSku}-${colorCode}-${genderValue[0]}`;

    updateCurrentProduct({
      gender: genderValue,
      modelNumber: modelNo,
    });
  };

  // Fetch variants preview when masterProductId, colorId and gender are valid
  useEffect(() => {
    let isCancelled = false;

    async function checkVariantPreview() {
      if (!currentProduct.masterProductId || !currentProduct.colorId || !currentProduct.gender) {
        return;
      }

      // Check if IDs look like valid backend UUIDs or IDs
      try {
        setIsPreviewLoading(true);
        const preview = await previewStockIn({
          masterProductId: currentProduct.masterProductId,
          colorId: currentProduct.colorId,
          gender: currentProduct.gender,
        });

        if (isCancelled || !preview) return;

        const variants = preview.variants || [];
        const variantMap: Record<string, string> = {};
        const previewSizes: string[] = [];

        variants.forEach((v: any) => {
          if (v.size) {
            variantMap[v.size] = v.id;
            if (!previewSizes.includes(v.size)) {
              previewSizes.push(v.size);
            }
          }
        });

        const mergedSizes = Array.from(new Set([...previewSizes, ...currentProduct.availableSizes]));

        updateCurrentProduct({
          availableSizes: mergedSizes.length > 0 ? mergedSizes : DEFAULT_SIZES,
          variantMap,
          materialName: preview.masterProduct?.material || currentProduct.materialName,
        });
      } catch (err) {
        // Fallback gracefully without breaking UI if preview returns 404
        console.info("[StockIn] Variant preview info:", err);
      } finally {
        if (!isCancelled) setIsPreviewLoading(false);
      }
    }

    checkVariantPreview();

    return () => {
      isCancelled = true;
    };
  }, [currentProduct.masterProductId, currentProduct.colorId, currentProduct.gender]);

  // Toggle size selection
  const handleToggleSize = (size: string) => {
    const isSelected = currentProduct.selectedSizes.includes(size);
    const updatedSizes = isSelected
      ? currentProduct.selectedSizes.filter((s) => s !== size)
      : [...currentProduct.selectedSizes, size];

    const updatedQuantities = { ...(currentProduct.sizeQuantities || {}) };
    if (!isSelected && !updatedQuantities[size]) {
      updatedQuantities[size] = Number(currentProduct.productsPerPacket) || 10;
    }

    updateCurrentProduct({
      selectedSizes: updatedSizes,
      sizeQuantities: updatedQuantities,
    });
  };

  // Update quantity for a specific size
  const handleSizeQuantityChange = (size: string, qty: number) => {
    updateCurrentProduct({
      sizeQuantities: {
        ...(currentProduct.sizeQuantities || {}),
        [size]: Math.max(1, qty),
      },
    });
  };

  // Add custom size
  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSizeInput.trim().toUpperCase();
    if (!trimmed) return;

    const existingSizes = currentProduct.availableSizes;
    const updatedSizes = existingSizes.includes(trimmed)
      ? existingSizes
      : [...existingSizes, trimmed];

    const updatedSelected = currentProduct.selectedSizes.includes(trimmed)
      ? currentProduct.selectedSizes
      : [...currentProduct.selectedSizes, trimmed];

    const updatedQuantities = {
      ...(currentProduct.sizeQuantities || {}),
      [trimmed]: Number(currentProduct.productsPerPacket) || 10,
    };

    updateCurrentProduct({
      availableSizes: updatedSizes,
      selectedSizes: updatedSelected,
      sizeQuantities: updatedQuantities,
    });
    setCustomSizeInput("");
  };

  const isReadyForSizes =
    Boolean(currentProduct.masterProductId || currentProduct.masterProduct) &&
    Boolean(currentProduct.colorId || currentProduct.color) &&
    Boolean(currentProduct.gender);

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
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md focus:outline-none cursor-pointer"
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
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {products.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setActiveProductId(prod.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none shrink-0"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>ADD PRODUCT</span>
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
                    value={currentProduct.masterProductId || currentProduct.masterProduct}
                    onChange={(e) => handleMasterProductChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                  >
                    <option value="" disabled>
                      {isLoadingMasters ? "Loading master products..." : "Select Master Product"}
                    </option>
                    {liveMasterProducts.length > 0 ? (
                      liveMasterProducts.map((mp) => (
                        <option key={mp.id} value={String(mp.id)}>
                          {mp.productName || mp.masterProductName || mp.masterProduct} ({mp.sku})
                        </option>
                      ))
                    ) : (
                      MASTER_PRODUCT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
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

              {/* Row 1, Col 2: Color * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Color <span className="text-red-500 font-semibold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={currentProduct.colorId || currentProduct.color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                  >
                    <option value="" disabled>
                      {isLoadingColors ? "Loading colors..." : "Select Color"}
                    </option>
                    {liveColors.length > 0 ? (
                      liveColors.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.name} {col.code ? `(${col.code})` : ""}
                        </option>
                      ))
                    ) : (
                      COLOR_OPTIONS.map((col) => (
                        <option key={col} value={col}>
                          {col}
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
                    {GENDER_SELECT_OPTIONS.map((gen) => (
                      <option key={gen.value} value={gen.value}>
                        {gen.label}
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
                  type="number"
                  min="1"
                  value={currentProduct.productsPerPacket}
                  onChange={(e) => updateCurrentProduct({ productsPerPacket: e.target.value })}
                  placeholder="e.g. 10"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] outline-none"
                />
              </div>

              {/* Row 2, Col 3: Model Number */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Model / SKU Code
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentProduct.modelNumber}
                  placeholder="Auto-derived SKU"
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

              {/* Warehouse Rack / Destination Location */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Destination Storage Rack / Location <span className="text-red-500 font-semibold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={currentProduct.rackId || currentProduct.locationId || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Check if it's a rack or location
                      const foundLoc = liveLocations.find((l) => l.id === val);
                      if (foundLoc) {
                        updateCurrentProduct({ locationId: val, rackId: foundLoc.rackId || undefined });
                      } else {
                        updateCurrentProduct({ rackId: val, locationId: undefined });
                      }
                    }}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all pr-9 cursor-pointer"
                  >
                    <option value="">Select Warehouse Rack / Location</option>
                    {liveLocations.length > 0 ? (
                      liveLocations.map((loc) => (
                        <option key={loc.id} value={String(loc.id)}>
                          Location {loc.code} {loc.barcode ? `(${loc.barcode})` : ""}
                        </option>
                      ))
                    ) : liveRacks.length > 0 ? (
                      liveRacks.map((rk) => (
                        <option key={rk.id} value={String(rk.id)}>
                          Rack {rk.name} ({rk.code})
                        </option>
                      ))
                    ) : (
                      <option value="default-rack">Default Warehouse Rack A1</option>
                    )}
                  </select>
                  <MapPin
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Assigns incoming finished goods directly to warehouse racks and locations.
                </p>
              </div>
            </div>

            {/* Available Sizes Section */}
            <div className="mt-6 space-y-3 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-[#476ab8]" />
                  <label className="text-xs font-bold text-slate-800">
                    Available Sizes & Stock-In Quantities
                  </label>
                  {isPreviewLoading && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 ml-2">
                      <Loader2 size={12} className="animate-spin text-[#476ab8]" /> Loading catalog variants...
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {currentProduct.selectedSizes.length} size(s) selected
                </span>
              </div>

              {/* Sizes Selection Badges */}
              <div className="w-full rounded-lg border border-slate-200 bg-[#f8fafc] px-4 py-3 min-h-[46px] flex flex-wrap items-center gap-2">
                {!isReadyForSizes && currentProduct.availableSizes.length === 0 ? (
                  <span className="text-xs text-slate-400">
                    Select Master Product, Color and Gender to load available sizes
                  </span>
                ) : (
                  currentProduct.availableSizes.map((sz) => {
                    const isSelected = currentProduct.selectedSizes.includes(sz);
                    const hasVariant = Boolean(currentProduct.variantMap?.[sz]);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#476ab8] text-white border-[#476ab8] shadow-2xs font-semibold"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        <span>Size {sz}</span>
                        {hasVariant && (
                          <span className={`text-[10px] px-1 rounded ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                            catalog
                          </span>
                        )}
                        {isSelected && <span className="text-xs font-bold ml-0.5">✓</span>}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Size Quantity Matrix for Selected Sizes */}
              {currentProduct.selectedSizes.length > 0 && (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <Package size={14} className="text-[#476ab8]" />
                    <span>Enter Received Quantities Per Size</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {currentProduct.selectedSizes.map((sz) => {
                      const qty = currentProduct.sizeQuantities?.[sz] ?? (Number(currentProduct.productsPerPacket) || 10);
                      return (
                        <div key={sz} className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-800">Size {sz}</span>
                            <span className="text-[10px] text-slate-400">Qty</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => handleSizeQuantityChange(sz, parseInt(e.target.value) || 1)}
                            className="w-full text-center text-xs font-semibold py-1 border border-slate-200 rounded focus:border-[#476ab8] outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Custom Size input row */}
              <form
                onSubmit={handleAddCustomSize}
                className="relative flex items-center pt-1"
              >
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  placeholder="Add custom size (e.g. 50, XXL, 10.5)"
                  className="w-full rounded-lg border border-slate-200 bg-white pl-4 pr-24 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>ADD SIZE</span>
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
