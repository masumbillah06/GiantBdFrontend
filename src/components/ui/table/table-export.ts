import type { ColumnDef, RowBase } from "./ReusableTable.types";

/**
 * Cleanly format a value for CSV export
 */
function formatCsvValue(val: unknown): string {
  if (val === null || val === undefined) {
    return "";
  }
  if (typeof val === "boolean") {
    return val ? "Yes" : "No";
  }
  if (typeof val === "object") {
    if (val instanceof Date) {
      return val.toISOString();
    }
    if (Array.isArray(val)) {
      return val
        .map((v) => {
          if (v && typeof v === "object") {
            const obj = v as Record<string, unknown>;
            return String(obj.name ?? obj.label ?? obj.title ?? obj.code ?? obj.id ?? JSON.stringify(obj));
          }
          return String(v);
        })
        .join("; ");
    }
    const obj = val as Record<string, unknown>;
    const resolved = obj.name ?? obj.label ?? obj.title ?? obj.code ?? obj.id;
    if (resolved !== undefined && resolved !== null) {
      return formatCsvValue(resolved);
    }
    return JSON.stringify(val);
  }

  const str = String(val);
  // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export interface ExportToCsvOptions<T extends RowBase> {
  data: T[];
  columns: ColumnDef<T>[];
  filename?: string;
  selectedIds?: Array<string | number>;
  getRowId?: (row: T) => string | number;
}

/**
 * Export tabular data as an RFC-4180 compliant CSV file with Excel UTF-8 BOM.
 * Returns the count of exported records.
 */
export function exportToCsv<T extends RowBase>({
  data,
  columns,
  filename = "table-export",
  selectedIds,
  getRowId,
}: ExportToCsvOptions<T>): number {
  if (!data || data.length === 0) {
    return 0;
  }

  // Filter columns to only export data columns (ignore pure action columns without key)
  const exportableColumns = columns.filter((col) => {
    const key = String(col.key);
    return key && key !== "action" && key !== "actions" && key !== "__action";
  });

  if (exportableColumns.length === 0) {
    return 0;
  }

  // Filter rows if selectedIds is provided and non-empty
  let rowsToExport = data;
  if (selectedIds && selectedIds.length > 0) {
    const selectedSet = new Set(selectedIds);
    rowsToExport = data.filter((row, idx) => {
      const id = getRowId ? getRowId(row) : (row.id ?? idx);
      return selectedSet.has(id);
    });
    // If no match found for selected ids, fallback to all data
    if (rowsToExport.length === 0) {
      rowsToExport = data;
    }
  }

  // Generate CSV Header
  const headers = exportableColumns.map((col) => formatCsvValue(col.label || String(col.key)));
  const csvLines: string[] = [headers.join(",")];

  // Generate CSV Rows
  for (const row of rowsToExport) {
    const rowValues = exportableColumns.map((col) => {
      const rowRecord = row as Record<string, unknown>;
      const rawVal = rowRecord[col.key as string];
      return formatCsvValue(rawVal);
    });
    csvLines.push(rowValues.join(","));
  }

  const csvContent = "\uFEFF" + csvLines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const dateSuffix = new Date().toISOString().split("T")[0];
  const sanitizedFilename = filename.toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
  const finalFilename = `${sanitizedFilename}_${dateSuffix}.csv`;

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", finalFilename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return rowsToExport.length;
}

