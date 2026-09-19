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
import { UserTable } from "@/features/iam/components/user-table";

export default function UserPage() {
  return (
    <TableProvider title="Users" entityName="User" newHref="/user/new">
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="User"
            items={[{ label: "User", href: "/user" }]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch placeholder="Search users..." />
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
        <UserTable />
      </div>
    </TableProvider>
  );
}