// ---------------------------------------------------------------------------
// Monthly Delivery Data — mock dataset
// Seeded directly from reference September 2026 & expanded for all 12 months
// ---------------------------------------------------------------------------

export interface MonthInfo {
  id: string; // "09"
  name: string; // "September"
  monthNumber: number; // 9
  numberString: string; // "09"
  daysCount: number; // 30
  year: number; // 2026
}

export interface MonthlyDeliveryItem {
  id: string;
  material: string;
  factory: string; // or Buyer
  item: string; // or Product
  color: string;
  monthId: string; // e.g. "09"
  year: number; // 2026
  dailyQuantities: Record<string, number>; // key: day number e.g. "01": 166, "08": 500
}

export const MONTHS_LIST: MonthInfo[] = [
  { id: "01", name: "January", monthNumber: 1, numberString: "01", daysCount: 31, year: 2026 },
  { id: "02", name: "February", monthNumber: 2, numberString: "02", daysCount: 28, year: 2026 },
  { id: "03", name: "March", monthNumber: 3, numberString: "03", daysCount: 31, year: 2026 },
  { id: "04", name: "April", monthNumber: 4, numberString: "04", daysCount: 30, year: 2026 },
  { id: "05", name: "May", monthNumber: 5, numberString: "05", daysCount: 31, year: 2026 },
  { id: "06", name: "June", monthNumber: 6, numberString: "06", daysCount: 30, year: 2026 },
  { id: "07", name: "July", monthNumber: 7, numberString: "07", daysCount: 31, year: 2026 },
  { id: "08", name: "August", monthNumber: 8, numberString: "08", daysCount: 31, year: 2026 },
  { id: "09", name: "September", monthNumber: 9, numberString: "09", daysCount: 30, year: 2026 },
  { id: "10", name: "October", monthNumber: 10, numberString: "10", daysCount: 31, year: 2026 },
  { id: "11", name: "November", monthNumber: 11, numberString: "11", daysCount: 30, year: 2026 },
  { id: "12", name: "December", monthNumber: 12, numberString: "12", daysCount: 31, year: 2026 },
];

/**
 * Exact items matching the reference screenshot for September 2026 (Month 09),
 * plus representative records for other months.
 */
export const MONTHLY_DELIVERY_ITEMS: MonthlyDeliveryItem[] = [
  // ── September 2026 (Screenshot Data) ──
  // 1. IP -> POU HUNG -> tedt -> FIRE BLACK -> Day 01: 166
  {
    id: "mdel-sep-1",
    material: "IP",
    factory: "POU HUNG",
    item: "tedt",
    color: "FIRE BLACK",
    monthId: "09",
    year: 2026,
    dailyQuantities: {
      "01": 166,
    },
  },

  // 2. Aluminium + Plastic -> APEX -> test000 -> Silver -> Day 08: 500
  {
    id: "mdel-sep-2",
    material: "Aluminium + Plastic",
    factory: "APEX",
    item: "test000",
    color: "Silver",
    monthId: "09",
    year: 2026,
    dailyQuantities: {
      "08": 500,
    },
  },

  // 3. Poly -> Alex Smith -> TD Shirt -> Silver -> Day 01: 45
  {
    id: "mdel-sep-3",
    material: "Poly",
    factory: "Alex Smith",
    item: "TD Shirt",
    color: "Silver",
    monthId: "09",
    year: 2026,
    dailyQuantities: {
      "01": 45,
    },
  },

  // 4. Poly -> APEX -> TD Shirt -> Silver -> Day 08: 19
  {
    id: "mdel-sep-4",
    material: "Poly",
    factory: "APEX",
    item: "TD Shirt",
    color: "Silver",
    monthId: "09",
    year: 2026,
    dailyQuantities: {
      "08": 19,
    },
  },

  // 5. Poly -> POU HUNG -> TD Shirt -> Silver -> Day 01: 5
  {
    id: "mdel-sep-5",
    material: "Poly",
    factory: "POU HUNG",
    item: "TD Shirt",
    color: "Silver",
    monthId: "09",
    year: 2026,
    dailyQuantities: {
      "01": 5,
    },
  },

  // ── August 2026 Data ──
  {
    id: "mdel-aug-1",
    material: "Aluminium + Plastic",
    factory: "APEX",
    item: "Macbook Pro",
    color: "Silver",
    monthId: "08",
    year: 2026,
    dailyQuantities: {
      "15": 250,
      "22": 320,
    },
  },
  {
    id: "mdel-aug-2",
    material: "RUBBER",
    factory: "POU HUNG",
    item: "JOG FLOW-150 Man",
    color: "Black",
    monthId: "08",
    year: 2026,
    dailyQuantities: {
      "10": 180,
      "20": 420,
    },
  },
  {
    id: "mdel-aug-3",
    material: "Poly",
    factory: "MAF",
    item: "TD Shirt",
    color: "White",
    monthId: "08",
    year: 2026,
    dailyQuantities: {
      "05": 300,
    },
  },

  // ── July 2026 Data ──
  {
    id: "mdel-jul-1",
    material: "Leather + Rubber",
    factory: "APEX",
    item: "AlphaShoe",
    color: "Brown",
    monthId: "07",
    year: 2026,
    dailyQuantities: {
      "12": 450,
    },
  },
  {
    id: "mdel-jul-2",
    material: "IP",
    factory: "POU HUNG",
    item: "CUSHION-500",
    color: "Black",
    monthId: "07",
    year: 2026,
    dailyQuantities: {
      "28": 1000,
    },
  },
];

export const MONTHLY_FILTER_OPTIONS = {
  products: ["tedt", "test000", "TD Shirt", "Macbook Pro", "JOG FLOW-150 Man", "AlphaShoe", "CUSHION-500"],
  materials: ["IP", "Aluminium + Plastic", "Poly", "RUBBER", "Leather + Rubber", "Canvas + Suede", "TPR"],
  buyers: ["POU HUNG", "APEX", "Alex Smith", "MAF", "H&M", "Zara", "Nike"],
  colors: ["FIRE BLACK", "Silver", "Black", "White", "Blue", "Brown", "Navy"],
  years: [2026, 2025, 2024],
};

// Flat alias for service consumption
export const monthlyDeliveryData = MONTHLY_DELIVERY_ITEMS;
