import type { ZoneRecord } from '@/features/attributes/types/attribute.types';
export type { ZoneRecord };
import type { ColumnDef } from '@/components/ui/table/ReusableTable.types';

export const zoneData: ZoneRecord[] = [
  {
    id: 3,
    name: "Mirpur 1",
    code: "-",
    warehouse: "Mirpur",
    description: "-",
  },
  {
    id: 2,
    name: "Tongi Zone",
    code: "1234",
    warehouse: "Gazipur",
    description: "-",
  },
  {
    id: 1,
    name: "Zone1",
    code: "-",
    warehouse: "WarehouseFG",
    description: "-",
  },
];

export const columns: ColumnDef<ZoneRecord>[] = [
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  {
    key: "warehouse",
    label: "Warehouse",
    render: (row) =>
      typeof row.warehouse === "object" && row.warehouse !== null
        ? row.warehouse.name
        : (row.warehouse as string) || "-",
  },
  { key: "description", label: "Description" },
];
