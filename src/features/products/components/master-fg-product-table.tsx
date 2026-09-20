"use client";

import { useMemo } from "react";
import { AlertTriangle, Check, Eye, PenSquareIcon, Trash2 } from "lucide-react";
import PaginatedTable from "@/components/ui/table/paginated-table";
import { useTableContext } from "@/components/ui/table/table-context";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";
import type { MasterProduct } from "../types/product.types";
import { useMasterProducts, useMasterProductMutations } from "../hooks/use-master-products";

export const masterProductColumns: ColumnDef<MasterProduct>[] = [
  { key: "masterProductName", label: "Master Product Name" },
  {
    key: "material",
    label: "Material",
    render: (row) =>
      typeof row.material === "object" && row.material !== null
        ? (row.material as { name?: string }).name || "N/A"
        : row.material || "N/A",
  },
  { key: "sku", label: "SKU" },
  {
    key: "category",
    label: "Category",
    render: (row) =>
      typeof row.category === "object" && row.category !== null
        ? (row.category as { name?: string }).name || "N/A"
        : row.category || "N/A",
  },
  {
    key: "subCategory",
    label: "Sub Category",
    render: (row) =>
      typeof row.subCategory === "object" && row.subCategory !== null
        ? (row.subCategory as { name?: string }).name || "N/A"
        : row.subCategory || "N/A",
  },
  { key: "variants", label: "Variants" },
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
  pageSize?: number;
  searchValue?: string;
  filters?: Record<string, string | number>;
  onNotify?: (msg: string) => void;
}

export function MasterFGProductTable({ pageSize, searchValue, filters, onNotify }: MasterFGProductTableProps) {
  const tableContext = useTableContext();

  const activeSearch =
    searchValue !== undefined
      ? searchValue
      : tableContext?.searchQuery ?? "";

  const activePageSize =
    pageSize !== undefined
      ? pageSize
      : tableContext?.pageSize ?? 10;

  const activeFilters = useMemo(() => {
    return {
      ...(tableContext?.filters ?? {}),
      ...(filters ?? {}),
    };
  }, [tableContext?.filters, filters]);

  const { data = [], isLoading, error, refetch } = useMasterProducts({
    search: activeSearch || undefined,
    per_page: activePageSize,
    ...activeFilters,
  });
  const { deleteMut } = useMasterProductMutations();

  return (
    <PaginatedTable<MasterProduct>
      data={data}
      columns={masterProductColumns}
      pageSize={activePageSize}
      searchValue={activeSearch}
      filters={activeFilters}
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
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.masterProductName}?`)) {
                deleteMut.mutate(String(row.id), {
                  onSuccess: () => (onNotify || notify)(`Deleted product #${row.id}`),
                });
              }
            }}
          />
        </ActionButtonGroup>
      )}
    />
  );
}

export default MasterFGProductTable;

