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
  warehouseData,
  columns,
  type WarehouseRecord,
} from "@/lib/mock-data/attributes/warehouse.mock";

export default function WarehousePage() {
  return (
    <TableProvider title="Warehouses" entityName="Warehouse">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Warehouse"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Warehouse", href: "/attribute/warehouse" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search warehouses..." />
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
        <PaginatedTable<WarehouseRecord>
          data={warehouseData}
          columns={columns}
          minWidth="900px"
          actionsLabel="Action"
          renderActions={(row, notify) => (
            <ActionButtonGroup aria-label={`Actions for warehouse ${row.id}`}>
              <ActionButton
                label="View Warehouse"
                icon={Eye}
                onClick={() => notify(`Viewing warehouse #${row.id}`)}
              />
              <ActionButton
                label="Edit Warehouse"
                icon={PenSquareIcon}
                onClick={() => notify(`Editing warehouse #${row.id}`)}
              />
              <ActionButton
                label="Delete Warehouse"
                icon={Trash2}
                variant="danger"
                onClick={() => notify(`Deleted warehouse #${row.id}`)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}