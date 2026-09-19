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
import { Eye, FileText, Truck, Package, CheckCircle, XCircle } from "lucide-react";
import { stockOutColumns } from "@/lib/mock-data/inventory/stockout-list.mock";
import { useStockOutList } from "@/features/inventory/hooks/use-stock-out-list";
import { useCancelStockOutMutation, useStockOutStatusMutation } from "@/features/inventory/hooks/use-stock-out";
import type { StockOutItem } from "@/features/inventory/types/inventory.types";

export default function StockOutListPage() {
  const { data = [], isLoading, error, refetch } = useStockOutList();
  const cancelMut = useCancelStockOutMutation();
  const statusMut = useStockOutStatusMutation();

  return (
    <TableProvider
      title="Stock Out List"
      entityName="Stock Out"
      onReload={() => refetch()}
      isLoading={isLoading}
      newHref="/inventory/stock-out"
      newButtonLabel="New Stock Out"
    >
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
          <TableToolbar>
            <TableToolbarSearch placeholder="Search stock out records..." />
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

      {/* ── Stock Out Table with Pagination ── */}
      <div className="mt-4">
        <PaginatedTable<StockOutItem>
          data={data}
          columns={stockOutColumns}
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
                    label="Mark as Delivered"
                    icon={CheckCircle}
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => {
                      if (confirm(`Confirm delivery for Challan #${row.challanNumber || row.id}?`)) {
                        statusMut.mutate(
                          { id: String(row.id), status: "DELIVERED" },
                          {
                            onSuccess: () => notify(`Challan #${row.challanNumber || row.id} marked as DELIVERED`),
                            onError: (err: any) => notify(err?.message || "Failed to update status"),
                          }
                        );
                      }
                    }}
                  />
                  <ActionButton
                    label="Cancel Challan (Reverse Inventory)"
                    icon={XCircle}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Cancel Challan #${row.challanNumber || row.id}? This will restore all inventory.`)) {
                        cancelMut.mutate(
                          { id: String(row.id), note: "Cancelled by user" },
                          {
                            onSuccess: () => notify(`Challan #${row.challanNumber || row.id} CANCELLED. Inventory restored.`),
                            onError: (err: any) => notify(err?.message || "Failed to cancel challan"),
                          }
                        );
                      }
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
    </TableProvider>
  );
}