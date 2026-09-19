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
  rackData,
  columns,
  type RackRecord,
} from "@/lib/mock-data/attributes/rack.mock";
import { useRacks } from "@/features/attributes/hooks/use-attributes";

export default function RackPage() {
  const { data = rackData, isLoading, error, refetch } = useRacks();
  return (
    <TableProvider title="Racks" entityName="Rack" newHref="/attribute/rack/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Rack"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Rack", href: "/attribute/rack" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search racks..." />
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
        <PaginatedTable<RackRecord>
          data={data}
          columns={columns}
          minWidth="800px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for rack ${row.id}`}>
              <ActionButton
                label="View Rack"
                icon={Eye}
                onClick={() => notify(`Viewing rack #${row.id}`)}
              />
              <ActionButton
                label="Edit Rack"
                icon={PenSquareIcon}
                onClick={() => notify(`Editing rack #${row.id}`)}
              />
              <ActionButton
                label="Delete Rack"
                icon={Trash2}
                variant="danger"
                onClick={() => notify(`Deleted rack #${row.id}`)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}