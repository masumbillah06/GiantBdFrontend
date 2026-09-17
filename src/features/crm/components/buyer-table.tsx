"use client";

import React, { useMemo } from "react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";
import type { CustomerRecord } from "../types/crm.types";
import { useBuyers, useBuyerMutations } from "../hooks/use-buyers";

export const buyerColumns: ColumnDef<CustomerRecord>[] = [
  { key: "customerName", label: "Customer Name" },
  { key: "customerLocations", label: "Customer Locations" },
  { key: "createdOn", label: "Created On" },
  { key: "lastUpdated", label: "Last Updated" },
];

export interface BuyerTableProps {
  searchValue?: string;
  pageSize?: number;
  onNotify?: (msg: string) => void;
}

export function BuyerTable({ searchValue, pageSize, onNotify }: BuyerTableProps) {
  const { data = [], isLoading, error, refetch } = useBuyers({ search: searchValue });
  const { deleteMut } = useBuyerMutations();

  const filteredData = useMemo(() => {
    if (!searchValue || !searchValue.trim()) return data;
    const query = searchValue.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "").toLowerCase().includes(query)
      )
    );
  }, [data, searchValue]);

  return (
    <PaginatedTable<CustomerRecord>
      data={filteredData}
      columns={buyerColumns}
      pageSize={pageSize}
      minWidth="1200px"
      actionsLabel="Action"
      isLoading={isLoading}
      error={error ? error.message : null}
      onRetry={() => refetch()}
      renderActions={(row, notify) => (
        <ActionButtonGroup aria-label={`Actions for customer ${row.id}`}>
          <ActionButton
            label="View Customer"
            icon={Eye}
            onClick={() => (onNotify || notify)(`View customer #${row.id}`)}
          />
          <ActionButton
            label="Edit Customer"
            icon={PenSquareIcon}
            onClick={() => (onNotify || notify)(`Edit customer #${row.id}`)}
          />
          <ActionButton
            label="Delete Customer"
            icon={Trash2}
            variant="danger"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.customerName}?`)) {
                deleteMut.mutate(String(row.id), {
                  onSuccess: () => (onNotify || notify)(`Deleted customer #${row.id}`),
                });
              }
            }}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default BuyerTable;

