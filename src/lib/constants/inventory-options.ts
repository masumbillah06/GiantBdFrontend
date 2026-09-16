/**
 * Shared constants and option lists for inventory operations (stock-in, stock-out, etc.)
 */

export interface MasterProductOption {
  value: string;
  label: string;
  material?: string;
  model?: string;
}

export const MASTER_PRODUCT_OPTIONS: MasterProductOption[] = [
  { value: "AlphaShoe", label: "AlphaShoe", material: "Leather + Rubber", model: "MOD-ALP" },
  { value: "BetaBag", label: "BetaBag", material: "Canvas + Suede", model: "MOD-BET" },
  { value: "GammaGlove", label: "GammaGlove", material: "Wool + Acrylic", model: "MOD-GAM" },
  { value: "DeltaHat", label: "DeltaHat", material: "Cotton + Polyester", model: "MOD-DEL" },
  { value: "EpsilonJacket", label: "EpsilonJacket", material: "Nylon + Mesh", model: "MOD-EPS" },
  { value: "ZetaBoots", label: "ZetaBoots", material: "Leather + Rubber", model: "MOD-ZET" },
  { value: "test000", label: "test000", material: "Aluminium + Plastic", model: "MOD-T00" },
  { value: "test001", label: "test001", material: "Aluminium + Plastic", model: "MOD-T01" },
  { value: "test002", label: "test002", material: "Silicon + Glass", model: "MOD-T02" },
  { value: "test003", label: "test003", material: "Plastic + Copper", model: "MOD-T03" },
];

export const DEFAULT_MASTER_OPTIONS = MASTER_PRODUCT_OPTIONS;

export const DEFAULT_SIZES = ["36", "38", "40", "42", "44", "46", "48"];

export const DEFAULT_COLOR_OPTIONS = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Silver",
  "Navy",
  "Gray",
  "Brown",
  "Green",
  "Yellow",
];

export const COLOR_OPTIONS = DEFAULT_COLOR_OPTIONS;

export const DEFAULT_GENDER_OPTIONS = ["Men", "Women", "Unisex", "Kids"];

export const GENDER_OPTIONS = DEFAULT_GENDER_OPTIONS;

export const DEFAULT_BUYERS = [
  "H&M",
  "Zara",
  "Walmart",
  "Target",
  "Marks & Spencer",
  "Nike",
  "Adidas",
];

export const DEFAULT_LCS = [
  "LC-2026-001",
  "LC-2026-002",
  "LC-2026-003",
  "LC-2026-004",
];

export const DEFAULT_POS_MAP: Record<string, string[]> = {
  "LC-2026-001": ["PO-88310", "PO-88311"],
  "LC-2026-002": ["PO-88320", "PO-88321"],
  "LC-2026-003": ["PO-88330"],
  "LC-2026-004": ["PO-88340"],
};

export const DEFAULT_LOCATIONS = [
  "Warehouse North (Dhaka)",
  "Central Hub (Chittagong)",
  "Export Dock 3 (Gazipur)",
  "Retail Outlet Dhaka-1",
  "Client Distribution Center",
];

