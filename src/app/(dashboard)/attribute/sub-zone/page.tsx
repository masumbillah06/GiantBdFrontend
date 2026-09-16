"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
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
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return subZoneData;
    const query = searchValue.toLowerCase();
    return subZoneData.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "").toLowerCase().includes(query)
      )
    );
  }, [searchValue]);

  return (
    <>
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
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new sub zone")}
            newButtonLabel="New Sub Zone"
          />
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<SubZoneRecord>
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          minWidth="1000px"
          actionsLabel="Action"
          renderActions={(row) => (
            <ActionButtonGroup aria-label={`Actions for sub zone ${row.id}`}>
              <ActionButton
                label="View Sub Zone"
                icon={Eye}
                onClick={() => console.log("View sub zone", row.id)}
              />
              <ActionButton
                label="Edit Sub Zone"
                icon={PenSquareIcon}
                onClick={() => console.log("Edit sub zone", row.id)}
              />
              <ActionButton
                label="Delete Sub Zone"
                icon={Trash2}
                onClick={() => console.log("Delete sub zone", row.id)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}