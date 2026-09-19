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
  zoneData,
  columns,
  type ZoneRecord,
} from "@/lib/mock-data/attributes/zone.mock";
import { useZones, useZoneMutations } from "@/features/attributes/hooks/use-attributes";

export default function ZonePage() {
  const { data = zoneData, isLoading, error, refetch } = useZones();
  const { deleteMut } = useZoneMutations();
  return (
    <TableProvider title="Zones" entityName="Zone" newHref="/attribute/zone/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Zone"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Zone", href: "/attribute/zone" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search zones..." />
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
        <PaginatedTable<ZoneRecord>
          data={data}
          columns={columns}
          minWidth="1000px"
          actionsLabel="Action"
          isLoading={isLoading}
          error={error ? error.message : null}
          onRetry={() => refetch()}
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for zone ${row.id}`}>
              <ActionButton
                label="View Zone"
                icon={Eye}
                onClick={() => notify(`Viewing zone #${row.id}`)}
              />
              <ActionButton
                label="Edit Zone"
                icon={PenSquareIcon}
                onClick={() => notify(`Editing zone #${row.id}`)}
              />
              <ActionButton
                label="Delete Zone"
                icon={Trash2}
                variant="danger"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete zone "${row.name}"?`)) {
                    deleteMut.mutate(String(row.id), {
                      onSuccess: () => notify(`Deleted zone #${row.id}`),
                      onError: (err: any) => notify(err?.response?.data?.message || `Failed to delete zone`),
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