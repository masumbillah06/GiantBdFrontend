"use client";

import React, { useState, useMemo } from "react";
import { DeliveryFilterBar, type DeliveryFilterState } from "./filter-bar";
import { PeriodSelector } from "@/components/ui/period-selector";
import {
  PeriodicMatrixTable,
  type DeliveryPeriodMode,
  type GenericDeliveryRecord,
} from "./periodic-matrix-table";
import {
  MONTHS_LIST,
  MONTHLY_DELIVERY_ITEMS,
  MONTHLY_FILTER_OPTIONS,
  type MonthInfo,
  type MonthlyDeliveryItem,
} from "@/lib/mock-data/reports/monthly-delivery.mock";
import {
  WEEKS_LIST,
  DELIVERY_ITEMS,
  FILTER_OPTIONS,
  type WeekInfo,
  type DeliveryItem,
} from "@/lib/mock-data/reports/weekly-delivery.mock";
import { cn } from "@/lib/utils";

export type DeliveryMode = DeliveryPeriodMode;

export interface DeliveryFilterOptionsConfig {
  products?: string[];
  materials?: string[];
  buyers?: string[];
  colors?: string[];
  years?: number[];
}

export interface PeriodicDeliveryProps<T extends object = GenericDeliveryRecord> {
  /**
   * Reporting mode: "monthly" | "weekly". Defaults to "monthly".
   */
  mode?: DeliveryMode;

  /**
   * Whether to display an inline tab switcher between Monthly and Weekly views.
   */
  allowModeSwitch?: boolean;

  /**
   * Initial active period ID (e.g. "09" for September or "WK-36" for Week 36).
   */
  initialPeriodId?: string;

  /**
   * Controlled dataset (e.g. from an API response). Takes precedence over initialData.
   */
  data?: T[];

  /**
   * Initial dataset when uncontrolled. Defaults to preset mock items for the selected mode.
   */
  initialData?: T[];

  /**
   * Loading state indicator for asynchronous or API data fetching.
   */
  isLoading?: boolean;

  /**
   * Error message string or null if API request fails.
   */
  error?: string | null;

  /**
   * When true, disables client-side filtering (use when the API already performs
   * period and dropdown filtering on the backend). Defaults to false.
   */
  serverSideFiltering?: boolean;

  /**
   * When true, automatically derives dropdown options from the dataset if custom filterOptions
   * are not provided. Defaults to true when `data` is passed.
   */
  autoDeriveFilterOptions?: boolean;

  /**
   * Custom filter dropdown options overriding mode defaults.
   */
  filterOptions?: DeliveryFilterOptionsConfig;

  /**
   * Custom period list overriding default MONTHS_LIST or WEEKS_LIST.
   */
  periods?: MonthInfo[] | WeekInfo[];

  /**
   * Initial filter values.
   */
  initialFilters?: Partial<DeliveryFilterState>;

  /**
   * Callback fired when dropdown filters change (useful for server-side API queries).
   */
  onFilterChange?: (filters: DeliveryFilterState) => void;

  /**
   * Callback fired when selected period changes.
   */
  onPeriodChange?: (periodId: string) => void;

  /**
   * Callback fired when mode changes (when allowModeSwitch is enabled).
   */
  onModeChange?: (mode: DeliveryMode) => void;

  /**
   * Additional container CSS classes.
   */
  className?: string;
}

export function PeriodicDelivery<T extends object = GenericDeliveryRecord>({
  mode: propMode = "monthly",
  allowModeSwitch = false,
  initialPeriodId,
  data,
  initialData,
  isLoading = false,
  error = null,
  serverSideFiltering = false,
  autoDeriveFilterOptions,
  filterOptions,
  periods: customPeriods,
  initialFilters,
  onFilterChange,
  onPeriodChange,
  onModeChange,
  className,
}: PeriodicDeliveryProps<T>) {
  // Mode state: controlled by propMode, or locally toggleable if allowModeSwitch is true
  const [internalMode, setInternalMode] = useState<DeliveryMode>(propMode);
  const currentMode = allowModeSwitch ? internalMode : propMode;
  const isMonthly = currentMode === "monthly";

  // Resolve period list
  const periodList = useMemo(() => {
    if (customPeriods && customPeriods.length > 0) return customPeriods;
    return isMonthly ? MONTHS_LIST : WEEKS_LIST;
  }, [customPeriods, isMonthly]);

  // Separate period states for monthly and weekly to avoid synchronous setState inside useEffect
  const [selectedMonthlyId, setSelectedMonthlyId] = useState<string>(
    initialPeriodId && propMode === "monthly" ? initialPeriodId : "09"
  );
  const [selectedWeeklyId, setSelectedWeeklyId] = useState<string>(
    initialPeriodId && propMode === "weekly" ? initialPeriodId : "WK-36"
  );

  const selectedPeriodId = isMonthly ? selectedMonthlyId : selectedWeeklyId;

  // Dropdown filter state
  const [filters, setFilters] = useState<DeliveryFilterState>({
    product: "",
    material: "",
    buyer: "",
    color: "",
    year: 2026,
    ...initialFilters,
  });

  // Current active period object
  const currentPeriod = useMemo(() => {
    const found = (periodList as Array<MonthInfo | WeekInfo>).find(
      (p) => p.id === selectedPeriodId
    );
    if (found) return found;
    return isMonthly
      ? (periodList[8] as MonthInfo) || (periodList[0] as MonthInfo)
      : (periodList[periodList.length - 1] as WeekInfo) || (periodList[0] as WeekInfo);
  }, [periodList, selectedPeriodId, isMonthly]);

  // Datasets: controlled `data` takes precedence, followed by `initialData`, then mock presets
  const rawItems = useMemo(() => {
    if (data !== undefined) return data;
    if (initialData !== undefined) return initialData;
    return (isMonthly ? MONTHLY_DELIVERY_ITEMS : DELIVERY_ITEMS) as unknown as T[];
  }, [data, initialData, isMonthly]);

  // Automatically derive options from data if requested or if controlled data is provided
  const shouldAutoDerive = autoDeriveFilterOptions ?? (data !== undefined);

  // Filter options for dropdowns
  const resolvedFilterOptions = useMemo(() => {
    if (filterOptions) return filterOptions;

    if (!shouldAutoDerive) {
      const defaults = isMonthly ? MONTHLY_FILTER_OPTIONS : FILTER_OPTIONS;
      return {
        products: defaults.products,
        materials: defaults.materials,
        buyers: defaults.buyers,
        colors: defaults.colors,
        years: defaults.years,
      };
    }

    // Auto-derive unique options dynamically from rawItems
    const products = new Set<string>();
    const materials = new Set<string>();
    const buyers = new Set<string>();
    const colors = new Set<string>();
    const years = new Set<number>();

    rawItems.forEach((item) => {
      const rec = item as unknown as Record<string, unknown>;
      const prod = rec.product ?? rec.item;
      if (prod) products.add(String(prod));
      if (rec.material) materials.add(String(rec.material));
      const b = rec.buyer ?? rec.factory;
      if (b) buyers.add(String(b));
      if (rec.color) colors.add(String(rec.color));
      if (typeof rec.year === "number") years.add(rec.year);
    });

    return {
      products: Array.from(products).sort(),
      materials: Array.from(materials).sort(),
      buyers: Array.from(buyers).sort(),
      colors: Array.from(colors).sort(),
      years: Array.from(years).sort((a, b) => b - a),
    };
  }, [filterOptions, shouldAutoDerive, isMonthly, rawItems]);

  // Filter items matching active period and active dropdown filters
  const filteredItems = useMemo(() => {
    // If backend already filtered the dataset, pass directly
    if (serverSideFiltering) {
      return rawItems;
    }

    return rawItems.filter((item) => {
      const rec = item as unknown as Record<string, unknown>;

      // Period matching
      const itemPeriodId = rec.monthId ?? rec.weekId ?? rec.periodId;
      if (itemPeriodId && itemPeriodId !== selectedPeriodId) return false;

      // Year filter
      if (filters.year && rec.year !== filters.year) return false;

      // Product / Item filter
      const productVal = rec.product ?? rec.item;
      if (filters.product && productVal !== filters.product) return false;

      // Material filter
      if (filters.material && rec.material !== filters.material) return false;

      // Buyer / Factory filter
      const buyerVal = rec.buyer ?? rec.factory;
      if (filters.buyer && buyerVal !== filters.buyer) return false;

      // Color filter
      if (filters.color && rec.color !== filters.color) return false;

      return true;
    });
  }, [rawItems, serverSideFiltering, selectedPeriodId, filters]);

  const handlePeriodSelect = (periodId: string) => {
    if (isMonthly) {
      setSelectedMonthlyId(periodId);
    } else {
      setSelectedWeeklyId(periodId);
    }
    onPeriodChange?.(periodId);
  };

  const handleModeToggle = (nextMode: DeliveryMode) => {
    if (nextMode === currentMode) return;
    setInternalMode(nextMode);
    onModeChange?.(nextMode);
  };

  const handleFilterChange = (newFilters: DeliveryFilterState) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* ── Top Card: Filters & Horizontal Period Carousel ── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        {/* Optional Mode Switcher Header */}
        {allowModeSwitch && (
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="text-sm font-semibold text-slate-800">Delivery Schedule</div>
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => handleModeToggle("monthly")}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-all",
                  currentMode === "monthly"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => handleModeToggle("weekly")}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-all",
                  currentMode === "weekly"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                Weekly
              </button>
            </div>
          </div>
        )}

        {/* Row 1: Dropdown Filters */}
        <DeliveryFilterBar
          filters={filters}
          onChange={handleFilterChange}
          productOptions={resolvedFilterOptions.products}
          materialOptions={resolvedFilterOptions.materials}
          buyerOptions={resolvedFilterOptions.buyers}
          colorOptions={resolvedFilterOptions.colors}
          yearOptions={resolvedFilterOptions.years}
        />

        {/* Row 2: Period Carousel Slider */}
        {isMonthly ? (
          <PeriodSelector<MonthInfo>
            items={periodList as MonthInfo[]}
            selectedId={selectedPeriodId}
            onSelect={handlePeriodSelect}
            getItemLabel={(m) => m.name}
            getItemSubLabel={(m) => m.numberString}
            minItemWidth="min-w-[85px]"
          />
        ) : (
          <PeriodSelector<WeekInfo>
            items={periodList as WeekInfo[]}
            selectedId={selectedPeriodId}
            onSelect={handlePeriodSelect}
            getItemLabel={(wk) => wk.id}
            getItemSubLabel={(wk) => wk.dateRange}
            minItemWidth="min-w-[78px]"
          />
        )}
      </div>

      {/* ── Table Card: Grouped Delivery Matrix ── */}
      <PeriodicMatrixTable
        mode={currentMode}
        currentPeriod={currentPeriod}
        items={filteredItems}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

// Re-export aliases for developer convenience
export const DeliveryReport = PeriodicDelivery;
export type DeliveryReportProps<T extends object = GenericDeliveryRecord> =
  PeriodicDeliveryProps<T>;

// Backward-compatible helper components
export interface MonthlyDeliveryProps
  extends Omit<PeriodicDeliveryProps<MonthlyDeliveryItem>, "mode" | "initialPeriodId"> {
  initialMonthId?: string;
  initialData?: MonthlyDeliveryItem[];
}

export function MonthlyDelivery({
  initialMonthId = "09",
  initialData,
  ...rest
}: MonthlyDeliveryProps) {
  return (
    <PeriodicDelivery<MonthlyDeliveryItem>
      mode="monthly"
      initialPeriodId={initialMonthId}
      initialData={initialData}
      {...rest}
    />
  );
}

export interface WeeklyDeliveryProps
  extends Omit<PeriodicDeliveryProps<DeliveryItem>, "mode" | "initialPeriodId"> {
  initialWeekId?: string;
  initialData?: DeliveryItem[];
}

export function WeeklyDelivery({
  initialWeekId = "WK-36",
  initialData,
  ...rest
}: WeeklyDeliveryProps) {
  return (
    <PeriodicDelivery<DeliveryItem>
      mode="weekly"
      initialPeriodId={initialWeekId}
      initialData={initialData}
      {...rest}
    />
  );
}

// Backward-compatible selector components
export interface MonthSelectorProps {
  months: MonthInfo[];
  selectedMonthId: string;
  onSelectMonth: (monthId: string) => void;
}

export function MonthSelector({
  months,
  selectedMonthId,
  onSelectMonth,
}: MonthSelectorProps) {
  return (
    <PeriodSelector<MonthInfo>
      items={months}
      selectedId={selectedMonthId}
      onSelect={onSelectMonth}
      getItemLabel={(m) => m.name}
      getItemSubLabel={(m) => m.numberString}
      minItemWidth="min-w-[85px]"
    />
  );
}

export interface WeekSelectorProps {
  weeks: WeekInfo[];
  selectedWeekId: string;
  onSelectWeek: (weekId: string) => void;
}

export function WeekSelector({
  weeks,
  selectedWeekId,
  onSelectWeek,
}: WeekSelectorProps) {
  return (
    <PeriodSelector<WeekInfo>
      items={weeks}
      selectedId={selectedWeekId}
      onSelect={onSelectWeek}
      getItemLabel={(wk) => wk.id}
      getItemSubLabel={(wk) => wk.dateRange}
      minItemWidth="min-w-[78px]"
    />
  );
}

export default PeriodicDelivery;
