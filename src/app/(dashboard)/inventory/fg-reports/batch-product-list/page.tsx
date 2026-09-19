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
  batchProductColumns,
  type BatchProductItem,
} from "@/lib/mock-data/reports/batch-product.mock";
import { useRawBatches } from "@/features/inventory/hooks/use-batch-list";

export default function BatchProductListPage() {
  const { data: rawBatches = [], isLoading, error, refetch } = useRawBatches();

  const liveData = useMemo<BatchProductItem[]>(() => {
    if (!rawBatches || rawBatches.length === 0) return [];

    const items: BatchProductItem[] = [];
    let idx = 1;

    for (const batch of rawBatches) {
      const bItems = (batch as any).batchItems || (batch as any).items || [];
      const prodDate = batch.productionDate ? new Date(batch.productionDate) : new Date();
      const ageDays = Math.max(
        0,
        Math.floor((Date.now() - prodDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      for (const bi of bItems) {
        const prod = bi.product || {};
        const master = prod.masterProduct || {};
        const loc = bi.location || {};

        items.push({
          id: idx++,
          productName: prod.name || master.name || "Product",
          sku: prod.sku || master.sku || "-",
          material: master.material?.name || "Standard",
          category: master.category?.name || "Footwear",
          subCategory: master.subCategory?.name || "Sneakers",
          color: prod.color?.name || "-",
          size: prod.size || "-",
          batchNo: batch.batch_number || batch.batch_id || `BAT-${idx}`,
          received: bi.totalQuantity || bi.quantity || 0,
          issued: (bi.totalQuantity || 0) - (bi.availableQty || 0),
          blocked: bi.reservedQty || 0,
          shipable: bi.availableQty || 0,
          warehouse: loc.warehouse?.name || "Main Warehouse",
          zone: loc.zone?.name || "Zone A",
          subZone: loc.subZone?.name || "SubZone 1",
          rack: loc.rack?.name || "Rack 1",
          ageDays: `${ageDays} Days`,
          zoneChangeIn: `${Math.max(0, 30 - (ageDays % 30))} Days`,
          createdAt: batch.createdAt
            ? new Date(batch.createdAt).toLocaleDateString()
            : "-",
        });
      }
    }

    return items;
  }, [rawBatches]);
  return (
    <TableProvider title="Batch Product List" entityName="Batch Product">
      {/* ── Breadcrumb Bar with Table Actions ── */}
      <div className="flex min-h-20 w-full items-center justify-between rounded-xl bg-white shadow-xs">
        <div>
          <Breadcrumb
            title="Warehouse FG"
            items={[
              {
                label: "Warehouse FG",
                href: "/inventory/fg-reports/batch-product-list",
              },
              {
                label: "FG Report",
                href: "/inventory/fg-reports/batch-product-list",
              },
              {
                label: "Batch Product List",
                href: "/inventory/fg-reports/batch-product-list",
              },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search batch products..." />
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

      {/* ── Batch Product Table with Pagination ── */}
      <div className="mt-4">
        <PaginatedTable<BatchProductItem>
          data={liveData}
          columns={batchProductColumns}
          minWidth="2200px"
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
                  notify(`Viewing product: ${row.productName} (${row.batchNo})`);
                }}
              />
              <ActionButton
                label="Adjust Batch Item"
                icon={SlidersHorizontal}
                className="!rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  notify(`Adjusting stock for: ${row.productName}`);
                }}
              />
              <ActionButton
                label="View Location"
                icon={MapPin}
                className="!rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  notify(
                    `Location: ${row.warehouse} > ${row.zone} > ${row.subZone} > ${row.rack}`
                  );
                }}
              />
              <ActionButton
                label="Download Item Report"
                icon={Download}
                className="!rounded-full border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  notify(`Downloading item report for batch ${row.batchNo}...`);
                }}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}
