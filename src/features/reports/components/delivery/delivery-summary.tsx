"use client";

import React, { useState, useMemo } from "react";
import DeliverySummaryHeader from "./delivery-summary-header";
import DeliverySummaryTable from "./delivery-summary-table";
import { getDeliverySummaryForYear } from "@/lib/mock-data/reports/delivery-summary.mock";

export interface DeliverySummaryProps {
  initialYear?: number;
}

export function DeliverySummary({ initialYear = 2026 }: DeliverySummaryProps) {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);

  const summaryData = useMemo(() => {
    return getDeliverySummaryForYear(selectedYear);
  }, [selectedYear]);

  return (
    <div className="space-y-4">
      {/* ── Top Header Card with Year Selection ── */}
      <DeliverySummaryHeader
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* ── Table Card: Full Year Matrix ── */}
      <DeliverySummaryTable summaryData={summaryData} />
    </div>
  );
}

export default DeliverySummary;

