"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/table-toolbar";
import FilterCard from "@/components/ui/filter-card";
import { MasterFGProductTable } from "@/features/products/components/master-fg-product-table";

export default function MasterFGProductPage() {
  return (
    <>
      {/* ── Breadcrumb Bar with Table Toolbar ── */}
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Product"
            items={[
              { label: "Product", href: "/products/master-fg-product" },
              { label: "Master FG Product", href: "/products/master-fg-product" },
            ]}
          />
        </div>
        <div>
          <TableToolbar />
        </div>
      </div>

      {/* ── Filter Card ── */}
      <div className="mt-4">
        <FilterCard />
      </div>

      {/* ── Master Product Table ── */}
      <div className="mt-4">
        <MasterFGProductTable />
      </div>
    </>
  );
}