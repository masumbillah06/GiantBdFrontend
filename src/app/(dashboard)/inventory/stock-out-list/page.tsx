"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
import FilterCard from "@/components/ui/filter-card";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { Eye, FileText, Truck, Package } from "lucide-react";
import { stockOutColumns } from "@/lib/mock-data/inventory/stockout-list.mock";
import { useStockOutList } from "@/features/inventory/hooks/use-stock-out-list";
import type { StockOutItem } from "@/features/inventory/types/inventory.types";

export default function StockOutListPage() {
  const { data = [], isLoading, error, refetch } = useStockOutList();

  return (
    <>
      {/* ── Breadcrumb Bar with Table Actions ── */}
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Warehouse FG"
            items={[
              { label: "Warehouse FG", href: "/inventory/stock-out-list" },
              { label: "Stock Out List", href: "/inventory/stock-out-list" },
            ]}
          />
        </div>
        <div>
          <TableToolbar onReload={() => refetch()} isLoading={isLoading} />
        </div>
      </div>

      {/* ── Filter Card ── */}
      <div className="mt-4">
        <FilterCard />
      </div>

      {/* ── Stock Out Table with Pagination ── */}
      <div className="mt-4">
        <PaginatedTable<StockOutItem>
          data={data}
          columns={stockOutColumns}
          pageSize={17}
          minWidth="1200px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for record ${row.id}`}>
              {/* Always show View */}
              <ActionButton
                label="View Stock Out Details"
                icon={Eye}
                onClick={() => {
                  notify(`Viewing details for LC: ${row.lcNo}`);
                }}
              />

              {/* Status-specific actions */}
              {row.status === "Issued" && (
                <>
                  <ActionButton
                    label="View Delivery Note"
                    icon={FileText}
                    onClick={() => {
                      notify(`Delivery note for PO: ${row.poNo}`);
                    }}
                  />
                  <ActionButton
                    label="Track Dispatch"
                    icon={Truck}
                    onClick={() => {
                      notify(`Tracking dispatch for LC: ${row.lcNo}`);
                    }}
                  />
                </>
              )}

              {row.status === "Pending" && (
                <ActionButton
                  label="Prepare Package"
                  icon={Package}
                  onClick={() => {
                    notify(`Preparing package for PO: ${row.poNo}`);
                  }}
                />
              )}

              {row.status === "Received" && (
                <ActionButton
                  label="View Receipt"
                  icon={FileText}
                  onClick={() => {
                    notify(`Receipt confirmed for LC: ${row.lcNo}`);
                  }}
                />
              )}
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}