"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockIn } from "../services/inventory.service";

export function useCreateStockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStockIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

