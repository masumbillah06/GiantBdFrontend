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
import {
  subCategoryData,
  columns,
  type SubCategoryRecord,
} from "@/lib/mock-data/attributes/sub-category.mock";
import { useSubCategories, useSubCategoryMutations } from "@/features/attributes/hooks/use-attributes";

export default function SubCategoryPage() {
  const { data = subCategoryData, isLoading, error, refetch } = useSubCategories();
  const { deleteMut } = useSubCategoryMutations();
  return (
    <TableProvider title="Sub Categories" entityName="Sub Category" newHref="/attribute/sub-category/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Sub Category"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Sub Category", href: "/attribute/sub-category" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search sub categories..." />
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
        <PaginatedTable<SubCategoryRecord>
          data={data}
          columns={columns}
          minWidth="800px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for sub category ${row.id}`}>
              <ActionButton
                label="View Sub Category"
                icon={Eye}
                onClick={() => notify(`Viewing sub category #${row.id}`)}
              />
              <ActionButton
                label="Edit Sub Category"
                icon={PenSquareIcon}
                onClick={() => notify(`Editing sub category #${row.id}`)}
              />
              <ActionButton
                label="Delete Sub Category"
                icon={Trash2}
                variant="danger"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete sub category "${row.name}"?`)) {
                    deleteMut.mutate(String(row.id), {
                      onSuccess: () => notify(`Deleted sub category #${row.id}`),
                      onError: (err: any) => notify(err?.response?.data?.message || `Failed to delete sub category`),
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