import type { MasterProduct } from '@/features/products/types/product.types';

// ── seed helpers ────────────────────────────────────────────────────────────
const MASTER_ITEMS = [
  { master: "test000",       material: "Aluminium + Plastic", category: "electronics", subCategory: "laptop" },
  { master: "test001",       material: "Aluminium + Plastic", category: "electronics", subCategory: "smartphone" },
  { master: "test002",       material: "Silicon + Glass",     category: "electronics", subCategory: "tablet" },
  { master: "test003",       material: "Plastic + Copper",    category: "electronics", subCategory: "smartwatch" },
  { master: "AlphaShoe",     material: "Leather + Rubber",    category: "footwear",    subCategory: "sneakers" },
  { master: "BetaBag",       material: "Canvas + Suede",      category: "accessories", subCategory: "backpack" },
  { master: "GammaGlove",    material: "Wool + Acrylic",      category: "apparel",     subCategory: "gloves" },
  { master: "DeltaHat",      material: "Cotton + Polyester",  category: "accessories", subCategory: "cap" },
  { master: "EpsilonJacket", material: "Nylon + Mesh",        category: "apparel",     subCategory: "jacket" },
  { master: "ZetaBoots",     material: "Leather + Rubber",    category: "footwear",    subCategory: "boots" },
  { master: "AeroLap",       material: "Aluminium + Plastic", category: "electronics", subCategory: "laptop" },
  { master: "FlexRunner",    material: "Mesh + Foam",         category: "footwear",    subCategory: "running shoes" },
  { master: "UrbanTee",      material: "Cotton + Polyester",  category: "apparel",     subCategory: "t-shirt" },
  { master: "TitanWatch",    material: "Steel + Glass",       category: "electronics", subCategory: "smartwatch" },
  { master: "CoreHoodie",    material: "Cotton + Fleece",     category: "apparel",     subCategory: "hoodie" },
  { master: "PeakPack",      material: "Nylon + Cordura",     category: "accessories", subCategory: "duffel bag" },
  { master: "PulseBand",     material: "Silicone + Plastic",  category: "sports",     subCategory: "fitness tracker" },
  { master: "VoltAudio",     material: "Aluminium + Plastic", category: "electronics", subCategory: "headphones" },
  { master: "StridePro",     material: "Canvas + Rubber",     category: "footwear",    subCategory: "sandals" },
  { master: "ZenMat",        material: "Rubber + Foam",       category: "sports",      subCategory: "yoga mat" },
];

const LABEL_POOL: MasterProduct['label'][] = [
  "verified", "verified", "verified", "verified",
  "verified", "verified", "warning", "verified",
];

const VARIANT_COUNTS = [10, 6, 8, 12, 16, 4, 14, 20, 18, 24];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

// ── generate 50 rows ────────────────────────────────────────────────────────
function generateMasterProducts(count: number): MasterProduct[] {
  const rows: MasterProduct[] = [];

  for (let i = 0; i < count; i++) {
    const item = pick(MASTER_ITEMS, i);
    // Ensure the first record matches the user's exact example
    const master =
      i === 0
        ? "test000"
        : i < MASTER_ITEMS.length
          ? item.master
          : `${item.master}-${Math.floor(i / MASTER_ITEMS.length)}`;
    const material = i === 0 ? "Aluminium + Plastic" : item.material;
    const category = i === 0 ? "electronics" : item.category;
    const subCategory = i === 0 ? "laptop" : item.subCategory;
    const sku = `${master.toUpperCase()}-${category.toUpperCase()}`;
    const variants = i === 0 ? 10 : pick(VARIANT_COUNTS, i * 3 + 1);
    const label = i === 0 ? "verified" : pick(LABEL_POOL, i * 5 + 2);

    rows.push({
      id: i + 1,
      masterProductName: master,
      masterProduct: master,
      productName: master,
      material,
      sku,
      category,
      subCategory,
      variants,
      label,
    });
  }

  return rows;
}

export const masterProducts: MasterProduct[] = generateMasterProducts(50);
export const masterProductData = masterProducts;
