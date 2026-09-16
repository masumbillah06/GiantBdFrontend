/**
 * Dashboard service — currently returns mock data.
 * When the API is ready, replace each function body with an apiGet() call.
 */
import type { StockInRow, RequisitionRow } from "../types/dashboard.types";
import { stockInData, requisitionData } from "@/lib/mock-data/dashboard/dashboard.mock";

export async function getDashboardStockIn(): Promise<StockInRow[]> {
  // TODO: replace with apiGet<StockInRow[]>(API.dashboard.recentStockIn)
  return stockInData;
}

export async function getDashboardRequisitions(): Promise<RequisitionRow[]> {
  // TODO: replace with apiGet<RequisitionRow[]>(API.dashboard.requisitions)
  return requisitionData;
}

