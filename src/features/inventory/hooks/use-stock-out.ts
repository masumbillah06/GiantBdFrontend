"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockOut } from "../services/inventory.service";

export function useCreateStockOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStockOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

