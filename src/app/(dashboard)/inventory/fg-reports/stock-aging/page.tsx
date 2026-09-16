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
import FilterCard from "@/components/ui/filter-card";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { Eye, SlidersHorizontal, MapPin, Download } from "lucide-react";
import {
  stockAgingData,
  stockAgingColumns,
  type StockAgingItem,
} from "@/lib/mock-data/reports/stock-aging.mock";

export default function StockAgingOverviewPage() {
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
          data={stockAgingData}
          columns={stockAgingColumns}
          minWidth="2300px"
          actionsLabel="Action"
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
