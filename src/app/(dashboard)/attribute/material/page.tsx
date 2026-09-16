"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import {
  materialData,
  columns,
  type MaterialRecord,
} from "@/lib/mock-data/attributes/material.mock";

export default function MaterialPage() {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return materialData;
    const query = searchValue.toLowerCase();
    return materialData.filter((row) =>
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
            title="Material"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Material", href: "/attribute/material" },
            ]}
          />
        </div>
        <div>
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new material")}
            newButtonLabel="New Material"
          />
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<MaterialRecord>
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          minWidth="800px"
          actionsLabel="Action"
          renderActions={(row) => (
            <ActionButtonGroup aria-label={`Actions for material ${row.id}`}>
              <ActionButton
                label="View Material"
                icon={Eye}
                onClick={() => console.log("View material", row.id)}
              />
              <ActionButton
                label="Edit Material"
                icon={PenSquareIcon}
                onClick={() => console.log("Edit material", row.id)}
              />
              <ActionButton
                label="Delete Material"
                icon={Trash2}
                onClick={() => console.log("Delete material", row.id)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}