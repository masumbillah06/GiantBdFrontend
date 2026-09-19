"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import {
  TableProvider,
  TableToolbar,
  TableToolbarActions,
  TableToolbarExport,
  TableToolbarNew,
  TableToolbarPageSize,
  TableToolbarPrint,
  TableToolbarReload,
  TableToolbarSearch,
} from "@/components/ui/table";
import React, { useMemo } from "react";
import FilterCard from "@/components/ui/filter-card";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { Eye, SlidersHorizontal, MapPin, Download } from "lucide-react";
import {
  stockAgingColumns,
  type StockAgingItem,
  type AgingTier,
} from "@/lib/mock-data/reports/stock-aging.mock";
import { useRawBatches } from "@/features/inventory/hooks/use-batch-list";

export default function StockAgingOverviewPage() {
  const { data: rawBatches = [], isLoading, error, refetch } = useRawBatches();

  const liveData = useMemo<StockAgingItem[]>(() => {
    if (!rawBatches || rawBatches.length === 0) return [];

    const items: StockAgingItem[] = [];
    let idx = 1;

    for (const batch of rawBatches) {
      const bItems = (batch as any).batchItems || (batch as any).items || [];
      const prodDate = batch.productionDate ? new Date(batch.productionDate) : new Date();
      const ageDays = Math.max(
        0,
        Math.floor((Date.now() - prodDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      const tier: AgingTier = ageDays <= 30 ? "green" : ageDays <= 90 ? "yellow" : "red";
      const status = ageDays <= 30 ? "Healthy" : ageDays <= 90 ? "Attention" : "Critical";

      for (const bi of bItems) {
        const prod = bi.product || {};
        const master = prod.masterProduct || {};
        const loc = bi.location || {};

        items.push({
          id: idx++,
          productName: prod.name || master.name || "Product",
          sku: prod.sku || master.sku || "-",
          batchNo: batch.batch_number || batch.batch_id || `BAT-${idx}`,
          material: master.material?.name || "Standard",
          category: master.category?.name || "Footwear",
          subCategory: master.subCategory?.name || "Sneakers",
          color: prod.color?.name || "-",
          size: prod.size || "-",
          received: bi.totalQuantity || bi.quantity || 0,
          issued: (bi.totalQuantity || 0) - (bi.availableQty || 0),
          blocked: bi.reservedQty || 0,
          currentStock: bi.availableQty || 0,
          warehouse: loc.warehouse?.name || "Main Warehouse",
          zone: loc.zone?.name || "Zone A",
          subZone: loc.subZone?.name || "SubZone 1",
          rack: loc.rack?.name || "Rack 1",
          ageDays,
          tier,
          zoneChangeIn: `${Math.max(0, 30 - (ageDays % 30))} Days`,
          status,
          createdAt: batch.createdAt
            ? new Date(batch.createdAt).toLocaleDateString()
            : "-",
        });
      }
    }

    return items;
  }, [rawBatches]);
  return (
    <TableProvider title="Stock Aging Report" entityName="Stock Aging Record">
      {/* ── Breadcrumb Bar with Table Actions ── */}
      <div className="flex min-h-20 w-full items-center justify-between rounded-xl bg-white shadow-xs">
        <div>
          <Breadcrumb
            title="Warehouse FG"
            items={[
              {
                label: "Warehouse FG",
                href: "/inventory/fg-reports/stock-aging",
              },
              {
                label: "FG Report",
                href: "/inventory/fg-reports/stock-aging",
              },
              {
                label: "Stock Aging",
                href: "/inventory/fg-reports/stock-aging",
              },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search stock aging..." />
            <TableToolbarActions>
              <TableToolbarExport />
              <TableToolbarReload />
              <TableToolbarPrint />
              <TableToolbarPageSize />
              <TableToolbarNew />
            </TableToolbarActions>
          </TableToolbar>
        </div>
      </div>

      {/* ── Filter Card ── */}
      <div className="mt-4">
        <FilterCard />
      </div>

      {/* ── Stock Aging Table with Pagination ── */}
      <div className="mt-4">
        <PaginatedTable<StockAgingItem>
          data={liveData}
          columns={stockAgingColumns}
          minWidth="2300px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for product ${row.id}`}>
              <ActionButton
                label="View Product Details"
                icon={Eye}
                className="!rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  notify(`Viewing product: ${row.productName} (Age: ${row.ageDays} Days)`);
                }}
              />
              <ActionButton
                label="Reallocate / Adjust Stock"
                icon={SlidersHorizontal}
                className="!rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  notify(`Reallocating batch ${row.batchNo}`);
                }}
              />
              <ActionButton
                label="View Location"
                icon={MapPin}
                className="!rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  notify(`Location: ${row.warehouse} > ${row.zone} > ${row.rack}`);
                }}
              />
              <ActionButton
                label="Download Item Report"
                icon={Download}
                className="!rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  notify(`Exporting aging record for ${row.productName}`);
                }}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}
