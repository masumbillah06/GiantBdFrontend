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
import { type ColorRecord } from "@/features/attributes/types/attribute.types";
import { useColors, useColorMutations } from "@/features/attributes/hooks/use-attributes";

const colorColumns: ColumnDef<ColorRecord>[] = [
  { key: "name", label: "Color Name", sortable: true },
  {
    key: "code",
    label: "Color Code / Preview",
    render: (row) => (
      <div className="flex items-center gap-2">
        {row.code ? (
          <span
            className="w-4 h-4 rounded-full border border-slate-300 inline-block shadow-xs shrink-0"
            style={{ backgroundColor: row.code }}
          />
        ) : null}
        <span className="font-mono text-xs">{row.code || "-"}</span>
      </div>
    ),
  },
  { key: "description", label: "Description" },
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
];

export default function ColorPage() {
  const { data = [], isLoading, error, refetch } = useColors();
  const { deleteMut } = useColorMutations();
  return (
    <TableProvider title="Colors" entityName="Color" newHref="/attribute/color/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Color"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Color", href: "/attribute/color" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search colors..." />
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
        <PaginatedTable<ColorRecord>
          data={data}
          columns={colorColumns}
          minWidth="800px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for color ${row.id}`}>
              <ActionButton
                label="View Color"
                icon={Eye}
                onClick={() => notify(`Viewing color #${row.id}`)}
              />
              <ActionButton
                label="Edit Color"
                icon={PenSquareIcon}
                onClick={() => notify(`Editing color #${row.id}`)}
              />
              <ActionButton
                label="Delete Color"
                icon={Trash2}
                variant="danger"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete color "${row.name}"?`)) {
                    deleteMut.mutate(String(row.id), {
                      onSuccess: () => notify(`Deleted color #${row.id}`),
                      onError: (err: any) => notify(err?.response?.data?.message || `Failed to delete color`),
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