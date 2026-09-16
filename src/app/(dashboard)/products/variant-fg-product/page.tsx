"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import TableToolbar from "@/components/ui/toolbar";
import FilterCard from "@/components/ui/filter-card";
import { VariantFGProductTable } from "@/features/products/components/variant-fg-product-table";

export default function VariantFGProductPage() {
  return (
    <>
      {/* ── Breadcrumb Bar with Table Toolbar ── */}
      <div className="min-h-20 w-full flex justify-between items-center bg-white shadow-sm rounded-xl">
        <div>
          <Breadcrumb
            title="Product"
            items={[
              { label: "Product", href: "/products/variant-fg-product" },
              { label: "Variant FG Product", href: "/products/variant-fg-product" },
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

      {/* ── Variant Product Table ── */}
      <div className="mt-4">
        <VariantFGProductTable />
      </div>
    </>
  );
}
