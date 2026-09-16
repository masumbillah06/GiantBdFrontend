import type { VariantProduct } from "@/features/products/types/product.types";

const MASTER_PRODUCTS = [
  "test000", "test001", "test002", "test003",
  "AlphaShoe", "BetaBag", "GammaGlove", "DeltaHat",
  "EpsilonJacket", "ZetaBoots",
];

const MATERIALS = [
  "Aluminium + Plastic",
  "Leather + Rubber",
  "Cotton + Polyester",
  "Nylon + Mesh",
  "Steel + Foam",
  "Canvas + Suede",
  "Wool + Acrylic",
  "Silk + Satin",
];

const SIZES = ["36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "S", "M", "L", "XL", "XXL"];

const COLORS = [
  "Silver", "Black", "White", "Red", "Blue",
  "Green", "Yellow", "Brown", "Navy", "Beige",
];

const GENDERS = ["male", "female", "unisex"];
const UOMS = ["pair", "piece", "set", "box", "dozen"];
const CATEGORIES = ["ELECTRONICS", "FOOTWEAR", "APPAREL", "ACCESSORIES", "SPORTS"];

const STATUS_POOL: ("active" | "inactive")[] = [
  "active", "active", "active", "active", "active",
  "active", "active", "active", "inactive", "inactive",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function generateVariantProducts(count: number): VariantProduct[] {
  const rows: VariantProduct[] = [];

  for (let i = 0; i < count; i++) {
    const master   = pick(MASTER_PRODUCTS, i * 3 + 7).toUpperCase();
    const category = pick(CATEGORIES, i * 2 + 1);
    const size     = pick(SIZES, i + 5);
    const color    = pick(COLORS, i + 2);
    const gender   = pick(GENDERS, i);
    const uom      = pick(UOMS, i * 3 + 1);

    rows.push({
      id: i + 1,
      masterProduct: pick(MASTER_PRODUCTS, i * 3 + 7),
      material: pick(MATERIALS, i * 2 + 3),
      sku: `${master}-${category}-${size}-${color.toUpperCase()}-${gender.toUpperCase()}`,
      modelNo: i % 7 === 0 ? "-" : `MDL-${String(i + 100).padStart(4, "0")}`,
      size,
      color,
      gender,
      uom,
      productsPerPacket: (i % 20) + 1,
      status: pick(STATUS_POOL, i * 3 + 1),
    });
  }

  return rows;
}

export const variantProducts: VariantProduct[] = generateVariantProducts(200);

