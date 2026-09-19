"use client";

import React from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import {
  TableProvider,
  TableToolbar,
  TableToolbarActions,
  TableToolbarExport,
  TableToolbarNew,
  TableToolbarPageSize,
  TableToolbarPrint,
  TableToolbarReload,
  TableToolbarSearch,
} from "@/components/ui/table";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";
import { type CategoryRecord } from "@/features/attributes/types/attribute.types";
import { useCategories, useCategoryMutations } from "@/features/attributes/hooks/use-attributes";

const categoryColumns: ColumnDef<CategoryRecord>[] = [
  { key: "name", label: "Category Name", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === "INACTIVE"
            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
        }`}
      >
        {row.status || "ACTIVE"}
      </span>
    ),
  },
  {
    key: "_count",
    label: "Sub-Categories",
    render: (row) => (
      <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
        {row._count?.subCategories ?? 0}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
  },
];

export default function CategoryPage() {
  const { data = [], isLoading, error, refetch } = useCategories();
  const { deleteMut } = useCategoryMutations();
  return (
    <TableProvider title="Categories" entityName="Category" newHref="/attribute/category/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Category"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Category", href: "/attribute/category" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search categories..." />
            <TableToolbarActions>
              <TableToolbarExport />
              <TableToolbarReload />
              <TableToolbarPrint />
              <TableToolbarPageSize />
              <TableToolbarNew />
            </TableToolbarActions>
          </TableToolbar>
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<CategoryRecord>
          data={data}
          columns={categoryColumns}
          minWidth="800px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for category ${row.id}`}>
              <ActionButton
                label="View Category"
                icon={Eye}
                onClick={() => notify(`Viewing category #${row.id}`)}
              />
              <ActionButton
                label="Edit Category"
                icon={PenSquareIcon}
                onClick={() => notify(`Editing category #${row.id}`)}
              />
              <ActionButton
                label="Delete Category"
                icon={Trash2}
                variant="danger"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete category "${row.name}"?`)) {
                    deleteMut.mutate(String(row.id), {
                      onSuccess: () => notify(`Deleted category #${row.id}`),
                      onError: (err: any) => notify(err?.response?.data?.message || `Failed to delete category`),
                    });
                  }
                }}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}