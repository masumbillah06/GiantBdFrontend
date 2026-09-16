"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
import DeliverySummary from "@/features/reports/components/delivery/delivery-summary";

export default function DeliverySummaryPage() {
  return (
    <>
      {/* ── Breadcrumb Bar with Table Actions ── */}
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Warehouse FG"
            items={[
              { label: "Warehouse FG", href: "/inventory/fg-reports/delivery-summary" },
              { label: "FG Report", href: "/inventory/fg-reports/delivery-summary" },
              { label: "Delivery Summary", href: "/inventory/fg-reports/delivery-summary" },
            ]}
          />
        </div>
        <div>
          <TableToolbar />
        </div>
      </div>

      {/* ── Delivery Summary Components ── */}
      <div className="mt-4">
        <DeliverySummary />
      </div>
    </>
  );
}
