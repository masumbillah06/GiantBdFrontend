"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import {
  rackData,
  columns,
  type RackRecord,
} from "@/lib/mock-data/attributes/rack.mock";

export default function RackPage() {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return rackData;
    const query = searchValue.toLowerCase();
    return rackData.filter((row) =>
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
            title="Rack"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Rack", href: "/attribute/rack" },
            ]}
          />
        </div>
        <div>
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new rack")}
            newButtonLabel="New Rack"
          />
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<RackRecord>
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          minWidth="1000px"
          actionsLabel="Action"
          renderActions={(row) => (
            <ActionButtonGroup aria-label={`Actions for rack ${row.id}`}>
              <ActionButton
                label="View Rack"
                icon={Eye}
                onClick={() => console.log("View rack", row.id)}
              />
              <ActionButton
                label="Edit Rack"
                icon={PenSquareIcon}
                onClick={() => console.log("Edit rack", row.id)}
              />
              <ActionButton
                label="Delete Rack"
                icon={Trash2}
                onClick={() => console.log("Delete rack", row.id)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}