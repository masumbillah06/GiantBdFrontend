"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import {
  subCategoryData,
  columns,
  type SubCategoryRecord,
} from "@/lib/mock-data/attributes/sub-category.mock";

export default function SubCategoryPage() {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return subCategoryData;
    const query = searchValue.toLowerCase();
    return subCategoryData.filter((row) =>
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
            title="Sub Category"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Sub Category", href: "/attribute/sub-category" },
            ]}
          />
        </div>
        <div>
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new sub category")}
            newButtonLabel="New Sub Category"
          />
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<SubCategoryRecord>
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          minWidth="1000px"
          actionsLabel="Action"
          renderActions={(row) => (
            <ActionButtonGroup aria-label={`Actions for sub category ${row.id}`}>
              <ActionButton
                label="View Sub Category"
                icon={Eye}
                onClick={() => console.log("View sub category", row.id)}
              />
              <ActionButton
                label="Edit Sub Category"
                icon={PenSquareIcon}
                onClick={() => console.log("Edit sub category", row.id)}
              />
              <ActionButton
                label="Delete Sub Category"
                icon={Trash2}
                onClick={() => console.log("Delete sub category", row.id)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}