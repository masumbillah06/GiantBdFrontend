import React from 'react';
import type { SubCategoryRecord } from '@/features/attributes/types/attribute.types';
export type { SubCategoryRecord };
import type { ColumnDef } from '@/components/ui/ReusableTable.types';

export const subCategoryData: SubCategoryRecord[] = [
  {
    id: 1,
    name: "Smartphones",
    category: "Electronics",
    description: "iOS and Android smartphones, parts, and mobile accessories.",
    status: "active",
  },
  {
    id: 2,
    name: "Men's Casual Shirts",
    category: "Clothing & Apparel",
    description: "Cotton casual shirts, formal shirts, and polo t-shirts.",
    status: "active",
  },
  {
    id: 3,
    name: "Cookware Sets",
    category: "Home & Kitchen",
    description: "Non-stick pots, pans, and cooking utensil sets.",
    status: "active",
  },
  {
    id: 4,
    name: "Skincare",
    category: "Beauty & Personal Care",
    description: "Moisturizers, sunscreens, serums, and facial cleansers.",
    status: "active",
  },
  {
    id: 5,
    name: "Running Shoes",
    category: "Sports & Outdoors",
    description: "Lightweight and breathable athletic running footwear.",
    status: "active",
  },
  {
    id: 6,
    name: "Notebooks & Diaries",
    category: "Office Supplies",
    description: "Hardcover and spiral notebooks with ruled and blank pages.",
    status: "active",
  },
];

export const columns: ColumnDef<SubCategoryRecord>[] = [
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span className="font-medium capitalize text-emerald-600">{row.status}</span>
    ),
  },
];
