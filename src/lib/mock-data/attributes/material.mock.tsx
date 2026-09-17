import React from 'react';
import type { MaterialRecord } from '@/features/attributes/types/attribute.types';
export type { MaterialRecord };
import type { ColumnDef } from '@/components/ui/table/ReusableTable.types';

export const materialData: MaterialRecord[] = [
  {
    id: 6,
    name: "Fiber",
    description: "-",
    status: "Active",
  },
  {
    id: 5,
    name: "Poly",
    description: "-",
    status: "Active",
  },
  {
    id: 4,
    name: "Aluminium + Plastic",
    description: "-",
    status: "Active",
  },
  {
    id: 3,
    name: "TPR",
    description: "-",
    status: "Active",
  },
  {
    id: 2,
    name: "RUBBER",
    description: "-",
    status: "Active",
  },
  {
    id: 1,
    name: "IP",
    description: "-",
    status: "Active",
  },
];

export const columns: ColumnDef<MaterialRecord>[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`font-medium capitalize ${
          row.status?.toLowerCase() === "active" ? "text-emerald-600" : "text-muted-foreground"
        }`}
      >
        {row.status ?? "active"}
      </span>
    ),
  },
];
