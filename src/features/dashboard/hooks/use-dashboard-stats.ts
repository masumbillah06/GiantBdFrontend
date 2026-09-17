"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardMetrics,
  getDashboardStockIn,
  getDashboardRequisitions,
} from "../services/dashboard.service";
import type { DashboardData, StockInRow, RequisitionRow } from "../types/dashboard.types";

export function useDashboardMetrics() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", "metrics"],
    queryFn: getDashboardMetrics,
    refetchInterval: 30000, // Refresh metrics every 30 seconds
  });
}

export function useDashboardStockIn() {
  return useQuery<StockInRow[]>({
    queryKey: ["dashboard", "stock-in"],
    queryFn: getDashboardStockIn,
  });
}

export function useDashboardRequisitions() {
  return useQuery<RequisitionRow[]>({
    queryKey: ["dashboard", "requisitions"],
    queryFn: getDashboardRequisitions,
  });
}
