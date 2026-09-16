import type { RackRecord } from '@/features/attributes/types/attribute.types';
export type { RackRecord };
import type { ColumnDef } from '@/components/ui/ReusableTable.types';

export const rackData: RackRecord[] = [
  {
    id: 7,
    name: "Rack_1",
    code: "-",
    subZone: "Solimuddin Market",
    description: "-",
  },
  {
    id: 6,
    name: "Rack 2",
    code: "12313",
    subZone: "College Gate",
    description: "-",
  },
  {
    id: 5,
    name: "Rack 1",
    code: "1234",
    subZone: "College Gate",
    description: "-",
  },
  {
    id: 4,
    name: "rack4",
    code: "-",
    subZone: "SubZone2",
    description: "-",
  },
  {
    id: 3,
    name: "Rack3",
    code: "-",
    subZone: "SubZone2",
    description: "-",
  },
  {
    id: 2,
    name: "Rack2",
    code: "-",
    subZone: "SubZone1",
    description: "-",
  },
  {
    id: 1,
    name: "Rack1",
    code: "-",
    subZone: "SubZone1",
    description: "-",
  },
];

export const columns: ColumnDef<RackRecord>[] = [
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "subZone", label: "Sub Zone" },
  { key: "description", label: "Description" },
];
