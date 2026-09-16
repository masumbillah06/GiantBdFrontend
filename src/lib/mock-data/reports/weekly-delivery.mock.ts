// ---------------------------------------------------------------------------
// Weekly Delivery Data — mock dataset
// Seeded directly from reference Week 36 & expanded for multi-week reporting
// ---------------------------------------------------------------------------

export interface DayDelivery {
  dayName: string; // "Sat", "Sun", etc.
  dayNumber: string; // "05", "06", etc.
  quantity: number; // 0 or positive
}

export interface DeliveryItem {
  id: string;
  material: string;
  buyer: string;
  product: string;
  color: string;
  weekId: string; // e.g. "WK-36"
  year: number; // 2026
  dailyQuantities: Record<string, number>; // key: dayNumber e.g. "08": 500
}

export interface WeekInfo {
  id: string; // "WK-36"
  weekNumber: number; // 36
  dateRange: string; // "05-10 Sep"
  year: number; // 2026
  days: { dayName: string; dayNumber: string }[];
}

export const WEEKS_LIST: WeekInfo[] = [
  {
    id: "WK-17",
    weekNumber: 17,
    dateRange: "25-30 Apr",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "25" },
      { dayName: "Sun", dayNumber: "26" },
      { dayName: "Mon", dayNumber: "27" },
      { dayName: "Tue", dayNumber: "28" },
      { dayName: "Wed", dayNumber: "29" },
      { dayName: "Thu", dayNumber: "30" },
    ],
  },
  {
    id: "WK-18",
    weekNumber: 18,
    dateRange: "02-07 May",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "02" },
      { dayName: "Sun", dayNumber: "03" },
      { dayName: "Mon", dayNumber: "04" },
      { dayName: "Tue", dayNumber: "05" },
      { dayName: "Wed", dayNumber: "06" },
      { dayName: "Thu", dayNumber: "07" },
    ],
  },
  {
    id: "WK-19",
    weekNumber: 19,
    dateRange: "09-14 May",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "09" },
      { dayName: "Sun", dayNumber: "10" },
      { dayName: "Mon", dayNumber: "11" },
      { dayName: "Tue", dayNumber: "12" },
      { dayName: "Wed", dayNumber: "13" },
      { dayName: "Thu", dayNumber: "14" },
    ],
  },
  {
    id: "WK-20",
    weekNumber: 20,
    dateRange: "16-21 May",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "16" },
      { dayName: "Sun", dayNumber: "17" },
      { dayName: "Mon", dayNumber: "18" },
      { dayName: "Tue", dayNumber: "19" },
      { dayName: "Wed", dayNumber: "20" },
      { dayName: "Thu", dayNumber: "21" },
    ],
  },
  {
    id: "WK-21",
    weekNumber: 21,
    dateRange: "23-28 May",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "23" },
      { dayName: "Sun", dayNumber: "24" },
      { dayName: "Mon", dayNumber: "25" },
      { dayName: "Tue", dayNumber: "26" },
      { dayName: "Wed", dayNumber: "27" },
      { dayName: "Thu", dayNumber: "28" },
    ],
  },
  {
    id: "WK-22",
    weekNumber: 22,
    dateRange: "30-04 May",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "30" },
      { dayName: "Sun", dayNumber: "31" },
      { dayName: "Mon", dayNumber: "01" },
      { dayName: "Tue", dayNumber: "02" },
      { dayName: "Wed", dayNumber: "03" },
      { dayName: "Thu", dayNumber: "04" },
    ],
  },
  {
    id: "WK-23",
    weekNumber: 23,
    dateRange: "06-11 Jun",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "06" },
      { dayName: "Sun", dayNumber: "07" },
      { dayName: "Mon", dayNumber: "08" },
      { dayName: "Tue", dayNumber: "09" },
      { dayName: "Wed", dayNumber: "10" },
      { dayName: "Thu", dayNumber: "11" },
    ],
  },
  {
    id: "WK-24",
    weekNumber: 24,
    dateRange: "13-18 Jun",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "13" },
      { dayName: "Sun", dayNumber: "14" },
      { dayName: "Mon", dayNumber: "15" },
      { dayName: "Tue", dayNumber: "16" },
      { dayName: "Wed", dayNumber: "17" },
      { dayName: "Thu", dayNumber: "18" },
    ],
  },
  {
    id: "WK-25",
    weekNumber: 25,
    dateRange: "20-25 Jun",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "20" },
      { dayName: "Sun", dayNumber: "21" },
      { dayName: "Mon", dayNumber: "22" },
      { dayName: "Tue", dayNumber: "23" },
      { dayName: "Wed", dayNumber: "24" },
      { dayName: "Thu", dayNumber: "25" },
    ],
  },
  {
    id: "WK-26",
    weekNumber: 26,
    dateRange: "27-02 Jun",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "27" },
      { dayName: "Sun", dayNumber: "28" },
      { dayName: "Mon", dayNumber: "29" },
      { dayName: "Tue", dayNumber: "30" },
      { dayName: "Wed", dayNumber: "01" },
      { dayName: "Thu", dayNumber: "02" },
    ],
  },
  {
    id: "WK-27",
    weekNumber: 27,
    dateRange: "04-09 Jul",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "04" },
      { dayName: "Sun", dayNumber: "05" },
      { dayName: "Mon", dayNumber: "06" },
      { dayName: "Tue", dayNumber: "07" },
      { dayName: "Wed", dayNumber: "08" },
      { dayName: "Thu", dayNumber: "09" },
    ],
  },
  {
    id: "WK-28",
    weekNumber: 28,
    dateRange: "11-16 Jul",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "11" },
      { dayName: "Sun", dayNumber: "12" },
      { dayName: "Mon", dayNumber: "13" },
      { dayName: "Tue", dayNumber: "14" },
      { dayName: "Wed", dayNumber: "15" },
      { dayName: "Thu", dayNumber: "16" },
    ],
  },
  {
    id: "WK-29",
    weekNumber: 29,
    dateRange: "18-23 Jul",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "18" },
      { dayName: "Sun", dayNumber: "19" },
      { dayName: "Mon", dayNumber: "20" },
      { dayName: "Tue", dayNumber: "21" },
      { dayName: "Wed", dayNumber: "22" },
      { dayName: "Thu", dayNumber: "23" },
    ],
  },
  {
    id: "WK-30",
    weekNumber: 30,
    dateRange: "25-30 Jul",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "25" },
      { dayName: "Sun", dayNumber: "26" },
      { dayName: "Mon", dayNumber: "27" },
      { dayName: "Tue", dayNumber: "28" },
      { dayName: "Wed", dayNumber: "29" },
      { dayName: "Thu", dayNumber: "30" },
    ],
  },
  {
    id: "WK-31",
    weekNumber: 31,
    dateRange: "01-06 Aug",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "01" },
      { dayName: "Sun", dayNumber: "02" },
      { dayName: "Mon", dayNumber: "03" },
      { dayName: "Tue", dayNumber: "04" },
      { dayName: "Wed", dayNumber: "05" },
      { dayName: "Thu", dayNumber: "06" },
    ],
  },
  {
    id: "WK-32",
    weekNumber: 32,
    dateRange: "08-13 Aug",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "08" },
      { dayName: "Sun", dayNumber: "09" },
      { dayName: "Mon", dayNumber: "10" },
      { dayName: "Tue", dayNumber: "11" },
      { dayName: "Wed", dayNumber: "12" },
      { dayName: "Thu", dayNumber: "13" },
    ],
  },
  {
    id: "WK-33",
    weekNumber: 33,
    dateRange: "15-20 Aug",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "15" },
      { dayName: "Sun", dayNumber: "16" },
      { dayName: "Mon", dayNumber: "17" },
      { dayName: "Tue", dayNumber: "18" },
      { dayName: "Wed", dayNumber: "19" },
      { dayName: "Thu", dayNumber: "20" },
    ],
  },
  {
    id: "WK-34",
    weekNumber: 34,
    dateRange: "22-27 Aug",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "22" },
      { dayName: "Sun", dayNumber: "23" },
      { dayName: "Mon", dayNumber: "24" },
      { dayName: "Tue", dayNumber: "25" },
      { dayName: "Wed", dayNumber: "26" },
      { dayName: "Thu", dayNumber: "27" },
    ],
  },
  {
    id: "WK-35",
    weekNumber: 35,
    dateRange: "29-03 Aug",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "29" },
      { dayName: "Sun", dayNumber: "30" },
      { dayName: "Mon", dayNumber: "31" },
      { dayName: "Tue", dayNumber: "01" },
      { dayName: "Wed", dayNumber: "02" },
      { dayName: "Thu", dayNumber: "03" },
    ],
  },
  {
    id: "WK-36",
    weekNumber: 36,
    dateRange: "05-10 Sep",
    year: 2026,
    days: [
      { dayName: "Sat", dayNumber: "05" },
      { dayName: "Sun", dayNumber: "06" },
      { dayName: "Mon", dayNumber: "07" },
      { dayName: "Tue", dayNumber: "08" },
      { dayName: "Wed", dayNumber: "09" },
      { dayName: "Thu", dayNumber: "10" },
    ],
  },
];

/**
 * Initial dataset exactly representing the reference screenshot for WK-36,
 * plus representative items for other weeks.
 */
export const DELIVERY_ITEMS: DeliveryItem[] = [
  // ── WK-36 (Screenshot Data) ──
  {
    id: "del-36-1",
    material: "Aluminium + Plastic",
    buyer: "APEX",
    product: "test000",
    color: "Silver",
    weekId: "WK-36",
    year: 2026,
    dailyQuantities: {
      "08": 500,
    },
  },
  {
    id: "del-36-2",
    material: "Poly",
    buyer: "APEX",
    product: "TD Shirt",
    color: "Silver",
    weekId: "WK-36",
    year: 2026,
    dailyQuantities: {
      "08": 19,
    },
  },

  // ── WK-35 Data ──
  {
    id: "del-35-1",
    material: "Aluminium + Plastic",
    buyer: "APEX",
    product: "test000",
    color: "Silver",
    weekId: "WK-35",
    year: 2026,
    dailyQuantities: {
      "31": 350,
      "02": 150,
    },
  },
  {
    id: "del-35-2",
    material: "Poly",
    buyer: "MAF",
    product: "TD Shirt",
    color: "White",
    weekId: "WK-35",
    year: 2026,
    dailyQuantities: {
      "01": 220,
    },
  },
  {
    id: "del-35-3",
    material: "RUBBER",
    buyer: "POU HUNG",
    product: "JOG FLOW-150 Man",
    color: "Black",
    weekId: "WK-35",
    year: 2026,
    dailyQuantities: {
      "29": 100,
      "01": 400,
    },
  },

  // ── WK-34 Data ──
  {
    id: "del-34-1",
    material: "Leather + Rubber",
    buyer: "APEX",
    product: "AlphaShoe",
    color: "Brown",
    weekId: "WK-34",
    year: 2026,
    dailyQuantities: {
      "24": 300,
      "26": 200,
    },
  },
  {
    id: "del-34-2",
    material: "Poly",
    buyer: "Alex Smith",
    product: "TD Shirt",
    color: "Blue",
    weekId: "WK-34",
    year: 2026,
    dailyQuantities: {
      "25": 180,
    },
  },

  // ── WK-33 Data ──
  {
    id: "del-33-1",
    material: "Aluminium + Plastic",
    buyer: "APEX",
    product: "Macbook Pro",
    color: "Silver",
    weekId: "WK-33",
    year: 2026,
    dailyQuantities: {
      "18": 600,
    },
  },
  {
    id: "del-33-2",
    material: "Canvas + Suede",
    buyer: "POU HUNG",
    product: "BetaBag",
    color: "Navy",
    weekId: "WK-33",
    year: 2026,
    dailyQuantities: {
      "16": 120,
      "19": 80,
    },
  },
];

export const FILTER_OPTIONS = {
  products: ["test000", "TD Shirt", "AlphaShoe", "BetaBag", "Macbook Pro", "JOG FLOW-150 Man"],
  materials: ["Aluminium + Plastic", "Poly", "RUBBER", "Leather + Rubber", "Canvas + Suede", "IP", "TPR"],
  buyers: ["APEX", "MAF", "POU HUNG", "Alex Smith", "H&M", "Zara", "Nike"],
  colors: ["Silver", "Black", "White", "Blue", "Brown", "Navy", "Gray", "Red"],
  years: [2026, 2025, 2024],
};

// Flat alias for service consumption
export const weeklyDeliveryData = DELIVERY_ITEMS;
