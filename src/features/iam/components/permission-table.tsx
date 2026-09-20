"use client";

import { PenSquareIcon, Trash2 } from "lucide-react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { useTableContext } from "@/components/ui/table/table-context";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { permissionColumns } from "@/lib/mock-data/iam/permission.mock";
import type { PermissionRecord } from "../types/iam.types";
import { usePermissions } from "../hooks/use-iam";

export interface PermissionTableProps {
  pageSize?: number;
  searchValue?: string;
  onNotify?: (msg: string) => void;
}

export function PermissionTable({ pageSize, searchValue, onNotify }: PermissionTableProps) {
  const tableContext = useTableContext();

  const activeSearch =
    searchValue !== undefined
      ? searchValue
      : tableContext?.searchQuery ?? "";

  const activePageSize =
    pageSize !== undefined
      ? pageSize
      : tableContext?.pageSize ?? 10;

  const { data = [], isLoading, error, refetch } = usePermissions();

  return (
    <PaginatedTable<PermissionRecord>
      data={data}
      columns={permissionColumns}
      pageSize={activePageSize}
      searchValue={activeSearch}
      minWidth="1650px"
      actionsLabel="Actions"
      noticeDuration={3000}
      isLoading={isLoading}
      error={error ? error.message : null}
      onRetry={() => refetch()}
      renderActions={(row, notify) => (
        <ActionButtonGroup aria-label={`Actions for module ${row.moduleName}`}>
          <ActionButton
            label="Edit Permission"
            icon={PenSquareIcon}
            onClick={() => (onNotify || notify)(`Editing permissions for "${row.moduleName}"`)}
          />
          <ActionButton
            label="Delete Permission"
            icon={Trash2}
            variant="danger"
            onClick={() => (onNotify || notify)(`Deleted permissions for "${row.moduleName}"`)}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default PermissionTable;

