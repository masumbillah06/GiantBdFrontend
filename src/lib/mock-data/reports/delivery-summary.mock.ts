// ---------------------------------------------------------------------------
// Delivery Summary Data — mock dataset
// Seeded directly from reference Year 2026 & supports multi-year reporting
// ---------------------------------------------------------------------------

export interface SummaryColumn {
  key: string;
  label: string; // e.g. "Alex Smith-Poly"
  buyer: string;
  material: string;
}

export interface MonthSummaryRow {
  month: string; // e.g. "January"
  monthIndex: number; // 0 to 11
  values: Record<string, number>; // key: column.key -> quantity
  total: number;
}

export interface YearSummaryData {
  year: number;
  columns: SummaryColumn[];
  rows: MonthSummaryRow[];
  totals: Record<string, number>;
  grandTotal: number;
}

export const SUMMARY_COLUMNS: SummaryColumn[] = [
  { key: "alex_smith_poly", label: "Alex Smith-Poly", buyer: "Alex Smith", material: "Poly" },
  { key: "apex_aluminium_plastic", label: "APEX-Aluminium + Plastic", buyer: "APEX", material: "Aluminium + Plastic" },
  { key: "apex_ip", label: "APEX-IP", buyer: "APEX", material: "IP" },
  { key: "apex_poly", label: "APEX-Poly", buyer: "APEX", material: "Poly" },
  { key: "apex_rubber", label: "APEX-RUBBER", buyer: "APEX", material: "RUBBER" },
  { key: "apex_tpr", label: "APEX-TPR", buyer: "APEX", material: "TPR" },
  { key: "maf_aluminium_plastic", label: "MAF-Aluminium + Plastic", buyer: "MAF", material: "Aluminium + Plastic" },
  { key: "maf_ip", label: "MAF-IP", buyer: "MAF", material: "IP" },
  { key: "maf_tpr", label: "MAF-TPR", buyer: "MAF", material: "TPR" },
  { key: "pou_hung_ip", label: "POU HUNG-IP", buyer: "POU HUNG", material: "IP" },
  { key: "pou_hung_poly", label: "POU HUNG-Poly", buyer: "POU HUNG", material: "Poly" },
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Raw monthly data seeded from exact reference screenshot for 2026
const RAW_2026_VALUES: Record<string, Record<string, number>> = {
  July: {
    apex_ip: 12000,
    apex_rubber: 50,
    apex_tpr: 21160,
    maf_ip: 10,
    maf_tpr: 20914,
    pou_hung_ip: 28178,
  },
  August: {
    apex_ip: 59901,
    maf_aluminium_plastic: 351,
  },
  September: {
    alex_smith_poly: 45,
    apex_aluminium_plastic: 500,
    apex_poly: 19,
    pou_hung_ip: 166,
    pou_hung_poly: 5,
  },
};

export function getDeliverySummaryForYear(year: number): YearSummaryData {
  const is2026 = year === 2026;
  const rawValues = is2026 ? RAW_2026_VALUES : {};

  const rows: MonthSummaryRow[] = MONTH_NAMES.map((month, index) => {
    const monthData = rawValues[month] || {};
    const values: Record<string, number> = {};

    let monthTotal = 0;
    SUMMARY_COLUMNS.forEach((col) => {
      const val = monthData[col.key] || 0;
      values[col.key] = val;
      monthTotal += val;
    });

    return {
      month,
      monthIndex: index,
      values,
      total: monthTotal,
    };
  });

  const totals: Record<string, number> = {};
  SUMMARY_COLUMNS.forEach((col) => {
    totals[col.key] = rows.reduce((acc, row) => acc + (row.values[col.key] || 0), 0);
  });

  const grandTotal = rows.reduce((acc, row) => acc + row.total, 0);

  return {
    year,
    columns: SUMMARY_COLUMNS,
    rows,
    totals,
    grandTotal,
  };
}

export const AVAILABLE_YEARS = [2026, 2025, 2024, 2023];

// Flat mock array for service consumption
export const deliverySummaryData = getDeliverySummaryForYear(2026);
