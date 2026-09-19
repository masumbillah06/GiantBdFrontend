"use client";

import { useQuery } from "@tanstack/react-query";
import { getBatches, getRawBatches, getBatchById } from "../services/inventory.service";
import type { BatchItem } from "../types/inventory.types";

export function useBatchList(params?: Record<string, any>) {
  return useQuery<BatchItem[]>({
    queryKey: ["inventory", "batches", params],
    queryFn: () => getBatches(params),
  });
}

export function useRawBatches(
  params?: Record<string, any>,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["inventory", "batches", "raw", params],
    queryFn: () => getRawBatches(params),
    enabled: options?.enabled ?? true,
  });
}

export function useBatchDetail(id: string) {
  return useQuery({
    queryKey: ["inventory", "batches", id],
    queryFn: () => getBatchById(id),
    enabled: Boolean(id),
  });
}
