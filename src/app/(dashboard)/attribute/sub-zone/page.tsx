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
  subZoneData,
  columns,
  type SubZoneRecord,
} from "@/lib/mock-data/attributes/sub-zone.mock";
import { useSubZones, useSubZoneMutations } from "@/features/attributes/hooks/use-attributes";

export default function SubZonePage() {
  const { data = subZoneData, isLoading, error, refetch } = useSubZones();
  const { deleteMut } = useSubZoneMutations();
  return (
    <TableProvider title="Sub Zones" entityName="Sub Zone" newHref="/attribute/sub-zone/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Sub Zone"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Sub Zone", href: "/attribute/sub-zone" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search sub zones..." />
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
        <PaginatedTable<SubZoneRecord>
          data={data}
          columns={columns}
          minWidth="800px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for sub zone ${row.id}`}>
              <ActionButton
                label="View Sub Zone"
                icon={Eye}
                onClick={() => notify(`Viewing sub zone #${row.id}`)}
              />
              <ActionButton
                label="Edit Sub Zone"
                icon={PenSquareIcon}
                onClick={() => notify(`Editing sub zone #${row.id}`)}
              />
              <ActionButton
                label="Delete Sub Zone"
                icon={Trash2}
                variant="danger"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete sub zone "${row.name}"?`)) {
                    deleteMut.mutate(String(row.id), {
                      onSuccess: () => notify(`Deleted sub zone #${row.id}`),
                      onError: (err: any) => notify(err?.response?.data?.message || `Failed to delete sub zone`),
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