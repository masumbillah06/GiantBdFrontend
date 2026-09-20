"use client";

import React from "react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { useTableContext } from "@/components/ui/table/table-context";
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
  const tableContext = useTableContext();

  const activeSearch =
    searchValue !== undefined
      ? searchValue
      : tableContext?.searchQuery ?? "";

  const activePageSize =
    pageSize !== undefined
      ? pageSize
      : tableContext?.pageSize ?? 10;

  const { data = [], isLoading, error, refetch } = useBuyers({
    search: activeSearch || undefined,
    per_page: activePageSize,
  });
  const { deleteMut } = useBuyerMutations();

  return (
    <PaginatedTable<CustomerRecord>
      data={data}
      columns={buyerColumns}
      pageSize={activePageSize}
      searchValue={activeSearch}
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

