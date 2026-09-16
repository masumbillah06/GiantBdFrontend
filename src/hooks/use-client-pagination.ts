"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { RowBase, RowId } from "@/components/ui/table/ReusableTable.types";

export interface UseClientPaginationOptions<T extends RowBase> {
  data: T[];
  pageSize?: number;
  initialPage?: number;
  noticeDuration?: number;
}

export interface UseClientPaginationReturn<
  T extends RowBase,
  TId extends string | number = RowId<T>
> {
  selectedIds: Array<TId>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Array<TId>>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  actionNotice: string | null;
  setActionNotice: React.Dispatch<React.SetStateAction<string | null>>;
  totalPages: number;
  pageData: T[];
  handlePageChange: (page: number) => void;
  notify: (msg: string, duration?: number) => void;
  clearNotice: () => void;
}

/**
 * Common client-side pagination, row selection, and action notice hook.
 * Consolidates repeated table state logic across data tables.
 */
export function useClientPagination<
  T extends RowBase,
  TId extends string | number = RowId<T>
>({
  data,
  pageSize = 10,
  initialPage = 1,
  noticeDuration = 3500,
}: UseClientPaginationOptions<T>): UseClientPaginationReturn<T, TId> {
  const [selectedIds, setSelectedIds] = useState<Array<TId>>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending notice timers on unmount
  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Ensure current page does not exceed totalPages if data shrinks
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pageData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safeCurrentPage, pageSize]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  }, []);

  const clearNotice = useCallback(() => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = null;
    }
    setActionNotice(null);
  }, []);

  const notify = useCallback(
    (msg: string, duration = noticeDuration) => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
      setActionNotice(msg);
      noticeTimerRef.current = setTimeout(() => {
        setActionNotice(null);
        noticeTimerRef.current = null;
      }, duration);
    },
    [noticeDuration]
  );

  return {
    selectedIds,
    setSelectedIds,
    currentPage: safeCurrentPage,
    setCurrentPage,
    actionNotice,
    setActionNotice,
    totalPages,
    pageData,
    handlePageChange,
    notify,
    clearNotice,
  };
}

export default useClientPagination;
