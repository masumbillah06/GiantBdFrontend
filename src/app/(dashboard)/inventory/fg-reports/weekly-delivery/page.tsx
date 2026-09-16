"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import {
  TableToolbar,
  TableToolbarActions,
  TableToolbarExport,
  TableToolbarNew,
  TableToolbarPageSize,
  TableToolbarPrint,
  TableToolbarReload,
  TableToolbarSearch,
} from "@/components/ui/table";
import { PeriodicDelivery } from "@/features/reports/components/delivery";

export default function WeeklyDeliveryPage() {
  return (
    <>
      {/* ── Breadcrumb Bar with Table Actions ── */}
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Warehouse FG"
            items={[
              { label: "Warehouse FG", href: "/inventory/fg-reports/weekly-delivery" },
              { label: "FG Report", href: "/inventory/fg-reports/weekly-delivery" },
              { label: "Weekly Delivery", href: "/inventory/fg-reports/weekly-delivery" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch />
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

      {/* ── Weekly Delivery Component ── */}
      <div className="mt-4">
        <PeriodicDelivery mode="weekly" />
      </div>
    </>
  );
}
