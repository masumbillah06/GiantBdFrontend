"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStockOut,
  previewStockOutByPo,
  updateStockOutStatus,
  cancelStockOut,
} from "../services/inventory.service";
import type { StockOutPayload } from "../types/inventory.types";

export function usePreviewStockOutByPo(poId: string) {
  return useQuery({
    queryKey: ["inventory", "stock-out-preview-po", poId],
    queryFn: () => previewStockOutByPo(poId),
    enabled: Boolean(poId),
  });
}

export function useCreateStockOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockOutPayload) => createStockOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useStockOutStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
      receiptDocument,
    }: {
      id: string;
      status: 'DELIVERED' | 'PAYMENT_RECEIVED';
      note?: string;
      receiptDocument?: File;
    }) => updateStockOutStatus(id, status, note, receiptDocument),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

export function useCancelStockOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      cancelStockOut(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
