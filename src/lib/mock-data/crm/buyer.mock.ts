import type { CustomerRecord } from '@/features/crm/types/crm.types';
import type { ColumnDef } from '@/components/ui/tables/ReusableTable.types';

export const customerData: CustomerRecord[] = [
  {
    id: 8,
    customerName: "Mehedi",
    customerLocations: "Dhaka, Bangladesh",
    createdOn: "2024-01-15",
    lastUpdated: "2024-02-10",
  },
  {
    id: 7,
    customerName: "MASUM BILLAH",
    customerLocations: "Chittagong, Bangladesh",
    createdOn: "2024-01-18",
    lastUpdated: "2024-02-12",
  },
  {
    id: 6,
    customerName: "Test User",
    customerLocations: "Sylhet, Bangladesh",
    createdOn: "2024-02-01",
    lastUpdated: "2024-02-15",
  },
  {
    id: 5,
    customerName: "Tashdik",
    customerLocations: "Dhaka, Bangladesh",
    createdOn: "2024-02-05",
    lastUpdated: "2024-02-20",
  },
  {
    id: 4,
    customerName: "Super Admin",
    customerLocations: "Rajshahi, Bangladesh",
    createdOn: "2024-02-10",
    lastUpdated: "2024-02-22",
  },
  {
    id: 2,
    customerName: "Global Imports Ltd",
    customerLocations: "Khulna, Bangladesh",
    createdOn: "2024-02-14",
    lastUpdated: "2024-02-25",
  },
];

export const columns: ColumnDef<CustomerRecord>[] = [
  { key: "customerName", label: "Customer Name" },
  { key: "customerLocations", label: "Customer Locations" },
  { key: "createdOn", label: "Created On" },
  { key: "lastUpdated", label: "Last Updated" },
];
