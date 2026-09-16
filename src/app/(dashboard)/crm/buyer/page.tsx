"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import {
  TableToolbar,
  TableToolbarActions,
  TableToolbarExport,
  TableToolbarNew,
  TableToolbarPageSize,
  TableToolbarPrint,
  TableToolbarReload,
  TableToolbarSearch,
} from "@/components/ui/table";
import { BuyerTable } from "@/features/crm/components/buyer-table";

export default function BuyerPage() {
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  return (
    <>
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="CRM"
            items={[
              { label: "CRM", href: "/crm/buyer" },
              { label: "Customer", href: "/crm/buyer" },
            ]}
          />
        </div>
        <div>
          <TableToolbar>
            <TableToolbarSearch
              value={searchValue}
              onChange={setSearchValue}
            />
            <TableToolbarActions>
              <TableToolbarExport />
              <TableToolbarReload />
              <TableToolbarPrint />
              <TableToolbarPageSize
                value={pageSize}
                onChange={setPageSize}
              />
              <TableToolbarNew
                onClick={() => console.log("Create new customer")}
                label="New Customer"
              />
            </TableToolbarActions>
          </TableToolbar>
        </div>
      </div>

      <div className="mt-4">
        <BuyerTable searchValue={searchValue} pageSize={pageSize} />
      </div>
    </>
  );
}