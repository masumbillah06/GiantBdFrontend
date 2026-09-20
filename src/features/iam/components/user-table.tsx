"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { useTableContext } from "@/components/ui/table/table-context";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";
import type { UserRecord } from "../types/iam.types";
import { useUsers, useUserMutations } from "../hooks/use-iam";

export const userColumns: ColumnDef<UserRecord>[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "gender", label: "Gender" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span className="font-medium capitalize text-emerald-600">{row.status}</span>
    ),
  },
];

export interface UserTableProps {
  pageSize?: number;
  searchValue?: string;
  onNotify?: (msg: string) => void;
}

export function UserTable({ pageSize, searchValue, onNotify }: UserTableProps) {
  const router = useRouter();
  const tableContext = useTableContext();

  const activeSearch =
    searchValue !== undefined
      ? searchValue
      : tableContext?.searchQuery ?? "";

  const activePageSize =
    pageSize !== undefined
      ? pageSize
      : tableContext?.pageSize ?? 10;

  const { data = [], isLoading, error, refetch } = useUsers({
    search: activeSearch || undefined,
    per_page: activePageSize,
  });
  const { deleteMut } = useUserMutations();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PaginatedTable<UserRecord>
      data={data}
      columns={userColumns}
      pageSize={activePageSize}
      searchValue={activeSearch}
      minWidth="1200px"
      actionsLabel="Action"
      isLoading={isLoading}
      error={error ? error.message : null}
      onRetry={handleRetry}
      renderActions={(row, notify) => (
        <ActionButtonGroup aria-label={`Actions for user ${row.id}`}>
          <ActionButton
            label="View User"
            icon={Eye}
            onClick={() => router.push(`/user/details?id=${row.id}`)}
          />
          <ActionButton
            label="Edit User"
            icon={PenSquareIcon}
            onClick={() => router.push(`/user/edit?id=${row.id}`)}
          />
          <ActionButton
            label="Delete User"
            icon={Trash2}
            variant="danger"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.name}?`)) {
                deleteMut.mutate(String(row.id), {
                  onSuccess: () => (onNotify || notify)(`Deleted user #${row.id}`),
                });
              }
            }}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default UserTable;

