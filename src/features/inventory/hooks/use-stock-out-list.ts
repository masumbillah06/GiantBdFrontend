"use client";

import { useQuery } from "@tanstack/react-query";
import { getStockOutList, getRawStockOutList, getStockOutById } from "../services/inventory.service";
import type { StockOutItem } from "../types/inventory.types";

export function useStockOutList(params?: Record<string, any>) {
  return useQuery<StockOutItem[]>({
    queryKey: ["inventory", "stock-out-list", params],
    queryFn: () => getStockOutList(params),
  });
}

export function useRawStockOutList(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["inventory", "stock-out-list", "raw", params],
    queryFn: () => getRawStockOutList(params),
  });
}

export function useStockOutDetail(id: string) {
  return useQuery({
    queryKey: ["inventory", "stock-out-list", id],
    queryFn: () => getStockOutById(id),
    enabled: Boolean(id),
  });
}
