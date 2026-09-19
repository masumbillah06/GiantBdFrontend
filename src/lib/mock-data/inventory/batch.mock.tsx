// ---------------------------------------------------------------------------
// Batch List — mock data & column definitions
// Exact columns matching:
// - Batch Identifier
// - Color & Gender
// - Material
// - In-Hand / Received
// - Cartons
// - Age / Production Date
// ---------------------------------------------------------------------------

import React from "react";
import type { BatchItem } from "@/features/inventory/types/inventory.types";
import type { ColumnDef } from "@/components/ui/table/ReusableTable.types";

function getColorDot(colorName?: string, hexCode?: string): string {
  if (hexCode && hexCode.startsWith("#")) return hexCode;
  const lower = (colorName || "").toLowerCase();
  if (lower.includes("black")) return "#0f172a";
  if (lower.includes("white")) return "#f8fafc";
  if (lower.includes("navy")) return "#1e3a8a";
  if (lower.includes("blue")) return "#2563eb";
  if (lower.includes("red")) return "#dc2626";
  if (lower.includes("gray") || lower.includes("grey") || lower.includes("silver")) return "#94a3b8";
  if (lower.includes("green")) return "#16a34a";
  if (lower.includes("yellow")) return "#eab308";
  if (lower.includes("brown")) return "#92400e";
  if (lower.includes("orange")) return "#ea580c";
  if (lower.includes("pink")) return "#ec4899";
  if (lower.includes("purple")) return "#9333ea";
  return "#64748b";
}

function calculateAgeInDays(dateStr?: string): number | null {
  if (!dateStr || dateStr === "N/A") return null;
  let d: Date;
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    d = new Date(`${yyyy}-${mm}-${dd}`);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [mm, dd, yyyy] = dateStr.split("/");
    d = new Date(`${yyyy}-${mm}-${dd}`);
  } else {
    d = new Date(dateStr);
  }
  if (isNaN(d.getTime())) return null;
  const diffTime = Date.now() - d.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

export const batchColumns: ColumnDef<BatchItem>[] = [
  // 1. Batch Identifier
  {
    key: "batchId",
    label: "Batch Identifier",
    cellClassName: "whitespace-nowrap px-5 py-3 text-sm font-medium",
    render: (row) => {
      const displayId = row.batchId || `B-${String(row.id).padStart(5, "0")}`;
      const hasBatchNumber = Boolean(row.batchNumber && row.batchNumber !== row.batchId);

      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-slate-900 group-hover:text-white transition-colors">
              {displayId}
            </span>
            {hasBatchNumber && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 group-hover:bg-white/20 text-slate-600 group-hover:text-white font-medium border border-slate-200 group-hover:border-white/20">
                #{row.batchNumber}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-600 group-hover:text-slate-200 truncate max-w-[220px]">
            {row.productName} {row.sku ? `(${row.sku})` : ""}
          </span>
          {row.locationCode && (
            <span className="text-[11px] text-slate-400 group-hover:text-slate-300">
              Rack: {row.locationCode}
            </span>
          )}
        </div>
      );
    },
  },

  // 2. Color & Gender
  {
    key: "color",
    label: "Color & Gender",
    cellClassName: "whitespace-nowrap px-5 py-3 text-sm",
    render: (row) => {
      const color =
        row.color ||
        (row.id
          ? Number(row.id) % 4 === 0
            ? "Navy"
            : Number(row.id) % 3 === 0
            ? "Blue"
            : Number(row.id) % 2 === 0
            ? "Black"
            : "White"
          : "Standard");

      const gender = (
        row.gender ||
        (row.id
          ? Number(row.id) % 3 === 0
            ? "LADY"
            : Number(row.id) % 2 === 0
            ? "MALE"
            : "UNISEX"
          : "MALE")
      ).toUpperCase();

      const colorDot = getColorDot(color, row.colorCode);
      const isLady = gender.includes("LADY") || gender.includes("WOMEN") || gender.includes("FEMALE");
      const isKids = gender.includes("KID") || gender.includes("JUNIOR");

      const genderBadgeClass = isLady
        ? "bg-pink-50 text-pink-700 border-pink-200 group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500"
        : isKids
        ? "bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500"
        : "bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500";

      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border border-black/15 shrink-0 shadow-2xs"
              style={{ backgroundColor: colorDot }}
            />
            <span className="text-xs font-semibold text-slate-800 group-hover:text-white">
              {color}
            </span>
          </div>
          <span
            className={`inline-flex items-center w-fit px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${genderBadgeClass}`}
          >
            {gender}
          </span>
        </div>
      );
    },
  },

  // 3. Material
  {
    key: "material",
    label: "Material",
    cellClassName: "whitespace-nowrap px-5 py-3 text-sm",
    render: (row) => {
      const material = row.material || "Standard";
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-white/20 text-slate-800 group-hover:text-white text-xs font-medium border border-slate-200/80 group-hover:border-white/30 transition-colors">
          {material}
        </span>
      );
    },
  },

  // 4. In-Hand / Received
  {
    key: "quantity",
    label: "In-Hand / Received",
    cellClassName: "whitespace-nowrap px-5 py-3 text-sm",
    render: (row) => {
      const received = row.receivedQty ?? row.quantity ?? 0;
      const inHand =
        row.inHandQty ??
        (row.id
          ? Math.round(
              received *
                (Number(row.id) % 5 === 0 ? 0.4 : Number(row.id) % 2 === 0 ? 0.8 : 1)
            )
          : received);
      const ratio = received > 0 ? Math.min(100, Math.round((inHand / received) * 100)) : 0;
      const isOutOfStock = inHand <= 0 && received > 0;

      return (
        <div className="flex flex-col gap-1 min-w-[130px]">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-bold text-sm group-hover:text-white ${
                isOutOfStock ? "text-red-600" : "text-slate-900"
              }`}
            >
              {inHand.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 group-hover:text-slate-300">
              / {received.toLocaleString()} pcs
            </span>
          </div>

          {/* Mini stock availability ratio bar */}
          <div className="w-full bg-slate-100 group-hover:bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isOutOfStock
                  ? "bg-red-500"
                  : ratio < 50
                  ? "bg-amber-500"
                  : "bg-emerald-500 group-hover:bg-white"
              }`}
              style={{ width: `${ratio}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 group-hover:text-slate-300">
            <span>{isOutOfStock ? "Depleted" : `${ratio}% in hand`}</span>
            {row.createdBy && <span>By {row.createdBy}</span>}
          </div>
        </div>
      );
    },
  },

  // 5. Cartons
  {
    key: "pkgQty",
    label: "Cartons",
    cellClassName: "whitespace-nowrap px-5 py-3 text-sm",
    render: (row) => {
      const cartons =
        row.cartons ?? row.pkgQty ?? Math.max(1, Math.ceil((row.quantity || 1) / 10));
      const itemsPerPacket =
        row.itemsPerPacket || Math.round((row.quantity || cartons * 10) / cartons) || 10;

      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 group-hover:text-white text-sm">
              {cartons.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 group-hover:text-slate-200">
              Cartons
            </span>
          </div>
          <span className="text-[11px] text-slate-400 group-hover:text-slate-300">
            ~{itemsPerPacket} pcs / ctn
          </span>
        </div>
      );
    },
  },

  // 6. Age / Production Date
  {
    key: "productionDate",
    label: "Age / Production Date",
    cellClassName: "whitespace-nowrap px-5 py-3 text-sm",
    render: (row) => {
      const age =
        row.ageInDays !== undefined && row.ageInDays !== null
          ? row.ageInDays
          : calculateAgeInDays(row.productionDate);

      let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      let dotColor = "bg-emerald-500";
      let label = `${age ?? 0} days`;

      if (age === null || age === undefined) {
        badgeClass = "bg-slate-50 text-slate-600 border-slate-200";
        dotColor = "bg-slate-400";
        label = "N/A";
      } else if (age === 0) {
        label = "Fresh (Today)";
      } else if (age < 30) {
        label = `${age}d (Fresh)`;
      } else if (age < 90) {
        badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
        dotColor = "bg-amber-500";
        label = `${Math.floor(age / 30)}mo (${age}d)`;
      } else {
        badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
        dotColor = "bg-rose-500";
        label = `${Math.floor(age / 30)}mo (${age}d)`;
      }

      return (
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-md text-xs font-semibold border transition-colors group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white ${badgeClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor} group-hover:bg-white`} />
            {label}
          </span>
          <span className="text-[11px] text-slate-400 group-hover:text-slate-300">
            Prod: {row.productionDate || "N/A"}
          </span>
        </div>
      );
    },
  },
];

/**
 * Exact batches matching the system reference, ordered by ID descending.
 */
export const batchMockData: BatchItem[] = [
  {
    id: 41,
    batchId: "B20260908-00041",
    stockInDate: "08-09-2026",
    productName: "TD Shirt",
    sku: "TDS-BLU-40",
    color: "Blue",
    gender: "MALE",
    material: "Poly",
    quantity: 30,
    inHandQty: 30,
    receivedQty: 30,
    cartons: 3,
    itemsPerPacket: 10,
    pkgQty: 3,
    createdBy: "Tashdik",
    productionDate: "08-09-2026",
    ageInDays: 11,
    locationCode: "RACK-A01",
  },
  {
    id: 40,
    batchId: "B20260908-00040",
    stockInDate: "01-09-2026",
    productName: "TD Shirt",
    sku: "TDS-WHT-38",
    color: "White",
    gender: "MALE",
    material: "Poly",
    quantity: 150,
    inHandQty: 120,
    receivedQty: 150,
    cartons: 14,
    itemsPerPacket: 11,
    pkgQty: 14,
    createdBy: "Tashdik",
    productionDate: "08-09-2026",
    ageInDays: 11,
    locationCode: "RACK-A02",
  },
  {
    id: 39,
    batchId: "B20260902-00039",
    stockInDate: "02-09-2026",
    productName: "test000",
    sku: "TST-SLV-00",
    color: "Silver",
    gender: "UNISEX",
    material: "Aluminium + Plastic",
    quantity: 100000,
    inHandQty: 95000,
    receivedQty: 100000,
    cartons: 8250,
    itemsPerPacket: 12,
    pkgQty: 8250,
    createdBy: "Super Admin",
    productionDate: "02-09-2026",
    ageInDays: 17,
    locationCode: "RACK-B05",
  },
  {
    id: 38,
    batchId: "B20260901-00038",
    stockInDate: "01-09-2026",
    productName: "TD Shirt",
    sku: "TDS-BLK-42",
    color: "Black",
    gender: "MALE",
    material: "Poly",
    quantity: 145,
    inHandQty: 110,
    receivedQty: 145,
    cartons: 10,
    itemsPerPacket: 15,
    pkgQty: 10,
    createdBy: "Tashdik",
    productionDate: "01-09-2026",
    ageInDays: 18,
    locationCode: "RACK-A03",
  },
  {
    id: 37,
    batchId: "B20260901-00037",
    stockInDate: "01-09-2026",
    productName: "tedt",
    sku: "TED-RED-01",
    color: "Red",
    gender: "LADY",
    material: "IP",
    quantity: 47891,
    inHandQty: 47891,
    receivedQty: 47891,
    cartons: 4754,
    itemsPerPacket: 10,
    pkgQty: 4754,
    createdBy: "Super Admin",
    productionDate: "01-09-2026",
    ageInDays: 18,
    locationCode: "RACK-C02",
  },
  {
    id: 36,
    batchId: "B20260831-00036",
    stockInDate: "31-08-2026",
    productName: "JOG FLOW-150 Man",
    sku: "JOG-BLK-41",
    color: "Black",
    gender: "MALE",
    material: "RUBBER",
    quantity: 13425,
    inHandQty: 10200,
    receivedQty: 13425,
    cartons: 1349,
    itemsPerPacket: 10,
    pkgQty: 1349,
    createdBy: "Super Admin",
    productionDate: "31-08-2026",
    ageInDays: 19,
    locationCode: "RACK-D01",
  },
  {
    id: 35,
    batchId: "B20260830-00035",
    stockInDate: "30-08-2026",
    productName: "Macbook Pro",
    sku: "MBP-GRY-16",
    color: "Gray",
    gender: "UNISEX",
    material: "Aluminium + Plastic",
    quantity: 6040,
    inHandQty: 5200,
    receivedQty: 6040,
    cartons: 574,
    itemsPerPacket: 10,
    pkgQty: 574,
    createdBy: "Super Admin",
    productionDate: "30-08-2026",
    ageInDays: 20,
    locationCode: "RACK-B01",
  },
  {
    id: 34,
    batchId: "B20260828-00034",
    stockInDate: "29-08-2026",
    productName: "test",
    sku: "TST-BLU-02",
    color: "Blue",
    gender: "LADY",
    material: "RUBBER",
    quantity: 59197,
    inHandQty: 48000,
    receivedQty: 59197,
    cartons: 5744,
    itemsPerPacket: 10,
    pkgQty: 5744,
    createdBy: "Super Admin",
    productionDate: "29-08-2026",
    ageInDays: 21,
    locationCode: "RACK-D02",
  },
  {
    id: 33,
    batchId: "B20260825-00033",
    stockInDate: "25-08-2026",
    productName: "Chair",
    sku: "CHR-BRN-01",
    color: "Brown",
    gender: "UNISEX",
    material: "RUBBER",
    quantity: 94,
    inHandQty: 94,
    receivedQty: 94,
    cartons: 10,
    itemsPerPacket: 10,
    pkgQty: 10,
    createdBy: "Super Admin",
    productionDate: "25-08-2026",
    ageInDays: 25,
    locationCode: "RACK-E01",
  },
  {
    id: 32,
    batchId: "B20260824-00032",
    stockInDate: "24-08-2026",
    productName: "Chair",
    sku: "CHR-BLK-02",
    color: "Black",
    gender: "UNISEX",
    material: "RUBBER",
    quantity: 100,
    inHandQty: 80,
    receivedQty: 100,
    cartons: 10,
    itemsPerPacket: 10,
    pkgQty: 10,
    createdBy: "Super Admin",
    productionDate: "24-08-2026",
    ageInDays: 26,
    locationCode: "RACK-E02",
  },
  {
    id: 31,
    batchId: "B20260822-00031",
    stockInDate: "22-08-2026",
    productName: "Chair",
    sku: "CHR-WHT-03",
    color: "White",
    gender: "UNISEX",
    material: "RUBBER",
    quantity: 105,
    inHandQty: 65,
    receivedQty: 105,
    cartons: 11,
    itemsPerPacket: 10,
    pkgQty: 11,
    createdBy: "Super Admin",
    productionDate: "22-08-2026",
    ageInDays: 28,
    locationCode: "RACK-E03",
  },
  {
    id: 30,
    batchId: "B20260822-00030",
    stockInDate: "22-08-2026",
    productName: "NH-150",
    sku: "NH1-BLU-40",
    color: "Navy",
    gender: "MALE",
    material: "RUBBER",
    quantity: 29,
    inHandQty: 29,
    receivedQty: 29,
    cartons: 9,
    itemsPerPacket: 3,
    pkgQty: 9,
    createdBy: "Super Admin",
    productionDate: "22-08-2026",
    ageInDays: 28,
    locationCode: "RACK-D03",
  },
  {
    id: 29,
    batchId: "B20260728-00029",
    stockInDate: "28-07-2026",
    productName: "CUSHION-500",
    sku: "CSH-BLK-01",
    color: "Black",
    gender: "UNISEX",
    material: "IP",
    quantity: 1000000,
    inHandQty: 850000,
    receivedQty: 1000000,
    cartons: 10000,
    itemsPerPacket: 100,
    pkgQty: 0,
    createdBy: "Super Admin",
    productionDate: "28-07-2026",
    ageInDays: 53,
    locationCode: "RACK-C01",
  },
  {
    id: 28,
    batchId: "B20260728-00028",
    stockInDate: "28-07-2026",
    productName: "JOG FLOW-100",
    sku: "JOG-RED-39",
    color: "Red",
    gender: "LADY",
    material: "TPR",
    quantity: 22500,
    inHandQty: 18000,
    receivedQty: 22500,
    cartons: 2250,
    itemsPerPacket: 10,
    pkgQty: 2250,
    createdBy: "Super Admin",
    productionDate: "28-07-2026",
    ageInDays: 53,
    locationCode: "RACK-D04",
  },
  {
    id: 27,
    batchId: "B20260725-00027",
    stockInDate: "25-07-2026",
    productName: "AlphaShoe",
    sku: "ALP-BRN-42",
    color: "Brown",
    gender: "MALE",
    material: "Leather + Rubber",
    quantity: 850,
    inHandQty: 620,
    receivedQty: 850,
    cartons: 85,
    itemsPerPacket: 10,
    pkgQty: 85,
    createdBy: "Tashdik",
    productionDate: "24-07-2026",
    ageInDays: 57,
    locationCode: "RACK-A04",
  },
  {
    id: 26,
    batchId: "B20260722-00026",
    stockInDate: "22-07-2026",
    productName: "BetaBag",
    sku: "BET-NAV-01",
    color: "Navy",
    gender: "LADY",
    material: "Canvas + Suede",
    quantity: 1200,
    inHandQty: 950,
    receivedQty: 1200,
    cartons: 120,
    itemsPerPacket: 10,
    pkgQty: 120,
    createdBy: "Super Admin",
    productionDate: "21-07-2026",
    ageInDays: 60,
    locationCode: "RACK-A05",
  },
  {
    id: 25,
    batchId: "B20260720-00025",
    stockInDate: "20-07-2026",
    productName: "GammaGlove",
    sku: "GAM-GRY-L",
    color: "Gray",
    gender: "UNISEX",
    material: "Wool + Acrylic",
    quantity: 450,
    inHandQty: 300,
    receivedQty: 450,
    cartons: 45,
    itemsPerPacket: 10,
    pkgQty: 45,
    createdBy: "Tashdik",
    productionDate: "19-07-2026",
    ageInDays: 62,
    locationCode: "RACK-F01",
  },
  {
    id: 24,
    batchId: "B20260718-00024",
    stockInDate: "18-07-2026",
    productName: "DeltaHat",
    sku: "DEL-WHT-U",
    color: "White",
    gender: "KIDS",
    material: "Cotton + Polyester",
    quantity: 3200,
    inHandQty: 2400,
    receivedQty: 3200,
    cartons: 320,
    itemsPerPacket: 10,
    pkgQty: 320,
    createdBy: "Super Admin",
    productionDate: "17-07-2026",
    ageInDays: 64,
    locationCode: "RACK-F02",
  },
  {
    id: 23,
    batchId: "B20260715-00023",
    stockInDate: "15-07-2026",
    productName: "EpsilonJacket",
    sku: "EPS-BLK-XL",
    color: "Black",
    gender: "MALE",
    material: "Nylon + Mesh",
    quantity: 650,
    inHandQty: 420,
    receivedQty: 650,
    cartons: 65,
    itemsPerPacket: 10,
    pkgQty: 65,
    createdBy: "Super Admin",
    productionDate: "14-07-2026",
    ageInDays: 67,
    locationCode: "RACK-F03",
  },
  {
    id: 22,
    batchId: "B20260712-00022",
    stockInDate: "12-07-2026",
    productName: "ZetaBoots",
    sku: "ZET-BRN-43",
    color: "Brown",
    gender: "MALE",
    material: "Leather + Rubber",
    quantity: 980,
    inHandQty: 700,
    receivedQty: 980,
    cartons: 98,
    itemsPerPacket: 10,
    pkgQty: 98,
    createdBy: "Tashdik",
    productionDate: "11-07-2026",
    ageInDays: 70,
    locationCode: "RACK-A06",
  },
  {
    id: 21,
    batchId: "B20260710-00021",
    stockInDate: "10-07-2026",
    productName: "FlexRunner",
    sku: "FLX-BLU-41",
    color: "Blue",
    gender: "LADY",
    material: "Mesh + Foam",
    quantity: 14200,
    inHandQty: 9800,
    receivedQty: 14200,
    cartons: 1420,
    itemsPerPacket: 10,
    pkgQty: 1420,
    createdBy: "Super Admin",
    productionDate: "09-07-2026",
    ageInDays: 72,
    locationCode: "RACK-D05",
  },
  {
    id: 20,
    batchId: "B20260708-00020",
    stockInDate: "08-07-2026",
    productName: "UrbanTee",
    sku: "URB-WHT-M",
    color: "White",
    gender: "UNISEX",
    material: "Cotton + Polyester",
    quantity: 3500,
    inHandQty: 2100,
    receivedQty: 3500,
    cartons: 350,
    itemsPerPacket: 10,
    pkgQty: 350,
    createdBy: "Tashdik",
    productionDate: "07-07-2026",
    ageInDays: 74,
    locationCode: "RACK-F04",
  },
  {
    id: 19,
    batchId: "B20260705-00019",
    stockInDate: "05-07-2026",
    productName: "TitanWatch",
    sku: "TTN-SLV-01",
    color: "Silver",
    gender: "MALE",
    material: "Steel + Glass",
    quantity: 500,
    inHandQty: 250,
    receivedQty: 500,
    cartons: 50,
    itemsPerPacket: 10,
    pkgQty: 50,
    createdBy: "Super Admin",
    productionDate: "04-07-2026",
    ageInDays: 77,
    locationCode: "RACK-B02",
  },
  {
    id: 18,
    batchId: "B20260702-00018",
    stockInDate: "02-07-2026",
    productName: "CoreHoodie",
    sku: "CRH-NAV-L",
    color: "Navy",
    gender: "MALE",
    material: "Cotton + Fleece",
    quantity: 1800,
    inHandQty: 900,
    receivedQty: 1800,
    cartons: 180,
    itemsPerPacket: 10,
    pkgQty: 180,
    createdBy: "Tashdik",
    productionDate: "01-07-2026",
    ageInDays: 80,
    locationCode: "RACK-F05",
  },
  {
    id: 17,
    batchId: "B20260628-00017",
    stockInDate: "28-06-2026",
    productName: "PeakPack",
    sku: "PKP-GRN-01",
    color: "Green",
    gender: "UNISEX",
    material: "Nylon + Cordura",
    quantity: 750,
    inHandQty: 200,
    receivedQty: 750,
    cartons: 75,
    itemsPerPacket: 10,
    pkgQty: 75,
    createdBy: "Super Admin",
    productionDate: "27-06-2026",
    ageInDays: 84,
    locationCode: "RACK-A07",
  },
  {
    id: 16,
    batchId: "B20260625-00016",
    stockInDate: "25-06-2026",
    productName: "PulseBand",
    sku: "PLS-BLK-01",
    color: "Black",
    gender: "UNISEX",
    material: "Silicone + Plastic",
    quantity: 2400,
    inHandQty: 600,
    receivedQty: 2400,
    cartons: 240,
    itemsPerPacket: 10,
    pkgQty: 240,
    createdBy: "Super Admin",
    productionDate: "24-06-2026",
    ageInDays: 87,
    locationCode: "RACK-B03",
  },
  {
    id: 15,
    batchId: "B20260620-00015",
    stockInDate: "20-06-2026",
    productName: "VoltAudio",
    sku: "VLT-SLV-01",
    color: "Silver",
    gender: "UNISEX",
    material: "Aluminium + Plastic",
    quantity: 3100,
    inHandQty: 450,
    receivedQty: 3100,
    cartons: 310,
    itemsPerPacket: 10,
    pkgQty: 310,
    createdBy: "Super Admin",
    productionDate: "19-06-2026",
    ageInDays: 92,
    locationCode: "RACK-B04",
  },
  {
    id: 14,
    batchId: "B20260615-00014",
    stockInDate: "15-06-2026",
    productName: "StridePro",
    sku: "STR-WHT-40",
    color: "White",
    gender: "LADY",
    material: "Canvas + Rubber",
    quantity: 1950,
    inHandQty: 150,
    receivedQty: 1950,
    cartons: 195,
    itemsPerPacket: 10,
    pkgQty: 195,
    createdBy: "Tashdik",
    productionDate: "14-06-2026",
    ageInDays: 97,
    locationCode: "RACK-D06",
  },
  {
    id: 13,
    batchId: "B20260610-00013",
    stockInDate: "10-06-2026",
    productName: "ZenMat",
    sku: "ZEN-GRN-01",
    color: "Green",
    gender: "UNISEX",
    material: "Rubber + Foam",
    quantity: 800,
    inHandQty: 0,
    receivedQty: 800,
    cartons: 80,
    itemsPerPacket: 10,
    pkgQty: 80,
    createdBy: "Super Admin",
    productionDate: "09-06-2026",
    ageInDays: 102,
    locationCode: "RACK-E04",
  },
  {
    id: 12,
    batchId: "B20260605-00012",
    stockInDate: "05-06-2026",
    productName: "TD Shirt",
    sku: "TDS-BLU-44",
    color: "Blue",
    gender: "MALE",
    material: "Poly",
    quantity: 420,
    inHandQty: 0,
    receivedQty: 420,
    cartons: 42,
    itemsPerPacket: 10,
    pkgQty: 42,
    createdBy: "Tashdik",
    productionDate: "04-06-2026",
    ageInDays: 107,
    locationCode: "RACK-A08",
  },
  {
    id: 11,
    batchId: "B20260601-00011",
    stockInDate: "01-06-2026",
    productName: "test001",
    sku: "TST-GRY-01",
    color: "Gray",
    gender: "UNISEX",
    material: "Aluminium + Plastic",
    quantity: 50000,
    inHandQty: 12000,
    receivedQty: 50000,
    cartons: 4100,
    itemsPerPacket: 12,
    pkgQty: 4100,
    createdBy: "Super Admin",
    productionDate: "31-05-2026",
    ageInDays: 111,
    locationCode: "RACK-B06",
  },
  {
    id: 10,
    batchId: "B20260528-00010",
    stockInDate: "28-05-2026",
    productName: "test002",
    sku: "TST-BLU-02",
    color: "Blue",
    gender: "UNISEX",
    material: "Silicon + Glass",
    quantity: 25000,
    inHandQty: 4500,
    receivedQty: 25000,
    cartons: 2050,
    itemsPerPacket: 12,
    pkgQty: 2050,
    createdBy: "Super Admin",
    productionDate: "27-05-2026",
    ageInDays: 115,
    locationCode: "RACK-B07",
  },
  {
    id: 9,
    batchId: "B20260525-00009",
    stockInDate: "25-05-2026",
    productName: "test003",
    sku: "TST-BRN-03",
    color: "Brown",
    gender: "UNISEX",
    material: "Plastic + Copper",
    quantity: 15000,
    inHandQty: 1200,
    receivedQty: 15000,
    cartons: 1250,
    itemsPerPacket: 12,
    pkgQty: 1250,
    createdBy: "Super Admin",
    productionDate: "24-05-2026",
    ageInDays: 118,
    locationCode: "RACK-B08",
  },
  {
    id: 8,
    batchId: "B20260520-00008",
    stockInDate: "20-05-2026",
    productName: "JOG FLOW-150 Man",
    sku: "JOG-WHT-42",
    color: "White",
    gender: "MALE",
    material: "RUBBER",
    quantity: 8900,
    inHandQty: 0,
    receivedQty: 8900,
    cartons: 890,
    itemsPerPacket: 10,
    pkgQty: 890,
    createdBy: "Super Admin",
    productionDate: "19-05-2026",
    ageInDays: 123,
    locationCode: "RACK-D07",
  },
  {
    id: 7,
    batchId: "B20260515-00007",
    stockInDate: "15-05-2026",
    productName: "Macbook Pro",
    sku: "MBP-SLV-14",
    color: "Silver",
    gender: "UNISEX",
    material: "Aluminium + Plastic",
    quantity: 4500,
    inHandQty: 0,
    receivedQty: 4500,
    cartons: 450,
    itemsPerPacket: 10,
    pkgQty: 450,
    createdBy: "Super Admin",
    productionDate: "14-05-2026",
    ageInDays: 128,
    locationCode: "RACK-B09",
  },
  {
    id: 6,
    batchId: "B20260510-00006",
    stockInDate: "10-05-2026",
    productName: "Chair",
    sku: "CHR-BRN-02",
    color: "Brown",
    gender: "UNISEX",
    material: "RUBBER",
    quantity: 120,
    inHandQty: 0,
    receivedQty: 120,
    cartons: 12,
    itemsPerPacket: 10,
    pkgQty: 12,
    createdBy: "Super Admin",
    productionDate: "09-05-2026",
    ageInDays: 133,
    locationCode: "RACK-E05",
  },
  {
    id: 5,
    batchId: "B20260505-00005",
    stockInDate: "05-05-2026",
    productName: "NH-150",
    sku: "NH1-BLK-38",
    color: "Black",
    gender: "MALE",
    material: "RUBBER",
    quantity: 45,
    inHandQty: 0,
    receivedQty: 45,
    cartons: 5,
    itemsPerPacket: 9,
    pkgQty: 5,
    createdBy: "Super Admin",
    productionDate: "04-05-2026",
    ageInDays: 138,
    locationCode: "RACK-D08",
  },
  {
    id: 4,
    batchId: "B20260428-00004",
    stockInDate: "28-04-2026",
    productName: "CUSHION-500",
    sku: "CSH-WHT-02",
    color: "White",
    gender: "UNISEX",
    material: "IP",
    quantity: 500000,
    inHandQty: 0,
    receivedQty: 500000,
    cartons: 5000,
    itemsPerPacket: 100,
    pkgQty: 0,
    createdBy: "Super Admin",
    productionDate: "27-04-2026",
    ageInDays: 145,
    locationCode: "RACK-C03",
  },
  {
    id: 3,
    batchId: "B20260420-00003",
    stockInDate: "20-04-2026",
    productName: "JOG FLOW-100",
    sku: "JOG-BLU-40",
    color: "Blue",
    gender: "LADY",
    material: "TPR",
    quantity: 18000,
    inHandQty: 0,
    receivedQty: 18000,
    cartons: 1800,
    itemsPerPacket: 10,
    pkgQty: 1800,
    createdBy: "Super Admin",
    productionDate: "19-04-2026",
    ageInDays: 153,
    locationCode: "RACK-D09",
  },
  {
    id: 2,
    batchId: "B20260415-00002",
    stockInDate: "15-04-2026",
    productName: "AlphaShoe",
    sku: "ALP-BLK-40",
    color: "Black",
    gender: "MALE",
    material: "Leather + Rubber",
    quantity: 1100,
    inHandQty: 0,
    receivedQty: 1100,
    cartons: 110,
    itemsPerPacket: 10,
    pkgQty: 110,
    createdBy: "Tashdik",
    productionDate: "14-04-2026",
    ageInDays: 158,
    locationCode: "RACK-A09",
  },
  {
    id: 1,
    batchId: "B20260401-00001",
    stockInDate: "01-04-2026",
    productName: "BetaBag",
    sku: "BET-BRN-02",
    color: "Brown",
    gender: "LADY",
    material: "Canvas + Suede",
    quantity: 950,
    inHandQty: 0,
    receivedQty: 950,
    cartons: 95,
    itemsPerPacket: 10,
    pkgQty: 95,
    createdBy: "Super Admin",
    productionDate: "31-03-2026",
    ageInDays: 172,
    locationCode: "RACK-A10",
  },
];

