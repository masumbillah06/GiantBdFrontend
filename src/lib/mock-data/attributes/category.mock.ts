import type { CategoryRecord } from '@/features/attributes/types/attribute.types';
export type { CategoryRecord };
import type { ColumnDef } from '@/components/ui/ReusableTable.types';

export const categoryData: CategoryRecord[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Devices, gadgets, components, and electronic accessories.",
  },
  {
    id: 2,
    name: "Clothing & Apparel",
    description: "Men's, women's, and children's fashion wear and accessories.",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    description: "Furniture, appliances, kitchen essentials, and home decor.",
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    description: "Cosmetics, skincare, haircare, and personal hygiene products.",
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    description: "Athletic gear, fitness equipment, and outdoor recreational items.",
  },
  {
    id: 6,
    name: "Office Supplies",
    description: "Stationery, desk organizers, paper products, and writing tools.",
  },
];

export const columns: ColumnDef<CategoryRecord>[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
];
