"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import type {
  ColumnDef,
  ReusableTableProps,
  RowBase,
  RowId,
  SortDirection,
} from "./ReusableTable.types";

/**
 * Generic, reusable data table with API-ready features:
 * - Loading skeleton states
 * - Error states with retry
 * - Server or client column sorting
 * - Flexible row ID resolution
 * - Selection (controlled and uncontrolled)
 * - Actions and column customization
 */
export default function ReusableTable<
  T extends RowBase,
  TId extends string | number = RowId<T>
>({
  data,
  columns,
  getRowId,
  onSelectionChange,
  renderActions,
  actionsLabel = "Action",
  showActions = true,
  showCheckbox = true,
  showId = true,
  idLabel = "ID",
  minWidth = "1200px",
  selectedIds,
  emptyState,
  isLoading = false,
  loadingRowCount = 5,
  error = null,
  onRetry,
  sortConfig = null,
  onSortChange,
}: ReusableTableProps<T, TId>) {
  const [internalSelected, setInternalSelected] = useState<Set<TId>>(
    new Set()
  );
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const resolveId = (row: T, index: number): TId => {
    if (getRowId) return getRowId(row);
    if (row.id !== undefined && row.id !== null) return row.id as unknown as TId;
    return index as unknown as TId;
  };

  const isControlled = selectedIds !== undefined;
  const selected = useMemo(
    () => (isControlled ? new Set(selectedIds) : internalSelected),
    [isControlled, selectedIds, internalSelected]
  );

  const allIds = useMemo(
    () => data.map((row, index) => resolveId(row, index)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, getRowId]
  );
  const selectedCount = allIds.filter((id) => selected.has(id)).length;
  const isAllSelected = data.length > 0 && selectedCount === data.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < data.length;

  // Native checkboxes only support the indeterminate visual state via the DOM API.
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const commitSelection = (next: Set<TId>) => {
    if (!isControlled) {
      setInternalSelected(next);
    }
    onSelectionChange?.(Array.from(next));
  };

  const handleToggleAll = (event: ChangeEvent<HTMLInputElement>) => {
    commitSelection(event.target.checked ? new Set(allIds) : new Set());
  };

  const handleToggleRow =
    (id: TId) => (event: ChangeEvent<HTMLInputElement>) => {
      const next = new Set(selected);
      if (event.target.checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      commitSelection(next);
    };

  const handleHeaderSort = (column: ColumnDef<T>) => {
    if (!column.sortable || !onSortChange) return;
    const sortField = column.sortKey ?? String(column.key);
    const isCurrentField = sortConfig?.field === sortField;
    const nextDirection: SortDirection =
      isCurrentField && sortConfig?.direction === "asc" ? "desc" : "asc";
    onSortChange(sortField, nextDirection);
  };

  const getCellValue = (row: T, column: ColumnDef<T>) => {
    if (column.render) return column.render(row);
    const value = (row as Record<string, unknown>)[column.key as string];
    return value as React.ReactNode;
  };

  const totalColSpan =
    columns.length +
    (showCheckbox ? 1 : 0) +
    (showId ? 1 : 0) +
    (showActions ? 1 : 0);

  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full border-collapse" style={{ minWidth }}>
        <thead className="bg-slate-100">
          <tr>
            {showCheckbox && (
              <th className="w-12 whitespace-nowrap border-b border-slate-100 px-5 py-2 text-left">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  aria-label="Select all rows"
                  disabled={isLoading || data.length === 0}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-500 disabled:opacity-40"
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                />
              </th>
            )}
            {showId && (
              <th className="whitespace-nowrap border-b border-slate-100 px-5 py-2 text-left text-xs font-bold text-slate-900">
                {idLabel}
              </th>
            )}
            {columns.map((column) => {
              const alignClass =
                column.align === "center"
                  ? "text-center"
                  : column.align === "right"
                  ? "text-right"
                  : "text-left";

              const sortField = column.sortKey ?? String(column.key);
              const isSorted = sortConfig?.field === sortField;
              const sortDirection = isSorted ? sortConfig?.direction : null;

              return (
                <th
                  key={String(column.key)}
                  className={
                    column.headerClassName ??
                    `whitespace-nowrap border-b border-slate-100 px-5 py-2 ${alignClass} text-xs font-bold text-slate-900`
                  }
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleHeaderSort(column)}
                      className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:text-[#476ab8] select-none ${
                        column.align === "right"
                          ? "justify-end ml-auto"
                          : column.align === "center"
                          ? "justify-center mx-auto"
                          : "justify-start"
                      } ${isSorted ? "text-[#476ab8]" : ""}`}
                    >
                      <span>{column.label}</span>
                      {sortDirection === "asc" ? (
                        <ArrowUp className="size-3.5 text-[#476ab8]" />
                      ) : sortDirection === "desc" ? (
                        <ArrowDown className="size-3.5 text-[#476ab8]" />
                      ) : (
                        <ArrowUpDown className="size-3.5 text-slate-400 opacity-60 hover:opacity-100" />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
            {showActions && (
              <th className="whitespace-nowrap border-b border-slate-100 px-5 py-2 text-left text-xs font-bold text-slate-900">
                {actionsLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* Loading Skeleton State */}
          {isLoading ? (
            Array.from({ length: loadingRowCount }).map((_, rIdx) => (
              <tr
                key={`skeleton-row-${rIdx}`}
                className="border-b border-slate-100 last:border-b-0"
              >
                {showCheckbox && (
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="h-4 w-4 rounded bg-slate-200/80 animate-pulse" />
                  </td>
                )}
                {showId && (
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="h-4 w-8 rounded bg-slate-200/80 animate-pulse" />
                  </td>
                )}
                {columns.map((col, cIdx) => (
                  <td
                    key={`skeleton-col-${cIdx}`}
                    className="whitespace-nowrap px-5 py-3"
                  >
                    <div
                      className={`h-4 rounded bg-slate-200/80 animate-pulse ${
                        col.align === "right"
                          ? "ml-auto w-16"
                          : col.align === "center"
                          ? "mx-auto w-20"
                          : "w-28"
                      }`}
                    />
                  </td>
                ))}
                {showActions && (
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="h-7 w-20 rounded-full bg-slate-200/80 animate-pulse" />
                  </td>
                )}
              </tr>
            ))
          ) : error ? (
            /* Error State */
            <tr>
              <td colSpan={totalColSpan} className="px-5 py-10 text-center">
                <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <AlertCircle className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Failed to load records
                    </p>
                    <p className="text-xs text-slate-500">
                      {typeof error === "string"
                        ? error
                        : error instanceof Error
                        ? error.message
                        : "An unexpected error occurred while fetching data."}
                    </p>
                  </div>
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer active:translate-y-px"
                    >
                      <RotateCcw className="size-3.5" />
                      Retry Request
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            /* Empty State */
            <tr>
              <td
                colSpan={totalColSpan}
                className="px-5 py-10 text-center text-sm text-slate-500"
              >
                {emptyState ?? "No records found."}
              </td>
            </tr>
          ) : (
            /* Data Rows */
            data.map((row, index) => {
              const rowId = resolveId(row, index);
              const isRowSelected = selected.has(rowId);

              return (
                <tr
                  key={String(rowId)}
                  className="group border-b border-slate-100 last:border-b-0 hover:bg-[#476ab8] transition-colors"
                >
                  {showCheckbox && (
                    <td className="whitespace-nowrap px-5 py-2 text-sm">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${String(rowId)}`}
                        className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
                        checked={isRowSelected}
                        onChange={handleToggleRow(rowId)}
                      />
                    </td>
                  )}
                  {showId && (
                    <td className="whitespace-nowrap px-5 py-2 text-sm text-slate-950 group-hover:text-white">
                      {row.id ?? String(rowId)}
                    </td>
                  )}
                  {columns.map((column) => {
                    const alignClass =
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left";
                    return (
                      <td
                        key={String(column.key)}
                        className={
                          column.cellClassName ??
                          `whitespace-nowrap px-5 py-2 text-sm text-slate-950 group-hover:text-white ${alignClass}`
                        }
                      >
                        {getCellValue(row, column)}
                      </td>
                    );
                  })}
                  {showActions && (
                    <td className="whitespace-nowrap px-5 py-2 text-sm">
                      {renderActions?.(row)}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
