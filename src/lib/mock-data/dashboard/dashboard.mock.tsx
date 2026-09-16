// ---------------------------------------------------------------------------
// Dashboard Inventory Tables — mock data & column definitions
// ---------------------------------------------------------------------------

import React, { type ReactNode } from "react";
import { ClipboardList, Package, Truck, Printer } from "lucide-react";
import type { ColumnDef } from "@/components/ui/tables/ReusableTable.types";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { ActionButtonGroup } from "@/components/ui/buttons/action-button-group";
import type { StockInRow, RequisitionRow } from "@/features/dashboard/types/dashboard.types";

// ── Helper Badges / Components ──────────────────────────────────────────────

export function StatusPill({ status }: { status: "Issued" | "Received" }) {
  const styles =
    status === "Issued"
      ? "bg-emerald-500"
      : "bg-indigo-500";

  return (
    <span
      className={`inline-block rounded-md px-3.5 py-1.5 text-xs font-semibold text-white ${styles}`}
    >
      {status}
    </span>
  );
}

export function LabelCheck({ color }: { color: "green" | "purple" }) {
  const styles =
    color === "green"
      ? "bg-emerald-100 text-emerald-600"
      : "bg-indigo-500 text-white";

  return (
    <span
      className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-xs ${styles}`}
    >
      ✓
    </span>
  );
}

// ── Mock Data ───────────────────────────────────────────────────────────────

export const stockInData: StockInRow[] = [
  {
    id: 264,
    productName: "Test000 48 Silver Male",
    batchNo: "B20260902-00039",
    material: "Poly",
    received: 10000,
    issued: 0,
    blocked: 0,
    shipable: 10000,
    pkgQty: 1000,
    agingZone: "3 Days",
    agingChange: "178 Days",
  },
  {
    id: 263,
    productName: "Test000 47 Silver Male",
    batchNo: "B20260902-00039",
    material: "Poly",
    received: 10000,
    issued: 0,
    blocked: 0,
    shipable: 10000,
    pkgQty: 1000,
    agingZone: "3 Days",
    agingChange: "178 Days",
  },
  {
    id: 262,
    productName: "Test000 46 Silver Male",
    batchNo: "B20260902-00039",
    material: "Poly",
    received: 10000,
    issued: 0,
    blocked: 0,
    shipable: 10000,
    pkgQty: 1000,
    agingZone: "3 Days",
    agingChange: "178 Days",
  },
  {
    id: 261,
    productName: "Test000 45 Silver Male",
    batchNo: "B20260902-00039",
    material: "Poly",
    received: 10000,
    issued: 500,
    blocked: 0,
    shipable: 9500,
    pkgQty: 950,
    agingZone: "3 Days",
    agingChange: "178 Days",
  },
  {
    id: 260,
    productName: "Test000 44 Silver Male",
    batchNo: "B20260902-00039",
    material: "Poly",
    received: 10000,
    issued: 5000,
    blocked: 0,
    shipable: 5000,
    pkgQty: 500,
    agingZone: "3 Days",
    agingChange: "178 Days",
  },
];

export const requisitionData: RequisitionRow[] = [
  {
    id: 25,
    labelColor: "green",
    lcNo: "Replacement.",
    poNo: "Replacement",
    reqType: "Partial(7)",
    customer: "MAF",
    reqDate: "02-09-26",
    dueDate: "-",
    requester: "Super Admin",
    product: 10,
    quantity: 100000,
    status: "Issued",
    actions: ["clipboard", "package", "truck", "print"],
  },
  {
    id: 24,
    labelColor: "green",
    lcNo: "2",
    poNo: "200",
    reqType: "Partial(1)",
    customer: "POU HUNG",
    reqDate: "01-09-26",
    dueDate: "-",
    requester: "Tashdik",
    product: 7,
    quantity: 100,
    status: "Issued",
    actions: ["clipboard", "package", "truck", "print"],
  },
  {
    id: 23,
    labelColor: "purple",
    lcNo: "1",
    poNo: "100",
    reqType: "Partial(1)",
    customer: "Alex Smith",
    reqDate: "01-09-26",
    dueDate: "-",
    requester: "Tashdik",
    product: 7,
    quantity: 145,
    status: "Received",
    actions: ["clipboard", "truck", "print"],
  },
  {
    id: 22,
    labelColor: "purple",
    lcNo: "45245456",
    poNo: "4645645",
    reqType: "Partial(1)",
    customer: "POU HUNG",
    reqDate: "01-09-26",
    dueDate: "-",
    requester: "Super Admin",
    product: 10,
    quantity: 47691,
    status: "Received",
    actions: ["clipboard", "truck", "print"],
  },
  {
    id: 21,
    labelColor: "purple",
    lcNo: "2435242",
    poNo: "3453455",
    reqType: "Partial(2)",
    customer: "MAF",
    reqDate: "31-08-26",
    dueDate: "-",
    requester: "Super Admin",
    product: 10,
    quantity: 6040,
    status: "Received",
    actions: ["clipboard", "truck", "print"],
  },
];

// ── Column Definitions ──────────────────────────────────────────────────────

export const stockInColumns: ColumnDef<StockInRow>[] = [
  {
    key: "productName",
    label: "Product Name",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "batchNo",
    label: "Batch No",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "material",
    label: "Material",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "received",
    label: "Received",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "issued",
    label: "Issued",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-800 group-hover:text-white",
  },
  {
    key: "blocked",
    label: "Blocked",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "shipable",
    label: "Shipable",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "pkgQty",
    label: "Pkg Qty",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "location",
    label: "Location",
    cellClassName: "whitespace-nowrap px-5 py-3.5 text-sm",
    render: () => (
      <a href="#" className="text-blue-500 underline">
        View
      </a>
    ),
  },
  {
    key: "agingZone",
    label: "Aging Zone",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm font-semibold text-emerald-500",
  },
  {
    key: "agingChange",
    label: "Aging Change",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
];

export const requisitionColumns: ColumnDef<RequisitionRow>[] = [
  {
    key: "labelColor",
    label: "Label",
    cellClassName: "whitespace-nowrap px-5 py-3.5 text-sm",
    render: (row) => <LabelCheck color={row.labelColor} />,
  },
  {
    key: "lcNo",
    label: "LC No",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "poNo",
    label: "PO No",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "reqType",
    label: "Req. Type",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm font-medium text-slate-700 group-hover:text-white",
  },
  {
    key: "customer",
    label: "Customer",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "reqDate",
    label: "Req. Date",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "dueDate",
    label: "Due Date",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "requester",
    label: "Requester",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "product",
    label: "Product",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "quantity",
    label: "Quantity",
    cellClassName:
      "whitespace-nowrap px-5 py-3.5 text-sm text-slate-700 group-hover:text-white",
  },
  {
    key: "status",
    label: "Status",
    cellClassName: "whitespace-nowrap px-5 py-3.5 text-sm",
    render: (row) => <StatusPill status={row.status} />,
  },
];

export function renderRequisitionActions(row: RequisitionRow): ReactNode {
  return (
    <ActionButtonGroup aria-label={`Actions for requisition ${row.id}`}>
      <ActionButton label="Packing List" icon={ClipboardList} />
      {row.status.toLowerCase() === "issued" && (
        <ActionButton label="Delivery Requisition" icon={Package} />
      )}
      <ActionButton label="Delivery Details" icon={Truck} />
      <ActionButton label="Print Details" icon={Printer} />
    </ActionButtonGroup>
  );
}

