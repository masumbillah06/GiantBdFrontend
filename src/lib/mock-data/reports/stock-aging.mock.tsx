// ---------------------------------------------------------------------------
// Stock Aging — mock data and helper utilities
// Classifies finished goods inventory into Green (0-30d), Yellow (31-90d), and Red (90+d)
// ---------------------------------------------------------------------------

import type { ColumnDef } from "@/components/ui/tables/ReusableTable.types";

export type AgingTier = "green" | "yellow" | "red";

export interface StockAgingItem {
  id: number;
  productName: string;
  sku: string;
  batchNo: string;
  material: string;
  category: string;
  subCategory: string;
  color: string;
  size: string;
  received: number;
  issued: number;
  blocked: number;
  currentStock: number;
  warehouse: string;
  zone: string;
  subZone: string;
  rack: string;
  ageDays: number;
  tier: AgingTier;
  zoneChangeIn: string;
  status: "Healthy" | "Attention" | "Critical";
  createdAt: string;
}

export const stockAgingColumns: ColumnDef<StockAgingItem>[] = [
  {
    key: "tier",
    label: "Aging Tier",
    render: (row) => {
      if (row.tier === "green") {
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Green (0-30d)
          </span>
        );
      }
      if (row.tier === "yellow") {
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Yellow (31-90d)
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Red (90+d)
        </span>
      );
    },
  },
  {
    key: "productName",
    label: "Product Name",
    cellClassName:
      "whitespace-nowrap px-5 py-2 text-sm font-semibold text-slate-950 group-hover:text-white",
  },
  {
    key: "sku",
    label: "SKU",
    render: (row) => (
      <span className="font-mono text-xs tracking-tight text-slate-600 group-hover:text-slate-100">
        {row.sku}
      </span>
    ),
  },
  {
    key: "batchNo",
    label: "Batch No",
    render: (row) => (
      <span className="inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 font-mono text-xs font-medium text-indigo-700 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white">
        {row.batchNo}
      </span>
    ),
  },
  {
    key: "category",
    label: "Category",
    render: (row) => (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700 group-hover:bg-white/20 group-hover:text-white">
        {row.category}
      </span>
    ),
  },
  {
    key: "material",
    label: "Material",
  },
  {
    key: "color",
    label: "Color",
  },
  {
    key: "size",
    label: "Size",
  },
  {
    key: "currentStock",
    label: "Current Stock",
    headerClassName:
      "whitespace-nowrap border-b border-slate-100 px-5 py-2 text-right text-xs font-bold text-slate-900",
    cellClassName:
      "whitespace-nowrap px-5 py-2 text-right text-sm font-bold text-slate-950 group-hover:text-white tabular-nums",
    render: (row) => row.currentStock.toLocaleString(),
  },
  {
    key: "received",
    label: "Received",
    headerClassName:
      "whitespace-nowrap border-b border-slate-100 px-5 py-2 text-right text-xs font-bold text-slate-900",
    cellClassName:
      "whitespace-nowrap px-5 py-2 text-right text-sm text-slate-700 group-hover:text-white tabular-nums",
    render: (row) => row.received.toLocaleString(),
  },
  {
    key: "issued",
    label: "Issued",
    headerClassName:
      "whitespace-nowrap border-b border-slate-100 px-5 py-2 text-right text-xs font-bold text-slate-900",
    cellClassName:
      "whitespace-nowrap px-5 py-2 text-right text-sm text-slate-700 group-hover:text-white tabular-nums",
    render: (row) => row.issued.toLocaleString(),
  },
  {
    key: "blocked",
    label: "Blocked",
    headerClassName:
      "whitespace-nowrap border-b border-slate-100 px-5 py-2 text-right text-xs font-bold text-slate-900",
    cellClassName:
      "whitespace-nowrap px-5 py-2 text-right text-sm text-slate-950 group-hover:text-white tabular-nums",
    render: (row) =>
      row.blocked > 0 ? (
        <span className="inline-block rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 group-hover:bg-amber-400 group-hover:text-slate-950">
          {row.blocked.toLocaleString()}
        </span>
      ) : (
        <span className="text-slate-400">0</span>
      ),
  },
  {
    key: "ageDays",
    label: "Age in Stock",
    render: (row) => {
      const tierColor =
        row.tier === "green"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : row.tier === "yellow"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-rose-50 text-rose-700 border-rose-200";

      return (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${tierColor} group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white`}
        >
          {row.ageDays} Days
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      if (row.status === "Healthy") {
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 group-hover:bg-white/20 group-hover:text-white">
            Healthy
          </span>
        );
      }
      if (row.status === "Attention") {
        return (
          <span className="inline-flex items-center rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 group-hover:bg-white/20 group-hover:text-white">
            Attention
          </span>
        );
      }
      return (
        <span className="inline-flex items-center rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 group-hover:bg-white/20 group-hover:text-white">
          Critical Risk
        </span>
      );
    },
  },
  {
    key: "warehouse",
    label: "Warehouse",
  },
  {
    key: "zone",
    label: "Zone",
  },
  {
    key: "rack",
    label: "Rack",
  },
  {
    key: "zoneChangeIn",
    label: "Zone Change In",
  },
  {
    key: "createdAt",
    label: "Created At",
  },
];

export const stockAgingData: StockAgingItem[] = [
  // ── GREEN TIER (0 - 30 Days) ──────────────────────────────────────────────
  {
    id: 301,
    productName: "TD Shirt 37 Silver lady",
    sku: "TD-SHIRT-CLOTH-37-SILVER-LADY",
    batchNo: "B20260908-00041",
    material: "Poly",
    category: "cloth",
    subCategory: "shirt",
    color: "Silver",
    size: "37",
    received: 200,
    issued: 30,
    blocked: 10,
    currentStock: 160,
    warehouse: "Mirpur2",
    zone: "Mirpur 1",
    subZone: "Solimuddin Market",
    rack: "Rack_1",
    ageDays: 1,
    tier: "green",
    zoneChangeIn: "180 Days",
    status: "Healthy",
    createdAt: "08-09-2026",
  },
  {
    id: 302,
    productName: "TD Shirt 36 Silver lady",
    sku: "TD-SHIRT-CLOTH-36-SILVER-LADY",
    batchNo: "B20260908-00041",
    material: "Poly",
    category: "cloth",
    subCategory: "shirt",
    color: "Silver",
    size: "36",
    received: 150,
    issued: 40,
    blocked: 0,
    currentStock: 110,
    warehouse: "Gazipur",
    zone: "Tongi Zone",
    subZone: "College Gate",
    rack: "Rack 1",
    ageDays: 1,
    tier: "green",
    zoneChangeIn: "180 Days",
    status: "Healthy",
    createdAt: "08-09-2026",
  },
  {
    id: 303,
    productName: "TD Shirt 40 Silver lady",
    sku: "TD-SHIRT-CLOTH-40-SILVER-LADY",
    batchNo: "B20260908-00040",
    material: "Poly",
    category: "cloth",
    subCategory: "shirt",
    color: "Silver",
    size: "40",
    received: 500,
    issued: 120,
    blocked: 30,
    currentStock: 350,
    warehouse: "WarehouseFG",
    zone: "Zone1",
    subZone: "SubZone1",
    rack: "Rack1",
    ageDays: 3,
    tier: "green",
    zoneChangeIn: "178 Days",
    status: "Healthy",
    createdAt: "06-09-2026",
  },
  {
    id: 304,
    productName: "test000 48 Silver male",
    sku: "TEST000-ELECTRONICS-48-SILVER-MALE",
    batchNo: "B20260902-00039",
    material: "Aluminium + Plastic",
    category: "electronics",
    subCategory: "laptop",
    color: "Silver",
    size: "48",
    received: 10000,
    issued: 1200,
    blocked: 0,
    currentStock: 8800,
    warehouse: "WarehouseFG",
    zone: "Zone1",
    subZone: "SubZone1",
    rack: "Rack2",
    ageDays: 7,
    tier: "green",
    zoneChangeIn: "174 Days",
    status: "Healthy",
    createdAt: "02-09-2026",
  },
  {
    id: 305,
    productName: "TD Shirt 42 Silver lady",
    sku: "TD-SHIRT-CLOTH-42-SILVER-LADY",
    batchNo: "B20260901-00038",
    material: "Poly",
    category: "cloth",
    subCategory: "shirt",
    color: "Silver",
    size: "42",
    received: 350,
    issued: 100,
    blocked: 15,
    currentStock: 235,
    warehouse: "Mirpur2",
    zone: "Mirpur 1",
    subZone: "Solimuddin Market",
    rack: "Rack_1",
    ageDays: 8,
    tier: "green",
    zoneChangeIn: "173 Days",
    status: "Healthy",
    createdAt: "01-09-2026",
  },
  {
    id: 306,
    productName: "AlphaShoe 42 Black male",
    sku: "ALPHASHOE-FOOTWEAR-42-BLACK-MALE",
    batchNo: "B20260825-00037",
    material: "Leather + Rubber",
    category: "footwear",
    subCategory: "sneaker",
    color: "Black",
    size: "42",
    received: 1200,
    issued: 450,
    blocked: 50,
    currentStock: 700,
    warehouse: "WarehouseFG",
    zone: "Zone1",
    subZone: "SubZone2",
    rack: "Rack 3",
    ageDays: 15,
    tier: "green",
    zoneChangeIn: "166 Days",
    status: "Healthy",
    createdAt: "25-08-2026",
  },
  {
    id: 307,
    productName: "BetaBag 38 Navy unisex",
    sku: "BETABAG-ACCESSORIES-38-NAVY-UNISEX",
    batchNo: "B20260818-00036",
    material: "Canvas + Suede",
    category: "accessories",
    subCategory: "backpack",
    color: "Navy",
    size: "38",
    received: 800,
    issued: 350,
    blocked: 20,
    currentStock: 430,
    warehouse: "Gazipur",
    zone: "Tongi Zone",
    subZone: "College Gate",
    rack: "Rack 2",
    ageDays: 22,
    tier: "green",
    zoneChangeIn: "159 Days",
    status: "Healthy",
    createdAt: "18-08-2026",
  },
  {
    id: 308,
    productName: "GammaGlove 36 White female",
    sku: "GAMMAGLOVE-APPAREL-36-WHITE-FEMALE",
    batchNo: "B20260812-00035",
    material: "Cotton + Polyester",
    category: "apparel",
    subCategory: "gloves",
    color: "White",
    size: "36",
    received: 600,
    issued: 200,
    blocked: 0,
    currentStock: 400,
    warehouse: "Mirpur2",
    zone: "Mirpur 1",
    subZone: "Solimuddin Market",
    rack: "Rack_2",
    ageDays: 28,
    tier: "green",
    zoneChangeIn: "153 Days",
    status: "Healthy",
    createdAt: "12-08-2026",
  },

  // ── YELLOW TIER (31 - 90 Days) ────────────────────────────────────────────
  {
    id: 309,
    productName: "DeltaHat 40 Red unisex",
    sku: "DELTAHAT-ACCESSORIES-40-RED-UNISEX",
    batchNo: "B20260805-00034",
    material: "Cotton + Polyester",
    category: "accessories",
    subCategory: "cap",
    color: "Red",
    size: "40",
    received: 1500,
    issued: 800,
    blocked: 120,
    currentStock: 580,
    warehouse: "WarehouseFG",
    zone: "Zone1",
    subZone: "SubZone1",
    rack: "Rack 4",
    ageDays: 35,
    tier: "yellow",
    zoneChangeIn: "146 Days",
    status: "Attention",
    createdAt: "05-08-2026",
  },
  {
    id: 310,
    productName: "EpsilonJacket 44 Blue male",
    sku: "EPSILONJACKET-APPAREL-44-BLUE-MALE",
    batchNo: "B20260728-00033",
    material: "Nylon + Mesh",
    category: "apparel",
    subCategory: "jacket",
    color: "Blue",
    size: "44",
    received: 900,
    issued: 400,
    blocked: 90,
    currentStock: 410,
    warehouse: "Gazipur",
    zone: "Tongi Zone",
    subZone: "College Gate",
    rack: "Rack 1",
    ageDays: 43,
    tier: "yellow",
    zoneChangeIn: "138 Days",
    status: "Attention",
    createdAt: "28-07-2026",
  },
  {
    id: 311,
    productName: "ZetaBoots 46 Brown male",
    sku: "ZETABOOTS-FOOTWEAR-46-BROWN-MALE",
    batchNo: "B20260715-00032",
    material: "Leather + Rubber",
    category: "footwear",
    subCategory: "boots",
    color: "Brown",
    size: "46",
    received: 1100,
    issued: 550,
    blocked: 150,
    currentStock: 400,
    warehouse: "WarehouseFG",
    zone: "Zone2",
    subZone: "SubZone3",
    rack: "Rack 2",
    ageDays: 56,
    tier: "yellow",
    zoneChangeIn: "125 Days",
    status: "Attention",
    createdAt: "15-07-2026",
  },
  {
    id: 312,
    productName: "TD Shirt 44 Green male",
    sku: "TD-SHIRT-CLOTH-44-GREEN-MALE",
    batchNo: "B20260705-00031",
    material: "Poly",
    category: "cloth",
    subCategory: "shirt",
    color: "Green",
    size: "44",
    received: 800,
    issued: 300,
    blocked: 80,
    currentStock: 420,
    warehouse: "Mirpur2",
    zone: "Mirpur 1",
    subZone: "Solimuddin Market",
    rack: "Rack_1",
    ageDays: 66,
    tier: "yellow",
    zoneChangeIn: "115 Days",
    status: "Attention",
    createdAt: "05-07-2026",
  },
  {
    id: 313,
    productName: "test001 40 Silver female",
    sku: "TEST001-ELECTRONICS-40-SILVER-FEMALE",
    batchNo: "B20260625-00030",
    material: "Aluminium + Plastic",
    category: "electronics",
    subCategory: "tablet",
    color: "Silver",
    size: "40",
    received: 3000,
    issued: 1400,
    blocked: 350,
    currentStock: 1250,
    warehouse: "WarehouseFG",
    zone: "Zone1",
    subZone: "SubZone2",
    rack: "Rack 1",
    ageDays: 76,
    tier: "yellow",
    zoneChangeIn: "105 Days",
    status: "Attention",
    createdAt: "25-06-2026",
  },
  {
    id: 314,
    productName: "AlphaPolo 38 Yellow unisex",
    sku: "ALPHAPOLO-APPAREL-38-YELLOW-UNISEX",
    batchNo: "B20260615-00029",
    material: "Cotton + Polyester",
    category: "apparel",
    subCategory: "polo",
    color: "Yellow",
    size: "38",
    received: 1200,
    issued: 600,
    blocked: 200,
    currentStock: 400,
    warehouse: "Gazipur",
    zone: "Tongi Zone",
    subZone: "College Gate",
    rack: "Rack 3",
    ageDays: 86,
    tier: "yellow",
    zoneChangeIn: "95 Days",
    status: "Attention",
    createdAt: "15-06-2026",
  },

  // ── RED TIER (90+ Days) ───────────────────────────────────────────────────
  {
    id: 315,
    productName: "WinterCoat 48 Beige unisex",
    sku: "WINTERCOAT-APPAREL-48-BEIGE-UNISEX",
    batchNo: "B20260520-00028",
    material: "Wool + Acrylic",
    category: "apparel",
    subCategory: "coat",
    color: "Beige",
    size: "48",
    received: 1400,
    issued: 600,
    blocked: 450,
    currentStock: 350,
    warehouse: "WarehouseFG",
    zone: "Zone2",
    subZone: "SubZone1",
    rack: "Rack 5",
    ageDays: 112,
    tier: "red",
    zoneChangeIn: "69 Days",
    status: "Critical",
    createdAt: "20-05-2026",
  },
  {
    id: 316,
    productName: "HeavyBoot 44 Black male",
    sku: "HEAVYBOOT-FOOTWEAR-44-BLACK-MALE",
    batchNo: "B20260505-00027",
    material: "Leather + Rubber",
    category: "footwear",
    subCategory: "boots",
    color: "Black",
    size: "44",
    received: 950,
    issued: 300,
    blocked: 380,
    currentStock: 270,
    warehouse: "Mirpur2",
    zone: "Mirpur 1",
    subZone: "Solimuddin Market",
    rack: "Rack_3",
    ageDays: 127,
    tier: "red",
    zoneChangeIn: "54 Days",
    status: "Critical",
    createdAt: "05-05-2026",
  },
  {
    id: 317,
    productName: "SportCap 36 White unisex",
    sku: "SPORTCAP-ACCESSORIES-36-WHITE-UNISEX",
    batchNo: "B20260418-00026",
    material: "Canvas + Suede",
    category: "accessories",
    subCategory: "cap",
    color: "White",
    size: "36",
    received: 2000,
    issued: 900,
    blocked: 700,
    currentStock: 400,
    warehouse: "Gazipur",
    zone: "Tongi Zone",
    subZone: "College Gate",
    rack: "Rack 4",
    ageDays: 144,
    tier: "red",
    zoneChangeIn: "37 Days",
    status: "Critical",
    createdAt: "18-04-2026",
  },
  {
    id: 318,
    productName: "test002 46 Silver male",
    sku: "TEST002-ELECTRONICS-46-SILVER-MALE",
    batchNo: "B20260330-00025",
    material: "Aluminium + Plastic",
    category: "electronics",
    subCategory: "phone",
    color: "Silver",
    size: "46",
    received: 5000,
    issued: 1800,
    blocked: 2100,
    currentStock: 1100,
    warehouse: "WarehouseFG",
    zone: "Zone1",
    subZone: "SubZone3",
    rack: "Rack 2",
    ageDays: 163,
    tier: "red",
    zoneChangeIn: "18 Days",
    status: "Critical",
    createdAt: "30-03-2026",
  },
  {
    id: 319,
    productName: "VintageScarf 38 Red female",
    sku: "VINTAGESCARF-ACCESSORIES-38-RED-FEMALE",
    batchNo: "B20260310-00024",
    material: "Silk + Satin",
    category: "accessories",
    subCategory: "scarf",
    color: "Red",
    size: "38",
    received: 1000,
    issued: 250,
    blocked: 550,
    currentStock: 200,
    warehouse: "Mirpur2",
    zone: "Mirpur 1",
    subZone: "Solimuddin Market",
    rack: "Rack_2",
    ageDays: 183,
    tier: "red",
    zoneChangeIn: "0 Days",
    status: "Critical",
    createdAt: "10-03-2026",
  },
  {
    id: 320,
    productName: "RetroJacket 42 Brown male",
    sku: "RETROJACKET-APPAREL-42-BROWN-MALE",
    batchNo: "B20260215-00023",
    material: "Leather + Rubber",
    category: "apparel",
    subCategory: "jacket",
    color: "Brown",
    size: "42",
    received: 1200,
    issued: 300,
    blocked: 700,
    currentStock: 200,
    warehouse: "Gazipur",
    zone: "Tongi Zone",
    subZone: "College Gate",
    rack: "Rack 2",
    ageDays: 206,
    tier: "red",
    zoneChangeIn: "0 Days",
    status: "Critical",
    createdAt: "15-02-2026",
  },
];

export const greenStockData = stockAgingData.filter((i) => i.tier === "green");
export const yellowStockData = stockAgingData.filter((i) => i.tier === "yellow");
export const redStockData = stockAgingData.filter((i) => i.tier === "red");

export function getStockAgingSummary() {
  const totalItems = stockAgingData.length;
  const totalStock = stockAgingData.reduce((acc, curr) => acc + curr.currentStock, 0);
  const totalBlocked = stockAgingData.reduce((acc, curr) => acc + curr.blocked, 0);

  const greenItems = greenStockData.length;
  const greenStock = greenStockData.reduce((acc, curr) => acc + curr.currentStock, 0);

  const yellowItems = yellowStockData.length;
  const yellowStock = yellowStockData.reduce((acc, curr) => acc + curr.currentStock, 0);

  const redItems = redStockData.length;
  const redStock = redStockData.reduce((acc, curr) => acc + curr.currentStock, 0);

  return {
    totalItems,
    totalStock,
    totalBlocked,
    green: {
      count: greenItems,
      stock: greenStock,
      avgDays: "10.4 Days",
      percentage: Math.round((greenStock / totalStock) * 100),
    },
    yellow: {
      count: yellowItems,
      stock: yellowStock,
      avgDays: "57.0 Days",
      percentage: Math.round((yellowStock / totalStock) * 100),
    },
    red: {
      count: redItems,
      stock: redStock,
      avgDays: "155.8 Days",
      percentage: Math.round((redStock / totalStock) * 100),
    },
  };
}

