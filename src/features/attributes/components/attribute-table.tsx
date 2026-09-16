"use client";

import React, { useMemo } from "react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import type { ColumnDef, RowBase } from "@/components/ui/table/ReusableTable.types";

export interface AttributeTableProps<T extends RowBase> {
  data: T[];
  columns: ColumnDef<T>[];
  entityName: string;
  pageSize?: number;
  searchValue?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onNotify?: (msg: string) => void;
  minWidth?: string;
}

export function AttributeTable<T extends RowBase>({
  data,
  columns,
  entityName,
  pageSize = 10,
  searchValue = "",
  isLoading = false,
  error = null,
  onRetry,
  onNotify,
  minWidth = "800px",
}: AttributeTableProps<T>) {
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    const query = searchValue.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "").toLowerCase().includes(query)
      )
    );
  }, [data, searchValue]);

  return (
    <PaginatedTable<T>
      data={filteredData}
      columns={columns}
      pageSize={pageSize}
      minWidth={minWidth}
      actionsLabel="Action"
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      renderActions={(row, notify) => (
        <ActionButtonGroup aria-label={`Actions for ${entityName} ${row.id}`}>
          <ActionButton
            label={`View ${entityName}`}
            icon={Eye}
            onClick={() => (onNotify || notify)(`Viewing ${entityName} #${row.id}`)}
          />
          <ActionButton
            label={`Edit ${entityName}`}
            icon={PenSquareIcon}
            onClick={() => (onNotify || notify)(`Editing ${entityName} #${row.id}`)}
          />
          <ActionButton
            label={`Delete ${entityName}`}
            icon={Trash2}
            variant="danger"
            onClick={() => (onNotify || notify)(`Deleted ${entityName} #${row.id}`)}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default AttributeTable;

