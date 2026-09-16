"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
import { RoleTable } from "@/features/iam/components/role-table";

export default function RolePage() {
  return (
    <>
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Role"
            items={[{ label: "Role", href: "/role" }]}
          />
        </div>
        <div>
          <TableToolbar />
        </div>
      </div>
      <div className="mt-4">
        <RoleTable />
      </div>
    </>
  );
}