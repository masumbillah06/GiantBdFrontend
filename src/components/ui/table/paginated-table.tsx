"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
import { useTableContext } from "./table-context";

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

  // Direct search override
  searchValue?: string;

  // Direct filters override
  filters?: Record<string, string | number>;
  onFilterChange?: (filters: Record<string, string | number>) => void;
}

const EMPTY_DATA: never[] = [];

/**
 * Universal data table supporting both client-side mock datasets
 * and real-world asynchronous server-side API pagination.
 * Automatically synchronizes with TableProvider when present.
 */
export function PaginatedTable<
  T extends RowBase,
  TId extends string | number = RowId<T>
>({
  data = EMPTY_DATA as T[],
  columns,
  getRowId,
  mode: explicitMode,
  pageSize: propPageSize,
  initialPage = 1,
  currentPage: controlledCurrentPage,
  totalPages: controlledTotalPages,
  totalItems: controlledTotalItems,
  onPageChange: parentOnPageChange,
  onPageSizeChange: _onPageSizeChange,
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
  searchValue: propSearchValue,
  filters: propFilters,
  onFilterChange,
}: PaginatedTableProps<T, TId>) {
  const tableContext = useTableContext<T>();
  const tableRef = useRef<HTMLDivElement>(null);

  // Synchronize page size with context if not explicitly overridden by prop
  const effectivePageSize =
    propPageSize !== undefined
      ? propPageSize
      : tableContext?.pageSize ?? 10;

  // Synchronize search query with context or prop
  const activeSearchQuery =
    propSearchValue !== undefined
      ? propSearchValue
      : tableContext?.searchQuery ?? "";

  // Synchronize filters with context or prop
  const activeFilters = useMemo(() => {
    return propFilters ?? tableContext?.filters ?? {};
  }, [propFilters, tableContext?.filters]);

  // Infer mode: if server-specific props are provided, use "server" unless explicitly set to "client"
  const isServerMode =
    explicitMode === "server" ||
    (explicitMode === undefined &&
      (controlledTotalPages !== undefined || parentOnPageChange !== undefined));

  // Client-side search and filter processing if in client mode
  const processedData = useMemo(() => {
    if (isServerMode) {
      return data;
    }

    let result = data;

    // 1. Apply active field filters
    const activeFilterEntries = Object.entries(activeFilters).filter(
      ([, val]) => val !== undefined && val !== null && String(val).trim() !== ""
    );

    if (activeFilterEntries.length > 0) {
      result = result.filter((row) => {
        const rowRecord = row as Record<string, unknown>;
        return activeFilterEntries.every(([filterKey, filterVal]) => {
          const targetVal = String(filterVal).toLowerCase().trim();

          // Support field name aliases (e.g. master vs masterProduct vs masterProductName)
          let cellVal: unknown = rowRecord[filterKey];
          if (cellVal === undefined) {
            if (filterKey === "master" || filterKey === "masterProduct") {
              cellVal =
                rowRecord.masterProduct ??
                rowRecord.masterProductName ??
                rowRecord.master ??
                rowRecord.productName;
            }
          }

          if (cellVal === undefined || cellVal === null) {
            return false;
          }

          if (typeof cellVal === "object" && !React.isValidElement(cellVal)) {
            const obj = cellVal as Record<string, unknown>;
            cellVal =
              obj.name ?? obj.label ?? obj.title ?? obj.code ?? obj.id ?? "";
          }

          const cellString = String(cellVal).toLowerCase().trim();
          return cellString === targetVal;
        });
      });
    }

    // 2. Search query filtering
    if (activeSearchQuery.trim()) {
      const query = activeSearchQuery.toLowerCase().trim();
      result = result.filter((row) => {
        // Search across all defined columns
        for (const col of columns) {
          const rowRecord = row as Record<string, unknown>;
          let cellVal: unknown = rowRecord[col.key as string];
          if (cellVal && typeof cellVal === "object" && !React.isValidElement(cellVal)) {
            const obj = cellVal as Record<string, unknown>;
            cellVal =
              obj.name ?? obj.label ?? obj.title ?? obj.code ?? obj.id ?? "";
          }
          if (cellVal !== undefined && cellVal !== null) {
            if (String(cellVal).toLowerCase().includes(query)) {
              return true;
            }
          }
        }
        // Search across all object properties as fallback
        return Object.values(row).some((val) => {
          if (val && typeof val === "object" && !React.isValidElement(val)) {
            const obj = val as Record<string, unknown>;
            const text =
              obj.name ?? obj.label ?? obj.title ?? obj.code ?? obj.id;
            if (text !== undefined && text !== null) {
              return String(text).toLowerCase().includes(query);
            }
          }
          return String(val ?? "").toLowerCase().includes(query);
        });
      });
    }

    return result;
  }, [data, columns, activeSearchQuery, activeFilters, isServerMode]);

  // --- Client-Side Pagination Hook (used when in client mode) ---
  const clientPagination = useClientPagination<T, TId>({
    data: processedData,
    pageSize: effectivePageSize,
    initialPage,
    noticeDuration,
  });

  // Reset to page 1 whenever active filters or search change
  const { setCurrentPage } = clientPagination;
  const isFirstFilterRender = useRef(true);
  const prevSearchRef = useRef(activeSearchQuery);
  const prevFiltersRef = useRef(activeFilters);

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }
    if (
      prevSearchRef.current !== activeSearchQuery ||
      prevFiltersRef.current !== activeFilters
    ) {
      prevSearchRef.current = activeSearchQuery;
      prevFiltersRef.current = activeFilters;
      setCurrentPage(1);
      onFilterChange?.(activeFilters);
    }
  }, [activeSearchQuery, activeFilters, setCurrentPage, onFilterChange]);

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
  const effectiveTotalItems = isServerMode
    ? controlledTotalItems
    : processedData.length;

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

  const onRetryRef = useRef(onRetry);
  onRetryRef.current = onRetry;

  const getRowIdRef = useRef(getRowId);
  getRowIdRef.current = getRowId;

  const handleRetry = useCallback(async () => {
    return onRetryRef.current?.();
  }, []);

  const handleGetRowId = useCallback(
    (row: T) => {
      return getRowIdRef.current ? getRowIdRef.current(row) : (row as { id?: string | number }).id ?? "";
    },
    []
  );

  const registerTable = tableContext?.registerTable;
  const unregisterTable = tableContext?.unregisterTable;

  // Register table state with TableProvider if present
  useEffect(() => {
    if (registerTable) {
      registerTable({
        data: processedData,
        rawData: data,
        columns,
        selectedIds: effectiveSelectedIds as Array<string | number>,
        isLoading,
        onRetry: handleRetry,
        getRowId: handleGetRowId,
        tableRef,
      });
    }
  }, [
    registerTable,
    processedData,
    data,
    columns,
    effectiveSelectedIds,
    isLoading,
    handleRetry,
    handleGetRowId,
  ]);

  // Unregister table only on unmount
  useEffect(() => {
    return () => {
      unregisterTable?.();
    };
  }, [unregisterTable]);

  const activeNotice =
    tableContext?.actionNotice ??
    (isServerMode ? serverNotice : clientPagination.actionNotice);
  const activeClearNotice =
    tableContext?.clearNotice ??
    (isServerMode ? clearServerNotice : clientPagination.clearNotice);
  const activeNotify =
    tableContext?.notify ??
    (isServerMode ? serverNotify : clientPagination.notify);

  return (
    <div ref={tableRef} className={className}>
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
          emptyState={
            processedData.length === 0 &&
            (Boolean(activeSearchQuery.trim()) ||
              Object.values(activeFilters).some(
                (v) => v !== undefined && v !== null && String(v).trim() !== ""
              )) ? (
              <div className="py-8 text-center text-slate-500">
                <p className="text-sm font-medium text-slate-700">
                  No records match the current filters
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try adjusting your search query or reset the filters.
                </p>
              </div>
            ) : (
              emptyState
            )
          }
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
        totalItems={effectiveTotalItems}
        pageSize={effectivePageSize}
        disabled={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default PaginatedTable;
