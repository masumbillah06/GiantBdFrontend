"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "cn";

export interface PaginationProps {
  /** Current active page (1-indexed). */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called with the new page number when the user navigates. */
  onPageChange: (page: number) => void;
  /** Whether pagination controls should be disabled (e.g. while fetching data). */
  disabled?: boolean;
  /** Optional total items count for displaying "Showing X to Y of Z". */
  totalItems?: number;
  /** Optional page size used with totalItems. */
  pageSize?: number;
  className?: string;
}

/**
 * Reusable pagination bar.
 *
 * Layout:
 *   [Showing 1 to 10 of 100]  < Previous   1  2  ...  24   Next >   Go To [ ___ ] of 24  Go
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  totalItems,
  pageSize = 10,
  className,
}: PaginationProps) {
  const [goToValue, setGoToValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const safeTotalPages = Math.max(1, totalPages);
  const clamp = (n: number) => Math.min(Math.max(n, 1), safeTotalPages);

  const handlePrev = () => {
    if (disabled || currentPage <= 1) return;
    onPageChange(clamp(currentPage - 1));
  };

  const handleNext = () => {
    if (disabled || currentPage >= safeTotalPages) return;
    onPageChange(clamp(currentPage + 1));
  };

  const handleGo = () => {
    if (disabled) return;
    const parsed = parseInt(goToValue, 10);
    if (!isNaN(parsed)) {
      onPageChange(clamp(parsed));
      setGoToValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGo();
  };

  /**
   * Build the visible page numbers.
   */
  const buildPages = (): (number | "...")[] => {
    if (safeTotalPages <= 5) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>();
    pages.add(1);
    pages.add(safeTotalPages);
    pages.add(clamp(currentPage));
    pages.add(clamp(currentPage - 1));
    pages.add(clamp(currentPage + 1));

    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: (number | "...")[] = [];

    sorted.forEach((page, idx) => {
      if (idx > 0 && page - sorted[idx - 1] > 1) {
        result.push("...");
      }
      result.push(page);
    });

    return result;
  };

  const pages = buildPages();

  const startItem = totalItems !== undefined && totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems !== undefined ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div
      className={cn(
        "w-full flex flex-wrap items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm",
        totalItems !== undefined && "justify-between",
        className
      )}
    >
      {/* Optional Results Summary */}
      {totalItems !== undefined && (
        <div className="text-xs text-slate-500 whitespace-nowrap">
          Showing{" "}
          <span className="font-semibold text-slate-700">{startItem}</span> to{" "}
          <span className="font-semibold text-slate-700">{endItem}</span> of{" "}
          <span className="font-semibold text-slate-700">{totalItems}</span> records
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center gap-1">
        {/* Previous */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={disabled || currentPage <= 1}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-sm text-slate-400 select-none"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                key={page}
                disabled={disabled}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
                  page === currentPage
                    ? "bg-[#4B5EAA] text-white shadow"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={handleNext}
          disabled={disabled || currentPage >= safeTotalPages}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="size-4" />
        </button>

        {/* Go To */}
        <div className="ml-2 flex items-center gap-2 border-l border-slate-200 pl-3">
          <span className="text-sm text-slate-500 whitespace-nowrap">Go To</span>
          <input
            ref={inputRef}
            type="number"
            min={1}
            max={safeTotalPages}
            disabled={disabled}
            value={goToValue}
            onChange={(e) => setGoToValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-12 rounded-lg border border-slate-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5EAA]/40 disabled:bg-slate-50 disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-sm text-slate-500 whitespace-nowrap">
            of {safeTotalPages}
          </span>
          <button
            type="button"
            disabled={disabled || !goToValue}
            onClick={handleGo}
            className="rounded-lg bg-[#4B5EAA] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#3d4f96] active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
