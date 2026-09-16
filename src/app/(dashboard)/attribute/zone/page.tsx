"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import {
  zoneData,
  columns,
  type ZoneRecord,
} from "@/lib/mock-data/attributes/zone.mock";

export default function ZonePage() {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return zoneData;
    const query = searchValue.toLowerCase();
    return zoneData.filter((row) =>
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
            title="Zone"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Zone", href: "/attribute/zone" },
            ]}
          />
        </div>
        <div>
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new zone")}
            newButtonLabel="New Zone"
          />
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<ZoneRecord>
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          minWidth="1000px"
          actionsLabel="Action"
          renderActions={(row) => (
            <ActionButtonGroup aria-label={`Actions for zone ${row.id}`}>
              <ActionButton
                label="View Zone"
                icon={Eye}
                onClick={() => console.log("View zone", row.id)}
              />
              <ActionButton
                label="Edit Zone"
                icon={PenSquareIcon}
                onClick={() => console.log("Edit zone", row.id)}
              />
              <ActionButton
                label="Delete Zone"
                icon={Trash2}
                onClick={() => console.log("Delete zone", row.id)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}