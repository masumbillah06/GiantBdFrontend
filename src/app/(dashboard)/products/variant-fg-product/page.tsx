"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import {
  TableProvider,
  TableToolbar,
  TableToolbarActions,
  TableToolbarExport,
  TableToolbarNew,
  TableToolbarPageSize,
  TableToolbarPrint,
  TableToolbarReload,
  TableToolbarSearch,
} from "@/components/ui/table";
import FilterCard, { type FilterCardField } from "@/components/ui/filter-card";
import { VariantFGProductTable } from "@/features/products/components/variant-fg-product-table";

const VARIANT_PRODUCT_FILTER_FIELDS: FilterCardField[] = [
  {
    key: "masterProduct",
    label: "Master",
    placeholder: "Filter by master...",
    width: "w-48",
  },
  {
    key: "material",
    label: "Material",
    placeholder: "Filter by material...",
    width: "w-44",
  },
  {
    key: "size",
    label: "Size",
    placeholder: "Filter by size...",
    width: "w-32",
  },
  {
    key: "color",
    label: "Color",
    placeholder: "Filter by color...",
    width: "w-36",
  },
  {
    key: "gender",
    label: "Gender",
    placeholder: "Filter by gender...",
    width: "w-36",
  },
  {
    key: "status",
    label: "Status",
    placeholder: "Filter by status...",
    width: "w-36",
  },
];

export default function VariantFGProductPage() {
  return (
    <TableProvider title="Variant FG Products" entityName="Variant Product">
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
          <TableToolbar>
            <TableToolbarSearch placeholder="Search variant products..." />
            <TableToolbarActions>
              <TableToolbarExport />
              <TableToolbarReload />
              <TableToolbarPrint />
              <TableToolbarPageSize />
              <TableToolbarNew />
            </TableToolbarActions>
          </TableToolbar>
        </div>
      </div>

      {/* ── Filter Card ── */}
      <div className="mt-4">
        <FilterCard fields={VARIANT_PRODUCT_FILTER_FIELDS} />
      </div>

      {/* ── Variant Product Table ── */}
      <div className="mt-4">
        <VariantFGProductTable />
      </div>
    </TableProvider>
  );
}
