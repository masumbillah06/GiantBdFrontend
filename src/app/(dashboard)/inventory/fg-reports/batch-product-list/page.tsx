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
  batchProductData,
  batchProductColumns,
  type BatchProductItem,
} from "@/lib/mock-data/reports/batch-product.mock";

export default function BatchProductListPage() {
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
          data={batchProductData}
          columns={batchProductColumns}
          minWidth="2200px"
          actionsLabel="Action"
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
