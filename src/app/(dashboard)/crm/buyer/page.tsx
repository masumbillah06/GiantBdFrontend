"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
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
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onNew={() => console.log("Create new customer")}
            newButtonLabel="New Customer"
          />
        </div>
      </div>

      <div className="mt-4">
        <BuyerTable searchValue={searchValue} pageSize={pageSize} />
      </div>
    </>
  );
}