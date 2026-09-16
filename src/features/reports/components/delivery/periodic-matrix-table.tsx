"use client";

import React, { useMemo } from "react";
import { MatrixTable, type MatrixPeriodColumn } from "@/components/ui/table/matrix-table";
import type { MonthInfo, MonthlyDeliveryItem } from "@/lib/mock-data/reports/monthly-delivery.mock";
import type { WeekInfo, DeliveryItem } from "@/lib/mock-data/reports/weekly-delivery.mock";
import { cn } from "@/lib/utils";

export type DeliveryPeriodMode = "monthly" | "weekly";

export interface GenericDeliveryRecord {
  id: string;
  material: string;
  color: string;
  year: number;
  dailyQuantities: Record<string, number>;
  buyer?: string;
  factory?: string;
  product?: string;
  item?: string;
  periodId?: string;
  monthId?: string;
  weekId?: string;
  [key: string]: unknown;
}

export interface PeriodicMatrixTableProps<T extends object = GenericDeliveryRecord> {
  mode: DeliveryPeriodMode;
  currentPeriod: MonthInfo | WeekInfo;
  items: T[];
  isLoading?: boolean;
  error?: string | null;
  primaryHeader?: string;
  secondaryHeader?: string;
  totalPosition?: "start" | "end";
  minWidth?: string;
  emptyMessage?: string;
  className?: string;
  getGroupKey?: (item: T) => string;
  getSubGroupKey?: (item: T) => string;
  getPrimaryLabel?: (item: T) => string;
  getSecondaryLabel?: (item: T) => string;
  getColorLabel?: (item: T) => string;
  getQuantities?: (item: T) => Record<string, number>;
  getItemId?: (item: T) => string;
}

export function PeriodicMatrixTable<T extends object = GenericDeliveryRecord>({
  mode,
  currentPeriod,
  items,
  isLoading = false,
  error = null,
  primaryHeader,
  secondaryHeader,
  totalPosition,
  minWidth,
  emptyMessage,
  className,
  getGroupKey,
  getSubGroupKey,
  getPrimaryLabel,
  getSecondaryLabel,
  getColorLabel,
  getQuantities,
  getItemId,
}: PeriodicMatrixTableProps<T>) {
  const isMonthly = mode === "monthly";

  // Generate columns based on mode
  const columns = useMemo<MatrixPeriodColumn[]>(() => {
    if (isMonthly) {
      const month = currentPeriod as MonthInfo;
      const count = month?.daysCount ?? 30;
      return Array.from({ length: count }, (_, i) => {
        const id = String(i + 1).padStart(2, "0");
        return {
          id,
          label: id,
          minWidth: "min-w-[42px]",
        };
      });
    }

    const week = currentPeriod as WeekInfo;
    return (
      week?.days?.map((d) => ({
        id: d.dayNumber,
        label: d.dayNumber,
        subLabel: d.dayName,
      })) ?? []
    );
  }, [isMonthly, currentPeriod]);

  // Mode defaults
  const resolvedPrimaryHeader = primaryHeader ?? (isMonthly ? "Factory" : "Buyer");
  const resolvedSecondaryHeader = secondaryHeader ?? (isMonthly ? "Item" : "Product");
  const resolvedTotalPosition = totalPosition ?? (isMonthly ? "start" : "end");
  const resolvedMinWidth = minWidth ?? (isMonthly ? "1400px" : "1000px");
  const resolvedEmptyMessage =
    emptyMessage ??
    (isMonthly
      ? "No delivery records found for this month or applied filter."
      : "No delivery records found for this week or applied filter.");

  // Error view
  if (error) {
    return (
      <div
        className={cn(
          "flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center",
          className
        )}
      >
        <div className="text-sm font-semibold text-red-700">Failed to load delivery data</div>
        <p className="mt-1 text-xs text-red-600/90">{error}</p>
      </div>
    );
  }

  // Loading skeleton view
  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full overflow-x-auto rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs",
          className
        )}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-4 w-32 bg-slate-200 animate-pulse rounded" />
          <div className="h-4 w-20 bg-slate-100 animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center gap-3">
              <div className="h-8 w-28 bg-slate-100 animate-pulse rounded" />
              <div className="h-8 w-32 bg-slate-100 animate-pulse rounded" />
              <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
              <div className="h-8 flex-1 bg-slate-100 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <MatrixTable<T>
      columns={columns}
      items={items}
      primaryHeader={resolvedPrimaryHeader}
      secondaryHeader={resolvedSecondaryHeader}
      totalPosition={resolvedTotalPosition}
      minWidth={resolvedMinWidth}
      emptyMessage={resolvedEmptyMessage}
      className={className}
      getGroupKey={
        getGroupKey ??
        ((item) => {
          const rec = item as unknown as Record<string, unknown>;
          return String(rec.material ?? "");
        })
      }
      getSubGroupKey={
        getSubGroupKey ??
        ((item) => {
          const rec = item as unknown as Record<string, unknown>;
          return String(rec.buyer ?? rec.factory ?? "");
        })
      }
      getPrimaryLabel={
        getPrimaryLabel ??
        ((item) => {
          const rec = item as unknown as Record<string, unknown>;
          return String(rec.buyer ?? rec.factory ?? "");
        })
      }
      getSecondaryLabel={
        getSecondaryLabel ??
        ((item) => {
          const rec = item as unknown as Record<string, unknown>;
          return String(rec.product ?? rec.item ?? "");
        })
      }
      getColorLabel={
        getColorLabel ??
        ((item) => {
          const rec = item as unknown as Record<string, unknown>;
          return String(rec.color ?? "");
        })
      }
      getQuantities={
        getQuantities ??
        ((item) => {
          const rec = item as unknown as Record<string, unknown>;
          return (rec.dailyQuantities as Record<string, number>) ?? {};
        })
      }
      getItemId={
        getItemId ??
        ((item) => {
          const rec = item as unknown as Record<string, unknown>;
          return String(rec.id ?? "");
        })
      }
    />
  );
}

// Convenient helper aliases
export interface MonthlyMatrixTableProps {
  currentMonth: MonthInfo;
  items: MonthlyDeliveryItem[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function MonthlyMatrixTable({
  currentMonth,
  items,
  isLoading,
  error,
  className,
}: MonthlyMatrixTableProps) {
  return (
    <PeriodicMatrixTable<MonthlyDeliveryItem>
      mode="monthly"
      currentPeriod={currentMonth}
      items={items}
      isLoading={isLoading}
      error={error}
      className={className}
    />
  );
}

export interface WeeklyMatrixTableProps {
  currentWeek: WeekInfo;
  items: DeliveryItem[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export type DeliveryMatrixTableProps = WeeklyMatrixTableProps;

export function WeeklyMatrixTable({
  currentWeek,
  items,
  isLoading,
  error,
  className,
}: WeeklyMatrixTableProps) {
  return (
    <PeriodicMatrixTable<DeliveryItem>
      mode="weekly"
      currentPeriod={currentWeek}
      items={items}
      isLoading={isLoading}
      error={error}
      className={className}
    />
  );
}

export const DeliveryMatrixTable = WeeklyMatrixTable;
export default PeriodicMatrixTable;
