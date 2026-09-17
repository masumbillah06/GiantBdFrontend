"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBuyers,
  getRawBuyers,
  createBuyer,
  updateBuyer,
  deleteBuyer,
  getLCs,
  createLC,
  getPOs,
  createPO,
} from "../services/crm.service";
import type {
  CustomerRecord,
  Buyer,
  CreateBuyerDTO,
  UpdateBuyerDTO,
  CreateLCDTO,
  CreatePODTO,
} from "../types/crm.types";

export function useBuyers(params?: Record<string, any>) {
  return useQuery<CustomerRecord[]>({
    queryKey: ["crm", "buyers", params],
    queryFn: () => getBuyers(params),
  });
}

export function useRawBuyers(params?: Record<string, any>) {
  return useQuery<Buyer[]>({
    queryKey: ["crm", "buyers", "raw", params],
    queryFn: () => getRawBuyers(params),
  });
}

export function useBuyerMutations() {
  const queryClient = useQueryClient();

  const createMut = useMutation({
    mutationFn: (dto: CreateBuyerDTO) => createBuyer(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm", "buyers"] }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBuyerDTO }) =>
      updateBuyer(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm", "buyers"] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteBuyer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm", "buyers"] }),
  });

  return { createMut, updateMut, deleteMut };
}

export function useLCs(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["crm", "lc", params],
    queryFn: () => getLCs(params),
  });
}

export function useLCMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (dto: CreateLCDTO) => createLC(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm", "lc"] }),
  });
  return { createMut };
}

export function usePOs(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["crm", "po", params],
    queryFn: () => getPOs(params),
  });
}

export function usePOMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (dto: CreatePODTO) => createPO(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm", "po"] }),
  });
  return { createMut };
}
