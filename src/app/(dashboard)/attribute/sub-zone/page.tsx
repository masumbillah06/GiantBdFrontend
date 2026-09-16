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

export default function SubZonePage() {
  return (
    <TableProvider title="Sub Zones" entityName="Sub Zone">
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
          data={subZoneData}
          columns={columns}
          minWidth="800px"
          actionsLabel="Action"
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
                onClick={() => notify(`Deleted sub zone #${row.id}`)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}