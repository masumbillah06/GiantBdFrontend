"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Boxes,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { usePreviewStockOutByPo } from "@/features/inventory/hooks/use-stock-out";
import { useRawBatches } from "@/features/inventory/hooks/use-batch-list";

export interface StockOutAllocatedItem {
  batchItemId: string;
  issueQty: number;
  productName?: string;
  sku?: string;
  size?: string;
  batchCode?: string;
  maxAvailable?: number;
}

export interface StockOutProductDetailsProps {
  poId?: string;
  onAllocationsChange?: (allocations: StockOutAllocatedItem[], totalQty: number) => void;
}

export function ProductDetails({
  poId,
  onAllocationsChange,
}: StockOutProductDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);

  // When poId is provided, fetch PO Preview
  const {
    data: poPreview,
    isLoading: isLoadingPoPreview,
    error: poPreviewError,
  } = usePreviewStockOutByPo(poId || "");

  // When no poId, fetch raw inventory batches
  const {
    data: rawBatches = [],
    isLoading: isLoadingBatches,
  } = useRawBatches(undefined, { enabled: !poId });

  // Allocation state: batchItemId -> issueQty
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  // Reset allocations when poId changes
  useEffect(() => {
    setAllocations({});
  }, [poId]);

  // Propagate allocations to parent whenever allocations state changes
  useEffect(() => {
    const list: StockOutAllocatedItem[] = Object.entries(allocations)
      .filter(([_, qty]) => qty > 0)
      .map(([batchItemId, issueQty]) => ({
        batchItemId,
        issueQty,
      }));

    const totalQty = list.reduce((sum, item) => sum + item.issueQty, 0);
    onAllocationsChange?.(list, totalQty);
  }, [allocations, onAllocationsChange]);

  const handleQtyChange = (batchItemId: string, qty: number, maxAvailable: number) => {
    const cleanQty = Math.max(0, Math.min(qty || 0, maxAvailable));
    setAllocations((prev) => ({
      ...prev,
      [batchItemId]: cleanQty,
    }));
  };

  // Auto Allocate FIFO for all PO items
  const handleAutoAllocateFifo = () => {
    if (!poPreview?.items) return;

    const newAllocations: Record<string, number> = {};

    poPreview.items.forEach((item: any) => {
      let needed = item.remainingQty;
      if (needed <= 0 || !item.availableWarehouseStock) return;

      for (const stock of item.availableWarehouseStock) {
        if (needed <= 0) break;
        const canTake = Math.min(needed, stock.inHand);
        if (canTake > 0) {
          newAllocations[stock.batchItemId] = canTake;
          needed -= canTake;
        }
      }
    });

    setAllocations(newAllocations);
  };

  const totalAllocatedUnits = Object.values(allocations).reduce(
    (sum, q) => sum + (q || 0),
    0
  );

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-[#476ab8]" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Product Details & Warehouse Stock Allocation</span>
            {totalAllocatedUnits > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                {totalAllocatedUnits} units ready to dispatch
              </span>
            )}
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
          {poId ? (
            /* ──────── PO-Based Stock Out Mode ──────── */
            <div>
              {isLoadingPoPreview ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 size={24} className="animate-spin text-[#476ab8]" />
                  <p className="text-sm font-medium">Loading PO items and matching warehouse racks...</p>
                </div>
              ) : poPreviewError ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>Unable to preview PO items: {(poPreviewError as any)?.message || "Not found"}</span>
                </div>
              ) : poPreview?.items?.length > 0 ? (
                <div className="space-y-5">
                  {/* PO Summary Badge Header */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#476ab8]/10 text-[#476ab8] flex items-center justify-center font-bold">
                        <Boxes size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{poPreview.po?.poNumber}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                            {poPreview.po?.status || "Active"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          LC: {poPreview.po?.lc?.lcNumber || "Direct"} • Buyer: {poPreview.po?.buyer?.name || "N/A"} • Total Ordered: {poPreview.po?.totalQuantity || 0} pcs
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoAllocateFifo}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Zap size={14} />
                      <span>Auto Allocate (FIFO)</span>
                    </button>
                  </div>

                  {/* PO Items Cards */}
                  <div className="space-y-4">
                    {poPreview.items.map((item: any) => {
                      const itemAllocated = (item.availableWarehouseStock || []).reduce(
                        (sum: number, st: any) => sum + (allocations[st.batchItemId] || 0),
                        0
                      );
                      const isFulfilled = itemAllocated >= item.remainingQty && item.remainingQty > 0;

                      return (
                        <div
                          key={item.poItemId}
                          className="rounded-xl border border-slate-200 bg-white p-4.5 hover:border-slate-300 transition-all shadow-2xs"
                        >
                          {/* Item Meta Row */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <span>{item.masterProductName}</span>
                                <span className="text-xs font-normal text-slate-500">({item.sku})</span>
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                                <span className="bg-slate-100 px-2 py-0.5 rounded">Color: <strong>{item.color}</strong></span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded">Size: <strong>{item.size}</strong></span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded">Gender: <strong>{item.gender}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                              <div className="text-right">
                                <p className="text-slate-400">Order / Remaining</p>
                                <p className="font-bold text-slate-800 text-sm">
                                  {item.reqQty} / <span className="text-amber-600">{item.remainingQty} pcs</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-slate-400">Allocated</p>
                                <p className={`font-bold text-sm ${isFulfilled ? "text-emerald-600" : "text-[#476ab8]"}`}>
                                  {itemAllocated} pcs {isFulfilled && "✓"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Available Batches in FIFO Order */}
                          <div className="mt-3">
                            <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                              <Package size={13} className="text-slate-400" />
                              <span>Available Warehouse Stock Batches (FIFO)</span>
                            </h4>

                            {item.availableWarehouseStock?.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                    <tr>
                                      <th className="py-2 px-3">Batch Code</th>
                                      <th className="py-2 px-3">Production Date</th>
                                      <th className="py-2 px-3">Warehouse & Zone</th>
                                      <th className="py-2 px-3">Rack / Location</th>
                                      <th className="py-2 px-3 text-right">In Hand</th>
                                      <th className="py-2 px-3 text-center w-36">Issue Quantity</th>
                                      <th className="py-2 px-3 text-right w-24">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {item.availableWarehouseStock.map((stock: any) => {
                                      const currentQty = allocations[stock.batchItemId] || 0;
                                      return (
                                        <tr
                                          key={stock.batchItemId}
                                          className={`hover:bg-slate-50/70 transition-colors ${
                                            currentQty > 0 ? "bg-blue-50/30" : ""
                                          }`}
                                        >
                                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                                            {stock.batchCode}
                                          </td>
                                          <td className="py-2.5 px-3 text-slate-500">
                                            {stock.productionDate
                                              ? new Date(stock.productionDate).toLocaleDateString()
                                              : "N/A"}
                                          </td>
                                          <td className="py-2.5 px-3 text-slate-600">
                                            {stock.buildingZone || stock.warehouseName}
                                          </td>
                                          <td className="py-2.5 px-3 font-medium text-slate-700">
                                            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                                              {stock.subZoneRack} ({stock.locationCode})
                                            </span>
                                          </td>
                                          <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                                            {stock.inHand}
                                          </td>
                                          <td className="py-2.5 px-3 text-center">
                                            <input
                                              type="number"
                                              min="0"
                                              max={stock.inHand}
                                              value={currentQty === 0 ? "" : currentQty}
                                              onChange={(e) =>
                                                handleQtyChange(
                                                  stock.batchItemId,
                                                  parseInt(e.target.value) || 0,
                                                  stock.inHand
                                                )
                                              }
                                              placeholder="0"
                                              className="w-24 text-center py-1 px-2 text-xs font-bold rounded border border-slate-200 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] outline-none"
                                            />
                                          </td>
                                          <td className="py-2.5 px-3 text-right">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const remainingToFill = Math.max(0, item.remainingQty - (itemAllocated - currentQty));
                                                const fillQty = Math.min(remainingToFill, stock.inHand);
                                                handleQtyChange(stock.batchItemId, fillQty, stock.inHand);
                                              }}
                                              className="text-[11px] font-semibold text-[#476ab8] hover:underline cursor-pointer"
                                            >
                                              Max Needed
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>No warehouse stock currently in hand for this SKU variant. Receive stock in first.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-sm">
                  This Purchase Order does not contain any items yet.
                </div>
              )}
            </div>
          ) : (
            /* ──────── Direct / Warehouse Stock Out Mode ──────── */
            <div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Direct Inventory Batch Stock Out
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select quantities from existing warehouse batches to dispatch without a PO.
                  </p>
                </div>
                {totalAllocatedUnits > 0 && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={14} /> {totalAllocatedUnits} units selected
                  </span>
                )}
              </div>

              {isLoadingBatches ? (
                <div className="py-8 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin text-[#476ab8]" /> Loading available warehouse batches...
                </div>
              ) : rawBatches.length > 0 ? (
                <div className="space-y-3">
                  {rawBatches.map((batch: any) => {
                    const batchItems = batch.batchItems || batch.items || [];
                    if (batchItems.length === 0) return null;

                    return (
                      <div key={batch.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">
                            Batch: {batch.batch_id} {batch.batch_number ? `(${batch.batch_number})` : ""}
                          </span>
                          <span className="text-xs text-slate-500">
                            Prod Date: {batch.productionDate ? new Date(batch.productionDate).toLocaleDateString() : "N/A"}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                              <tr>
                                <th className="py-2 px-3">Product / SKU</th>
                                <th className="py-2 px-3">Color</th>
                                <th className="py-2 px-3">Size</th>
                                <th className="py-2 px-3">Rack / Location</th>
                                <th className="py-2 px-3 text-right">Available Qty</th>
                                <th className="py-2 px-3 text-center w-32">Issue Qty</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {batchItems.map((bi: any) => {
                                const maxAvail = bi.availableQty ?? bi.totalQuantity ?? 0;
                                const currentQty = allocations[bi.id] || 0;
                                return (
                                  <tr key={bi.id} className="hover:bg-slate-50/60">
                                    <td className="py-2 px-3 font-semibold text-slate-800">
                                      {bi.product?.name || "Variant"} ({bi.product?.sku})
                                    </td>
                                    <td className="py-2 px-3 text-slate-600">
                                      {bi.product?.color?.name || "N/A"}
                                    </td>
                                    <td className="py-2 px-3 font-bold text-slate-800">
                                      {bi.product?.size || "N/A"}
                                    </td>
                                    <td className="py-2 px-3 text-slate-600">
                                      {bi.location?.code || bi.location?.name || "Main Warehouse"}
                                    </td>
                                    <td className="py-2 px-3 text-right font-bold text-slate-800">
                                      {maxAvail}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <input
                                        type="number"
                                        min="0"
                                        max={maxAvail}
                                        value={currentQty === 0 ? "" : currentQty}
                                        onChange={(e) =>
                                          handleQtyChange(bi.id, parseInt(e.target.value) || 0, maxAvail)
                                        }
                                        placeholder="0"
                                        className="w-20 text-center py-1 px-2 text-xs font-bold rounded border border-slate-200 focus:border-[#476ab8] outline-none"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No stock in finished goods batches currently found. Receive items through Stock In first.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const StockOutProductDetails = ProductDetails;
export default ProductDetails;
