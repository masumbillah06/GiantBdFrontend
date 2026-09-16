"use client";

import { useQuery } from "@tanstack/react-query";
import { getStockOutList } from "../services/inventory.service";
import type { StockOutItem } from "../types/inventory.types";

export function useStockOutList() {
  return useQuery<StockOutItem[]>({
    queryKey: ["inventory", "stock-out-list"],
    queryFn: getStockOutList,
  });
}

