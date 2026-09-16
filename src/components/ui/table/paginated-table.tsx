"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import ReusableTable from "./ReusableTable";
import type {
  ColumnDef,
  RowBase,
  RowId,
  SortConfig,
  SortDirection,
} from "./ReusableTable.types";
import Pagination from "@/components/ui/table/pagination";
import { useClientPagination } from "@/hooks/use-client-pagination";

export interface PaginatedTableProps<
  T extends RowBase,
  TId extends string | number = RowId<T>
> {
  data?: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T) => TId;

  /**
   * Mode:
   * - "client" (default): in-memory slicing of `data`.
   * - "server": `data` is already the current page slice fetched from an API.
   *   Automatically defaults to "server" if `totalPages` or `onPageChange` is provided.
   */
  mode?: "client" | "server";

  // Pagination parameters
  pageSize?: number;
  initialPage?: number;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Async / API states
  isLoading?: boolean;
  loadingRowCount?: number;
  error?: string | Error | React.ReactNode | null;
  onRetry?: () => void;

  // Sorting
  sortConfig?: SortConfig | null;
  onSortChange?: (field: string, direction: SortDirection) => void;

  // Table options
  minWidth?: string;
  actionsLabel?: string;
  showActions?: boolean;
  showCheckbox?: boolean;
  showId?: boolean;
  idLabel?: string;
  emptyState?: React.ReactNode;
  renderActions?: (row: T, notify: (msg: string) => void) => React.ReactNode;
  selectedIds?: Array<TId>;
  onSelectionChange?: (selectedIds: Array<TId>) => void;
  noticeDuration?: number;
  className?: string;
}

const EMPTY_DATA: never[] = [];

/**
 * Universal data table supporting both client-side mock datasets
 * and real-world asynchronous server-side API pagination.
 */
export function PaginatedTable<
  T extends RowBase,
  TId extends string | number = RowId<T>
>({
  data = EMPTY_DATA as T[],
  columns,
  getRowId,
  mode: explicitMode,
  pageSize = 10,
  initialPage = 1,
  currentPage: controlledCurrentPage,
  totalPages: controlledTotalPages,
  totalItems,
  onPageChange: parentOnPageChange,
  isLoading = false,
  loadingRowCount = 5,
  error = null,
  onRetry,
  sortConfig = null,
  onSortChange,
  minWidth = "1200px",
  actionsLabel = "Action",
  showActions,
  showCheckbox,
  showId,
  idLabel,
  emptyState,
  renderActions,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  noticeDuration = 3500,
  className = "space-y-4",
}: PaginatedTableProps<T, TId>) {
  // Infer mode: if server-specific props are provided, use "server" unless explicitly set to "client"
  const isServerMode =
    explicitMode === "server" ||
    (explicitMode === undefined &&
      (controlledTotalPages !== undefined || parentOnPageChange !== undefined));

  // --- Client-Side Pagination Hook (used when in client mode) ---
  const clientPagination = useClientPagination<T, TId>({
    data,
    pageSize,
    initialPage,
    noticeDuration,
  });

  // --- Server-Side Standalone State (used when in server mode) ---
  const [serverSelectedIds, setServerSelectedIds] = useState<Array<TId>>([]);
  const [serverNotice, setServerNotice] = useState<string | null>(null);
  const serverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (serverTimerRef.current) clearTimeout(serverTimerRef.current);
    };
  }, []);

  const clearServerNotice = useCallback(() => {
    if (serverTimerRef.current) {
      clearTimeout(serverTimerRef.current);
      serverTimerRef.current = null;
    }
    setServerNotice(null);
  }, []);

  const serverNotify = useCallback(
    (msg: string, duration = noticeDuration) => {
      if (serverTimerRef.current) clearTimeout(serverTimerRef.current);
      setServerNotice(msg);
      serverTimerRef.current = setTimeout(() => {
        setServerNotice(null);
        serverTimerRef.current = null;
      }, duration);
    },
    [noticeDuration]
  );

  // --- Resolve Active Values based on Mode ---
  const effectivePageData = isServerMode ? data : clientPagination.pageData;
  const effectiveCurrentPage = isServerMode
    ? (controlledCurrentPage ?? initialPage)
    : clientPagination.currentPage;
  const effectiveTotalPages = isServerMode
    ? (controlledTotalPages ?? 1)
    : clientPagination.totalPages;

  const effectiveSelectedIds = isServerMode
    ? (controlledSelectedIds ?? serverSelectedIds)
    : (controlledSelectedIds ?? clientPagination.selectedIds);

  const handleSelectionChange = (ids: Array<TId>) => {
    if (controlledSelectedIds === undefined) {
      if (isServerMode) {
        setServerSelectedIds(ids);
      } else {
        clientPagination.setSelectedIds(ids);
      }
    }
    onSelectionChange?.(ids);
  };

  const handlePageChange = (page: number) => {
    if (isServerMode) {
      parentOnPageChange?.(page);
    } else {
      clientPagination.handlePageChange(page);
    }
  };

  const activeNotice = isServerMode ? serverNotice : clientPagination.actionNotice;
  const activeClearNotice = isServerMode ? clearServerNotice : clientPagination.clearNotice;
  const activeNotify = isServerMode ? serverNotify : clientPagination.notify;

  return (
    <div className={className}>
      {/* Toast Feedback Notice */}
      {activeNotice && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5 text-xs sm:text-sm text-blue-800 flex items-center justify-between transition-all">
          <span>{activeNotice}</span>
          <button
            type="button"
            onClick={activeClearNotice}
            className="text-xs font-semibold hover:opacity-75 cursor-pointer ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Reusable Table */}
      <div className="bg-[var(--color-bg)]">
        <ReusableTable<T, TId>
          data={effectivePageData}
          columns={columns}
          getRowId={getRowId}
          selectedIds={effectiveSelectedIds}
          onSelectionChange={handleSelectionChange}
          actionsLabel={actionsLabel}
          showActions={showActions}
          showCheckbox={showCheckbox}
          showId={showId}
          idLabel={idLabel}
          minWidth={minWidth}
          emptyState={emptyState}
          isLoading={isLoading}
          loadingRowCount={loadingRowCount}
          error={error}
          onRetry={onRetry}
          sortConfig={sortConfig}
          onSortChange={onSortChange}
          renderActions={
            renderActions
              ? (row) => renderActions(row, activeNotify)
              : undefined
          }
        />
      </div>

      {/* Pagination Bar */}
      <Pagination
        currentPage={effectiveCurrentPage}
        totalPages={effectiveTotalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        disabled={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default PaginatedTable;
