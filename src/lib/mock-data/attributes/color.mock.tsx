import React from 'react';
import type { ColorRecord } from '@/features/attributes/types/attribute.types';
export type { ColorRecord };
import type { ColumnDef } from '@/components/ui/table/ReusableTable.types';

export const colorData: ColorRecord[] = [
  {
    id: 9,
    name: "White",
    description: "-",
    status: "Active",
  },
  {
    id: 8,
    name: "Silver",
    description: "Mate silver color",
    status: "Active",
  },
  {
    id: 7,
    name: "DKT-N0 DYE",
    description: "-",
    status: "Active",
  },
  {
    id: 6,
    name: "FIRE BLACK",
    description: "-",
    status: "Active",
  },
  {
    id: 5,
    name: "BROWN/N13A WHITE",
    description: "-",
    status: "Active",
  },
  {
    id: 4,
    name: "DKT-A27A GREEN",
    description: "-",
    status: "Active",
  },
  {
    id: 3,
    name: "DKT-N01A GREY",
    description: "-",
    status: "Active",
  },
  {
    id: 2,
    name: "DKT-CO7A RED",
    description: "-",
    status: "Active",
  },
  {
    id: 1,
    name: "RED",
    description: "—",
    status: "—",
  },
];

export const columns: ColumnDef<ColorRecord>[] = [
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
