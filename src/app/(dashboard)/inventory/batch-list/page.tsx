"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
import FilterCard from "@/components/ui/filter-card";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { Eye, SlidersHorizontal, MapPin, Gauge, Download } from "lucide-react";
import { useBatchList } from "@/features/inventory/hooks/use-batch-list";
import { batchColumns } from "@/lib/mock-data/inventory/batch.mock";
import type { BatchItem } from "@/features/inventory/types/inventory.types";

export default function BatchListPage() {
  const { data = [], isLoading, error, refetch } = useBatchList();

  return (
    <>
      {/* ── Breadcrumb Bar with Table Actions ── */}
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Warehouse FG"
            items={[
              { label: "Warehouse FG", href: "/inventory/batch-list" },
              { label: "Batch List", href: "/inventory/batch-list" },
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

      {/* ── Batch Table with Pagination ── */}
      <div className="mt-4">
        <PaginatedTable<BatchItem>
          data={data}
          columns={batchColumns}
          pageSize={14}
          minWidth="1200px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for batch ${row.batchId}`}>
              <ActionButton
                label="View Batch Details"
                icon={Eye}
                className="!rounded-full border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700"
                onClick={() => {
                  notify(`Viewing batch ${row.batchId}`);
                }}
              />
              <ActionButton
                label="Adjust / Configure Batch"
                icon={SlidersHorizontal}
                className="!rounded-full border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700"
                onClick={() => {
                  notify(`Adjusting batch ${row.batchId}`);
                }}
              />
              <ActionButton
                label="View Location"
                icon={MapPin}
                className="!rounded-full border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700"
                onClick={() => {
                  notify(`Location for batch ${row.batchId}: Warehouse FG Zone A`);
                }}
              />
              <ActionButton
                label="Batch Status / Gauge"
                icon={Gauge}
                className="!rounded-full border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700"
                onClick={() => {
                  notify(`Status for batch ${row.batchId}: Optimal`);
                }}
              />
              <ActionButton
                label="Download / Export Batch"
                icon={Download}
                className="!rounded-full border border-slate-200/80 bg-white hover:bg-slate-100 text-slate-700"
                onClick={() => {
                  notify(`Downloading report for batch ${row.batchId}...`);
                }}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}