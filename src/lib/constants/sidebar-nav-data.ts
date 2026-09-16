import type { LucideIcon } from "lucide-react";
import {
  Warehouse,
  Package,
  Users,
  Tags,
  Shield,
  KeyRound,
  UserCircle2,
} from "lucide-react";

export type NavItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavItem[];
};

export const sidebarNav: NavItem[] = [
  {
    label: "Warehouse FG",
    icon: Warehouse,
    children: [
      { label: "Dashboard", href: "/inventory/dashboard" },
      { label: "Stock In", href: "/inventory/stock-in" },
      { label: "Stock Out", href: "/inventory/stock-out" },
      { label: "Stock Out List", href: "/inventory/stock-out-list" },
      { label: "Batch List", href: "/inventory/batch-list" },
      {
        label: "FG Report",
        children: [
          { label: "Weekly Delivery", href: "/inventory/fg-reports/weekly-delivery" },
          { label: "Monthly Delivery", href: "/inventory/fg-reports/monthly-delivery" },
          { label: "Delivery Summary", href: "/inventory/fg-reports/delivery-summary" },
          { label: "Stock Aging", href: "/inventory/fg-reports/stock-aging" },
          { label: "FG Master Stock", href: "/inventory/fg-reports/fg-master-stock" },
          { label: "Location Wise Stock", href: "/inventory/fg-reports/location-wise-stock" },
          { label: "Batch Product List", href: "/inventory/fg-reports/batch-product-list" },
          { label: "FG Current Stock", href: "/inventory/fg-reports/fg-current-stock" },
          { label: "Stock Ledger", href: "/inventory/fg-reports/stock-ledger" },
        ],
      },
    ],
  },
  {
    label: "Products",
    icon: Package,
    children: [
      { label: "Master FG Product", href: "/products/master-fg-product" },
      { label: "Variant FG Product", href: "/products/variant-fg-product" },
    ],
  },
  {
    label: "CRM",
    icon: Users,
    children: [{ label: "Buyer", href: "/crm/buyer" }],
  },
  {
    label: "Attribute",
    icon: Tags,
    children: [
      { label: "Category", href: "/attribute/category" },
      { label: "Sub Category", href: "/attribute/sub-category" },
      { label: "Material", href: "/attribute/material" },
      { label: "Color", href: "/attribute/color" },
      { label: "Warehouse", href: "/attribute/warehouse" },
      { label: "Zone", href: "/attribute/zone" },
      { label: "Sub Zone", href: "/attribute/sub-zone" },
      { label: "Rack", href: "/attribute/rack" },
    ],
  },
  { label: "Role", href: "/role", icon: Shield },
  { label: "Permission", href: "/permission", icon: KeyRound },
  { label: "User", href: "/user", icon: UserCircle2 },
];

