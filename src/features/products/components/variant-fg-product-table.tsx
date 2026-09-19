"use client";

import { Eye, PenSquareIcon, Trash2 } from "lucide-react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";
import type { VariantProduct } from "../types/product.types";
import { useVariantProducts, useVariantMutations } from "../hooks/use-master-products";

export const variantProductColumns: ColumnDef<VariantProduct>[] = [
  {
    key: "masterProduct",
    label: "Master Product",
    render: (row) =>
      typeof row.masterProduct === "object" && row.masterProduct !== null
        ? (row.masterProduct as { name?: string }).name || "N/A"
        : row.masterProduct || "N/A",
  },
  {
    key: "material",
    label: "Material",
    render: (row) =>
      typeof row.material === "object" && row.material !== null
        ? (row.material as { name?: string }).name || "N/A"
        : row.material || "N/A",
  },
  { key: "sku", label: "SKU" },
  { key: "modelNo", label: "Model No" },
  { key: "size", label: "Size" },
  {
    key: "color",
    label: "Color",
    render: (row) =>
      typeof row.color === "object" && row.color !== null
        ? (row.color as { name?: string }).name || "N/A"
        : row.color || "N/A",
  },
  { key: "gender", label: "Gender" },
  { key: "uom", label: "UOM" },
  { key: "productsPerPacket", label: "Products/Packet" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={
          row.status === "active"
            ? "font-medium capitalize text-emerald-600"
            : "font-medium capitalize text-rose-500"
        }
      >
        {row.status}
      </span>
    ),
  },
];

export interface VariantFGProductTableProps {
  pageSize?: number;
  searchValue?: string;
  filters?: Record<string, string | number>;
  onNotify?: (msg: string) => void;
}

export function VariantFGProductTable({ pageSize, searchValue, filters, onNotify }: VariantFGProductTableProps) {
  const { data = [], isLoading, error, refetch } = useVariantProducts({ search: searchValue, ...filters });
  const { deleteMut } = useVariantMutations();

  return (
    <PaginatedTable<VariantProduct>
      data={data}
      columns={variantProductColumns}
      pageSize={pageSize}
      searchValue={searchValue}
      filters={filters}
      minWidth="1200px"
      actionsLabel="Action"
      isLoading={isLoading}
      error={error ? error.message : null}
      onRetry={() => refetch()}
      renderActions={(row, notify) => (
        <ActionButtonGroup aria-label={`Actions for variant ${row.id}`}>
          <ActionButton
            label="View Product"
            icon={Eye}
            onClick={() => (onNotify || notify)(`Viewing variant #${row.id}`)}
          />
          <ActionButton
            label="Edit Product"
            icon={PenSquareIcon}
            onClick={() => (onNotify || notify)(`Editing variant #${row.id}`)}
          />
          <ActionButton
            label="Delete Product"
            icon={Trash2}
            variant="danger"
            onClick={() => {
              if (confirm(`Are you sure you want to delete variant SKU ${row.sku || row.id}?`)) {
                deleteMut.mutate(String(row.id), {
                  onSuccess: () => (onNotify || notify)(`Deleted variant #${row.id}`),
                });
              }
            }}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default VariantFGProductTable;

