"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import {
  colorData,
  columns,
  type ColorRecord,
} from "@/lib/mock-data/attributes/color.mock";

export default function ColorPage() {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return colorData;
    const query = searchValue.toLowerCase();
    return colorData.filter((row) =>
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
            title="Color"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Color", href: "/attribute/color" },
            ]}
          />
        </div>
        <div>
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new color")}
            newButtonLabel="New Color"
          />
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<ColorRecord>
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          minWidth="800px"
          actionsLabel="Action"
          renderActions={(row) => (
            <ActionButtonGroup aria-label={`Actions for color ${row.id}`}>
              <ActionButton
                label="View Color"
                icon={Eye}
                onClick={() => console.log("View color", row.id)}
              />
              <ActionButton
                label="Edit Color"
                icon={PenSquareIcon}
                onClick={() => console.log("Edit color", row.id)}
              />
              <ActionButton
                label="Delete Color"
                icon={Trash2}
                onClick={() => console.log("Delete color", row.id)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}