import type { WarehouseRecord } from '@/features/attributes/types/attribute.types';
export type { WarehouseRecord };
import type { ColumnDef } from '@/components/ui/tables/ReusableTable.types';

export const warehouseData: WarehouseRecord[] = [
  {
    id: 3,
    name: "Mirpur",
    code: "3242424",
    description: "-",
  },
  {
    id: 2,
    name: "Gazipur",
    code: "4573",
    description: "Gazipur Main branch",
  },
  {
    id: 1,
    name: "WarehouseFG",
    code: "-",
    description: "-",
  },
];

export const columns: ColumnDef<WarehouseRecord>[] = [
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "description", label: "Description" },
];
