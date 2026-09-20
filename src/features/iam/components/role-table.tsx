"use client";

import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { useTableContext } from "@/components/ui/table/table-context";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";
import type { RoleRecord } from "../types/iam.types";
import { useRoles, useRoleMutations } from "../hooks/use-iam";

export const roleColumns: ColumnDef<RoleRecord>[] = [
  { key: "name", label: "Name" },
  { key: "permission", label: "Permission" },
];

export interface RoleTableProps {
  pageSize?: number;
  searchValue?: string;
  onNotify?: (msg: string) => void;
}

export function RoleTable({ pageSize, searchValue, onNotify }: RoleTableProps) {
  const tableContext = useTableContext();

  const activeSearch =
    searchValue !== undefined
      ? searchValue
      : tableContext?.searchQuery ?? "";

  const activePageSize =
    pageSize !== undefined
      ? pageSize
      : tableContext?.pageSize ?? 10;

  const { data = [], isLoading, error, refetch } = useRoles({
    search: activeSearch || undefined,
    per_page: activePageSize,
  });
  const { deleteMut } = useRoleMutations();

  return (
    <PaginatedTable<RoleRecord>
      data={data}
      columns={roleColumns}
      pageSize={activePageSize}
      searchValue={activeSearch}
      minWidth="1200px"
      actionsLabel="Action"
      isLoading={isLoading}
      error={error ? error.message : null}
      onRetry={() => refetch()}
      renderActions={(row, notify) => (
        <ActionButtonGroup aria-label={`Actions for role ${row.id}`}>
          <ActionButton
            label="View Role"
            icon={Eye}
            onClick={() => (onNotify || notify)(`Viewing role #${row.id}`)}
          />
          <ActionButton
            label="Edit Role"
            icon={PenSquareIcon}
            onClick={() => (onNotify || notify)(`Editing role #${row.id}`)}
          />
          <ActionButton
            label="Delete Role"
            icon={Trash2}
            variant="danger"
            onClick={() => {
              if (confirm(`Are you sure you want to delete role "${row.name}"?`)) {
                deleteMut.mutate(String(row.id), {
                  onSuccess: () => (onNotify || notify)(`Deleted role #${row.id}`),
                });
              }
            }}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default RoleTable;

