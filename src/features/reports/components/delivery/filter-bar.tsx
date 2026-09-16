"use client";

import React, { useMemo } from "react";
import { DynamicFilterBar, type FilterConfig } from "@/components/ui/dynamic-filter-bar";

export interface DeliveryFilterState {
  product: string;
  material: string;
  buyer: string;
  color: string;
  year: number;
}

// Backward-compatible type aliases
export type MonthlyFilterState = DeliveryFilterState;
export type FilterState = DeliveryFilterState;

export interface DeliveryFilterBarProps {
  filters: DeliveryFilterState;
  onChange: (filters: DeliveryFilterState) => void;
  productOptions?: string[];
  materialOptions?: string[];
  buyerOptions?: string[];
  colorOptions?: string[];
  yearOptions?: number[];
}

// Backward-compatible prop aliases
export type MonthlyFilterBarProps = DeliveryFilterBarProps;
export type FilterBarProps = DeliveryFilterBarProps;

export function DeliveryFilterBar({
  filters,
  onChange,
  productOptions = [],
  materialOptions = [],
  buyerOptions = [],
  colorOptions = [],
  yearOptions = [],
}: DeliveryFilterBarProps) {
  const config = useMemo<FilterConfig<DeliveryFilterState>[]>(
    () => [
      {
        key: "product",
        label: "Product",
        placeholder: "Filter by product...",
        options: productOptions,
        width: "min-w-[160px]",
      },
      {
        key: "material",
        label: "Material",
        placeholder: "Filter by material...",
        options: materialOptions,
        width: "min-w-[160px]",
      },
      {
        key: "buyer",
        label: "Buyer",
        placeholder: "Filter by buyer...",
        options: buyerOptions,
        width: "min-w-[160px]",
      },
      {
        key: "color",
        label: "Color",
        placeholder: "Filter by color...",
        options: colorOptions,
        width: "min-w-[150px]",
      },
      {
        key: "year",
        label: "Year",
        placeholder: "Year",
        options: yearOptions,
        type: "number",
        width: "min-w-[100px]",
      },
    ],
    [productOptions, materialOptions, buyerOptions, colorOptions, yearOptions]
  );

  return <DynamicFilterBar<DeliveryFilterState> filters={filters} config={config} onChange={onChange} />;
}

export const FilterBar = DeliveryFilterBar;
export const MonthlyFilterBar = DeliveryFilterBar;
export default DeliveryFilterBar;

