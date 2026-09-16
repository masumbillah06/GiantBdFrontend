"use client";

import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";
import type { RoleRecord } from "../types/iam.types";
import { useRoles } from "../hooks/use-iam";

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
  const { data = [], isLoading, error, refetch } = useRoles();

  return (
    <PaginatedTable<RoleRecord>
      data={data}
      columns={roleColumns}
      pageSize={pageSize}
      searchValue={searchValue}
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
            onClick={() => (onNotify || notify)(`Deleted role #${row.id}`)}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default RoleTable;

