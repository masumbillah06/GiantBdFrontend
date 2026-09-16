"use client";

import { AlertTriangle, Check, Eye, PenSquareIcon, Trash2 } from "lucide-react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";
import type { MasterProduct } from "../types/product.types";
import { useMasterProducts } from "../hooks/use-master-products";

export const masterProductColumns: ColumnDef<MasterProduct>[] = [
  { key: "masterProductName", label: "Master Product Name" },
  { key: "material",          label: "Material" },
  { key: "sku",               label: "SKU" },
  { key: "category",          label: "Category" },
  { key: "subCategory",       label: "Sub Category" },
  { key: "variants",          label: "Variants" },
  {
    key: "label",
    label: "Label",
    render: (row) =>
      row.label === "verified" ? (
        <span
          title="Verified"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-600"
        >
          <Check className="h-4 w-4 stroke-[2.5]" />
        </span>
      ) : (
        <span
          title="Warning"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600"
        >
          <AlertTriangle className="h-4 w-4 stroke-[2.5]" />
        </span>
      ),
  },
];

export interface MasterFGProductTableProps {
  onNotify?: (msg: string) => void;
}

export function MasterFGProductTable({ onNotify }: MasterFGProductTableProps) {
  const { data = [], isLoading, error, refetch } = useMasterProducts();

  return (
    <PaginatedTable<MasterProduct>
      data={data}
      columns={masterProductColumns}
      pageSize={10}
      minWidth="1200px"
      actionsLabel="Action"
      isLoading={isLoading}
      error={error ? error.message : null}
      onRetry={() => refetch()}
      renderActions={(row, notify) => (
        <ActionButtonGroup aria-label={`Actions for product ${row.id}`}>
          <ActionButton
            label="View Product"
            icon={Eye}
            onClick={() => (onNotify || notify)(`Viewing product #${row.id}`)}
          />
          <ActionButton
            label="Edit Product"
            icon={PenSquareIcon}
            onClick={() => (onNotify || notify)(`Editing product #${row.id}`)}
          />
          <ActionButton
            label="Delete Product"
            icon={Trash2}
            variant="danger"
            onClick={() => (onNotify || notify)(`Deleted product #${row.id}`)}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default MasterFGProductTable;

