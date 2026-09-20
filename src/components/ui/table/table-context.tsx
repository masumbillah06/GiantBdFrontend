"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ColumnDef, RowBase } from "./ReusableTable.types";
import { exportToCsv } from "./table-export";
import { printTableData } from "./table-print";

export interface RegisteredTableMeta<T extends RowBase = RowBase> {
  data?: T[];
  rawData?: T[];
  columns?: ColumnDef<T>[];
  selectedIds?: Array<string | number>;
  isLoading?: boolean;
  onRetry?: () => void;
  getRowId?: (row: T) => string | number;
  tableRef?: React.RefObject<HTMLDivElement | null>;
}

export interface TableContextValue<T extends RowBase = RowBase> {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchPlaceholder?: string;

  // Filters
  filters: Record<string, string | number>;
  setFilter: (key: string, value: string | number) => void;
  setFilters: (filters: Record<string, string | number>) => void;
  resetFilters: () => void;

  // Pagination
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
  currentPage: number;
  setCurrentPage: (page: number) => void;

  // Reload
  reload: () => Promise<void>;
  isLoading: boolean;
  isReloading: boolean;

  // Export & Print
  exportData: (filename?: string) => void;
  printTable: () => void;
  title?: string;
  entityName?: string;
  exportFilename?: string;

  // New action
  onNew?: () => void;
  newButtonLabel?: string;
  newHref?: string;

  // Table Registration
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  registeredTable: RegisteredTableMeta<any> | null;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  registerTable: (meta: RegisteredTableMeta<any>) => void;
  unregisterTable: () => void;

  // Feedback notifications
  actionNotice: string | null;
  notify: (msg: string, duration?: number) => void;
  clearNotice: () => void;
}

const TableContext = createContext<TableContextValue | null>(null);

function areArraysShallowEqual<T>(left?: T[], right?: T[]) {
  if (left === right) return true;
  if (!left || !right || left.length !== right.length) return false;

  return left.every((item, index) => item === right[index]);
}

function areColumnsEqual<T extends RowBase>(
  left?: ColumnDef<T>[],
  right?: ColumnDef<T>[]
) {
  if (left === right) return true;
  if (!left || !right || left.length !== right.length) return false;

  return left.every(
    (col, index) =>
      col === right[index] ||
      (col.key === right[index]?.key && col.label === right[index]?.label)
  );
}

export interface TableProviderProps<T extends RowBase = RowBase> {
  children: React.ReactNode;
  initialSearchQuery?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  searchPlaceholder?: string;
  title?: string;
  entityName?: string;
  exportFilename?: string;
  onReload?: () => unknown;
  onExport?: (data: T[], columns: ColumnDef<T>[]) => void;
  onPrint?: () => void;
  onNew?: () => void;
  newButtonLabel?: string;
  newHref?: string;
  data?: T[];
  columns?: ColumnDef<T>[];
  getRowId?: (row: T) => string | number;
  isLoading?: boolean;
  initialFilters?: Record<string, string | number>;
  onFilterChange?: (filters: Record<string, string | number>) => void;
  onSearchChange?: (query: string) => void;
  onPageSizeChange?: (size: number) => void;
}

export function TableProvider<T extends RowBase = RowBase>({
  children,
  initialSearchQuery = "",
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50, 100],
  searchPlaceholder,
  title,
  entityName,
  exportFilename,
  onReload,
  onExport,
  onPrint,
  onNew,
  newButtonLabel = "New",
  newHref,
  data: propData,
  columns: propColumns,
  getRowId: propGetRowId,
  isLoading: propIsLoading,
  initialFilters,
  onFilterChange,
  onSearchChange,
  onPageSizeChange,
}: TableProviderProps<T>) {
  const [searchQuery, setSearchQueryState] = useState(initialSearchQuery);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFiltersState] = useState<Record<string, string | number>>(
    initialFilters ?? {}
  );
  const [isReloading, setIsReloading] = useState(false);
  const [registeredTable, setRegisteredTable] =
    useState<RegisteredTableMeta<T> | null>(null);
  const registeredTableRef = useRef<RegisteredTableMeta<T> | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNotice = useCallback(() => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = null;
    }
    setActionNotice(null);
  }, []);

  const notify = useCallback(
    (msg: string, duration = 3500) => {
      clearNotice();
      setActionNotice(msg);
      noticeTimerRef.current = setTimeout(() => {
        setActionNotice(null);
        noticeTimerRef.current = null;
      }, duration);
    },
    [clearNotice]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchQueryState(query);
      setCurrentPage(1);
      onSearchChange?.(query);
    },
    [onSearchChange]
  );

  const setFilter = useCallback(
    (key: string, value: string | number) => {
      setFiltersState((prev) => {
        const next = { ...prev };
        if (value === "" || value === undefined || value === null) {
          delete next[key];
        } else {
          next[key] = value;
        }
        onFilterChange?.(next);
        return next;
      });
      setCurrentPage(1);
    },
    [onFilterChange]
  );

  const setFilters = useCallback(
    (newFilters: Record<string, string | number>) => {
      setFiltersState(newFilters);
      setCurrentPage(1);
      onFilterChange?.(newFilters);
    },
    [onFilterChange]
  );

  const resetFilters = useCallback(() => {
    setFiltersState({});
    setCurrentPage(1);
    onFilterChange?.({});
  }, [onFilterChange]);

  const setPageSize = useCallback(
    (size: number) => {
      setPageSizeState(size);
      setCurrentPage(1);
      onPageSizeChange?.(size);
    },
    [onPageSizeChange]
  );

  const registerTable = useCallback((meta: RegisteredTableMeta<T>) => {
    registeredTableRef.current = meta;
    setRegisteredTable((current) => {
      if (
        current &&
        current.isLoading === meta.isLoading &&
        areArraysShallowEqual(current.data, meta.data) &&
        areArraysShallowEqual(current.rawData, meta.rawData) &&
        areColumnsEqual(current.columns, meta.columns)
      ) {
        return current;
      }

      return meta;
    });
  }, []);

  const unregisterTable = useCallback(() => {
    registeredTableRef.current = null;
    setRegisteredTable(null);
  }, []);

  // Combined data and columns (props take precedence or fall back to registered)
  // const effectiveData =
  //   propData ??
  //   registeredTable?.data ??
  //   registeredTableRef.current?.data ??
  //   [];
  // const effectiveColumns =
  //   propColumns ??
  //   registeredTable?.columns ??
  //   registeredTableRef.current?.columns ??
  //   [];
  // const effectiveGetRowId =
  //   propGetRowId ??
  //   registeredTable?.getRowId ??
  //   registeredTableRef.current?.getRowId;
  const effectiveIsLoading =
    Boolean(propIsLoading) ||
    Boolean(registeredTable?.isLoading) ||
    isReloading;

  const reload = useCallback(async () => {
    setIsReloading(true);
    try {
      if (onReload) {
        await onReload();
      } else if (registeredTableRef.current?.onRetry) {
        await registeredTableRef.current.onRetry();
      }
      notify("Table data reloaded successfully");
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Failed to reload table data"
      );
    } finally {
      setIsReloading(false);
    }
  }, [onReload, notify]);

  const exportData = useCallback(
    (customFilename?: string) => {
      const activeData =
        propData ??
        registeredTableRef.current?.data ??
        [];
      const activeColumns =
        propColumns ??
        registeredTableRef.current?.columns ??
        [];
      const activeGetRowId =
        propGetRowId ??
        registeredTableRef.current?.getRowId;
      const activeSelectedIds =
        registeredTableRef.current?.selectedIds;

      if (onExport) {
        onExport(activeData, activeColumns);
        return;
      }

      const effectiveFilename =
        customFilename ??
        exportFilename ??
        (title ? title.toLowerCase().replace(/\s+/g, "-") : "table-export");

      const count = exportToCsv({
        data: activeData,
        columns: activeColumns,
        filename: effectiveFilename,
        selectedIds: activeSelectedIds,
        getRowId: activeGetRowId,
      });

      if (count > 0) {
        notify(`Exported ${count} record${count === 1 ? "" : "s"} to CSV`);
      } else {
        notify("No data available to export");
      }
    },
    [
      propData,
      propColumns,
      propGetRowId,
      onExport,
      exportFilename,
      title,
      notify,
    ]
  );

  const printTable = useCallback(() => {
    const activeData =
      propData ??
      registeredTableRef.current?.data ??
      [];
    const activeColumns =
      propColumns ??
      registeredTableRef.current?.columns ??
      [];
    const activeGetRowId =
      propGetRowId ??
      registeredTableRef.current?.getRowId;
    const activeSelectedIds =
      registeredTableRef.current?.selectedIds;

    if (onPrint) {
      onPrint();
      return;
    }

    printTableData({
      title: title ?? (entityName ? `${entityName} List` : "Table Records"),
      data: activeData,
      columns: activeColumns,
      selectedIds: activeSelectedIds,
      getRowId: activeGetRowId,
    });
  }, [
    propData,
    propColumns,
    propGetRowId,
    onPrint,
    title,
    entityName,
  ]);

  const value = useMemo<TableContextValue<T>>(
    () => ({
      searchQuery,
      setSearchQuery,
      searchPlaceholder,
      filters,
      setFilter,
      setFilters,
      resetFilters,
      pageSize,
      setPageSize,
      pageSizeOptions,
      currentPage,
      setCurrentPage,
      reload,
      isLoading: effectiveIsLoading,
      isReloading,
      exportData,
      printTable,
      title,
      entityName,
      exportFilename,
      onNew,
      newButtonLabel,
      newHref,
      registeredTable,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      registerTable: registerTable as (meta: RegisteredTableMeta<any>) => void,
      unregisterTable,
      actionNotice,
      notify,
      clearNotice,
    }),
    [
      searchQuery,
      setSearchQuery,
      searchPlaceholder,
      filters,
      setFilter,
      setFilters,
      resetFilters,
      pageSize,
      setPageSize,
      pageSizeOptions,
      currentPage,
      setCurrentPage,
      reload,
      effectiveIsLoading,
      isReloading,
      exportData,
      printTable,
      title,
      entityName,
      exportFilename,
      onNew,
      newButtonLabel,
      newHref,
      registeredTable,
      registerTable,
      unregisterTable,
      actionNotice,
      notify,
      clearNotice,
    ]
  );

  return (
    <TableContext.Provider value={value as unknown as TableContextValue}>
      {children}
    </TableContext.Provider>
  );
}

/**
 * Hook to access TableContext. Returns null if not wrapped in TableProvider.
 */
export function useTableContext<T extends RowBase = RowBase>(): TableContextValue<T> | null {
  const ctx = useContext(TableContext);
  return (ctx as TableContextValue<T> | null) ?? null;
}

/**
 * Hook to get unified toolbar bindings whether inside TableProvider or standalone.
 */
export function useTableToolbar() {
  const context = useTableContext();
  return context;
}

export default TableProvider;
