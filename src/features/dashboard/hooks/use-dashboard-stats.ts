"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStockIn, getDashboardRequisitions } from "../services/dashboard.service";
import type { StockInRow, RequisitionRow } from "../types/dashboard.types";

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

