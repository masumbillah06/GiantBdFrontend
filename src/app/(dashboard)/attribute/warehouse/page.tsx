"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import {
  warehouseData,
  columns,
  type WarehouseRecord,
} from "@/lib/mock-data/attributes/warehouse.mock";

export default function WarehousePage() {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return warehouseData;
    const query = searchValue.toLowerCase();
    return warehouseData.filter((row) =>
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
            title="Warehouse"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Warehouse", href: "/attribute/warehouse" },
            ]}
          />
        </div>
        <div>
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new warehouse")}
            newButtonLabel="New Warehouse"
          />
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<WarehouseRecord>
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          minWidth="900px"
          actionsLabel="Action"
          renderActions={(row) => (
            <ActionButtonGroup aria-label={`Actions for warehouse ${row.id}`}>
              <ActionButton
                label="View Warehouse"
                icon={Eye}
                onClick={() => console.log("View warehouse", row.id)}
              />
              <ActionButton
                label="Edit Warehouse"
                icon={PenSquareIcon}
                onClick={() => console.log("Edit warehouse", row.id)}
              />
              <ActionButton
                label="Delete Warehouse"
                icon={Trash2}
                onClick={() => console.log("Delete warehouse", row.id)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}