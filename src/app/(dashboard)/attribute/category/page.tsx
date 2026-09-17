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
  categoryData,
  columns,
  type CategoryRecord,
} from "@/lib/mock-data/attributes/category.mock";
import { useCategories } from "@/features/attributes/hooks/use-attributes";

export default function CategoryPage() {
  const { data = categoryData, isLoading, error, refetch } = useCategories();
  return (
    <TableProvider title="Categories" entityName="Category">
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
          columns={columns}
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
                onClick={() => notify(`Deleted category #${row.id}`)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}