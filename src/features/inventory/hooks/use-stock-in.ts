"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStockIn, previewStockIn } from "../services/inventory.service";
import type { StockInPayload } from "../types/inventory.types";

export function usePreviewStockIn(query: {
  masterProductId?: string;
  colorId?: string;
  gender?: string;
}) {
  return useQuery({
    queryKey: ["inventory", "stock-in-preview", query],
    queryFn: () => previewStockIn(query),
    enabled: Boolean(query.masterProductId),
  });
}

export function useCreateStockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, documentFile }: { payload: StockInPayload; documentFile?: File }) =>
      createStockIn(payload, documentFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
