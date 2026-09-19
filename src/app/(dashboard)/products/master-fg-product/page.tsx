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
import { MasterFGProductTable } from "@/features/products/components/master-fg-product-table";

const MASTER_PRODUCT_FILTER_FIELDS: FilterCardField[] = [
  {
    key: "material",
    label: "Material",
    placeholder: "Filter by material...",
    width: "w-56",
  },
  {
    key: "category",
    label: "Category",
    placeholder: "Filter by category...",
    width: "w-52",
  },
];

export default function MasterFGProductPage() {
  return (
    <TableProvider
      title="Master FG Products"
      entityName="Master Product"
      newHref="/products/master-fg-product/new"
    >
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
          <TableToolbar>
            <TableToolbarSearch placeholder="Search master products..." />
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
        <FilterCard fields={MASTER_PRODUCT_FILTER_FIELDS} />
      </div>

      {/* ── Master Product Table ── */}
      <div className="mt-4">
        <MasterFGProductTable />
      </div>
    </TableProvider>
  );
}