"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
import { UserTable } from "@/features/iam/components/user-table";

export default function UserPage() {
  return (
    <>
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="User"
            items={[{ label: "User", href: "/user" }]}
          />
        </div>
        <div>
          <TableToolbar />
        </div>
      </div>
      <div className="mt-4">
        <UserTable />
      </div>
    </>
  );
}