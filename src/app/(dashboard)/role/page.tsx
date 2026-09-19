"use client";

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
import { RoleTable } from "@/features/iam/components/role-table";

export default function RolePage() {
  return (
    <TableProvider title="Roles" entityName="Role" newHref="/role/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Role"
            items={[{ label: "Role", href: "/role" }]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search roles..." />
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
        <RoleTable />
      </div>
    </TableProvider>
  );
}