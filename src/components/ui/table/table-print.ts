import type { ColumnDef, RowBase } from "./ReusableTable.types";

export interface PrintTableOptions<T extends RowBase> {
  title?: string;
  data: T[];
  columns: ColumnDef<T>[];
  selectedIds?: Array<string | number>;
  getRowId?: (row: T) => string | number;
}

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return "";
  if (typeof str === "boolean") return str ? "Yes" : "No";
  if (typeof str === "object") {
    if (Array.isArray(str)) {
      return str
        .map((item) => {
          if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>;
            return String(obj.name ?? obj.label ?? obj.title ?? obj.code ?? obj.id ?? "");
          }
          return String(item ?? "");
        })
        .filter(Boolean)
        .join(", ");
    }
    const obj = str as Record<string, unknown>;
    const resolved = obj.name ?? obj.label ?? obj.title ?? obj.code ?? obj.id ?? "";
    return escapeHtml(resolved);
  }
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Cleanly print tabular data using an isolated hidden iframe.
 * Excludes application navigation, toolbars, and action columns.
 */
export function printTableData<T extends RowBase>({
  title = "Table Records",
  data,
  columns,
  selectedIds,
  getRowId,
}: PrintTableOptions<T>): void {
  if (!data || data.length === 0) {
    window.print();
    return;
  }

  // Filter out pure action columns
  const printableColumns = columns.filter((col) => {
    const key = String(col.key);
    return key && key !== "action" && key !== "actions" && key !== "__action";
  });

  if (printableColumns.length === 0) {
    window.print();
    return;
  }

  // Filter rows if selectedIds is provided and non-empty
  let rowsToPrint = data;
  if (selectedIds && selectedIds.length > 0) {
    const selectedSet = new Set(selectedIds);
    const filtered = data.filter((row, idx) => {
      const id = getRowId ? getRowId(row) : (row.id ?? idx);
      return selectedSet.has(id);
    });
    if (filtered.length > 0) {
      rowsToPrint = filtered;
    }
  }

  const printTime = new Date().toLocaleString();

  const theadHtml = printableColumns
    .map((col) => {
      const align = col.align ?? "left";
      return `<th style="text-align: ${align}; padding: 8px 12px; border: 1px solid #cbd5e1; background-color: #f1f5f9; font-weight: 600; font-size: 11px; text-transform: uppercase; color: #1e293b;">${escapeHtml(
        col.label || String(col.key)
      )}</th>`;
    })
    .join("");

  const tbodyHtml = rowsToPrint
    .map((row, index) => {
      const bg = index % 2 === 0 ? "#ffffff" : "#f8fafc";
      const cells = printableColumns
        .map((col) => {
          const align = col.align ?? "left";
          const rowRecord = row as Record<string, unknown>;
          const rawVal = rowRecord[col.key as string];
          return `<td style="text-align: ${align}; padding: 7px 12px; border: 1px solid #e2e8f0; font-size: 11px; color: #334155;">${escapeHtml(
            rawVal
          )}</td>`;
        })
        .join("");
      return `<tr style="background-color: ${bg};">${cells}</tr>`;
    })
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page {
            size: auto;
            margin: 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 20px;
          }
          .print-header {
            margin-bottom: 16px;
            border-bottom: 2px solid #334155;
            padding-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .print-title {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .print-meta {
            font-size: 11px;
            color: #64748b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          .print-footer {
            margin-top: 16px;
            font-size: 10px;
            color: #94a3b8;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1 class="print-title">${escapeHtml(title)}</h1>
            <div class="print-meta">Total records: ${rowsToPrint.length}</div>
          </div>
          <div class="print-meta">Printed on: ${escapeHtml(printTime)}</div>
        </div>
        <table>
          <thead>
            <tr>${theadHtml}</tr>
          </thead>
          <tbody>
            ${tbodyHtml}
          </tbody>
        </table>
        <div class="print-footer">Giant BD Internal Report • Confidential</div>
      </body>
    </html>
  `;

  // Create an invisible iframe for seamless print
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }
  };
}

