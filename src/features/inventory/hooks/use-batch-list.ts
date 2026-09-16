"use client";

import { useQuery } from "@tanstack/react-query";
import { getBatches } from "../services/inventory.service";
import type { BatchItem } from "../types/inventory.types";

export function useBatchList() {
  return useQuery<BatchItem[]>({
    queryKey: ["inventory", "batches"],
    queryFn: getBatches,
  });
}

