"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
import { PermissionTable } from "@/features/iam/components/permission-table";

export default function PermissionPage() {
  return (
    <>
      {/* ── Breadcrumb Bar with Table Toolbar ── */}
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Permission"
            items={[{ label: "Permission", href: "/permission" }]}
          />
        </div>
        <div>
          <TableToolbar />
        </div>
      </div>

      {/* ── Permission Matrix Table ── */}
      <div className="mt-4">
        <PermissionTable />
      </div>
    </>
  );
}