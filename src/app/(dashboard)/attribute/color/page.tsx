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
  colorData,
  columns,
  type ColorRecord,
} from "@/lib/mock-data/attributes/color.mock";

export default function ColorPage() {
  return (
    <TableProvider title="Colors" entityName="Color">
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
          data={colorData}
          columns={columns}
          minWidth="800px"
          actionsLabel="Action"
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
                onClick={() => notify(`Deleted color #${row.id}`)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </TableProvider>
  );
}