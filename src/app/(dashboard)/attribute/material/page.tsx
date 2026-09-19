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
  materialData,
  columns,
  type MaterialRecord,
} from "@/lib/mock-data/attributes/material.mock";
import { useMaterials } from "@/features/attributes/hooks/use-attributes";

export default function MaterialPage() {
  const { data = materialData, isLoading, error, refetch } = useMaterials();
  return (
    <TableProvider title="Materials" entityName="Material" newHref="/attribute/material/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Material"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Material", href: "/attribute/material" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search materials..." />
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
        <PaginatedTable<MaterialRecord>
          data={data}
          columns={columns}
          minWidth="800px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for material ${row.id}`}>
              <ActionButton
                label="View Material"
                icon={Eye}
                onClick={() => notify(`Viewing material #${row.id}`)}
              />
              <ActionButton
                label="Edit Material"
                icon={PenSquareIcon}
                onClick={() => notify(`Editing material #${row.id}`)}
              />
              <ActionButton
                label="Delete Material"
                icon={Trash2}
                variant="danger"
                onClick={() => notify(`Deleted material #${row.id}`)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}