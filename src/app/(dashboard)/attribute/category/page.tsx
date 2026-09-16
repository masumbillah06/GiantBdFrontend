"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import {
  categoryData,
  columns,
  type CategoryRecord,
} from "@/lib/mock-data/attributes/category.mock";

export default function CategoryPage() {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return categoryData;
    const query = searchValue.toLowerCase();
    return categoryData.filter((row) =>
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
            title="Category"
            items={[
              { label: "Attribute", href: "/attribute/category" },
              { label: "Category", href: "/attribute/category" },
            ]}
          />
        </div>
        <div>
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new category")}
            newButtonLabel="New Category"
          />
        </div>
      </div>

      <div className="mt-4">
        <PaginatedTable<CategoryRecord>
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          minWidth="800px"
          actionsLabel="Action"
          renderActions={(row) => (
            <ActionButtonGroup aria-label={`Actions for category ${row.id}`}>
              <ActionButton
                label="View Category"
                icon={Eye}
                onClick={() => console.log("View category", row.id)}
              />
              <ActionButton
                label="Edit Category"
                icon={PenSquareIcon}
                onClick={() => console.log("Edit category", row.id)}
              />
              <ActionButton
                label="Delete Category"
                icon={Trash2}
                onClick={() => console.log("Delete category", row.id)}
              />
            </ActionButtonGroup>
          )}
        />
      </div>
    </>
  );
}