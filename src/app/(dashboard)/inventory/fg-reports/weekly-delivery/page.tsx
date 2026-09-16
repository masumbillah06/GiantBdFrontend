"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
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
          <TableToolbar />
        </div>
      </div>

      {/* ── Weekly Delivery Component ── */}
      <div className="mt-4">
        <PeriodicDelivery mode="weekly" />
      </div>
    </>
  );
}
