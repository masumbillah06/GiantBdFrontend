"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMasterProducts,
  getVariantProducts,
  getMasterProductsPaginated,
  getVariantProductsPaginated,
  createMasterProduct,
  updateMasterProduct,
  deleteMasterProduct,
  restoreMasterProduct,
  createVariant,
  bulkCreateVariants,
  deleteVariant,
  restoreVariant,
  uploadVariantPicture,
} from "../services/products.service";
import type {
  MasterProduct,
  VariantProduct,
  CreateMasterProductDTO,
  UpdateMasterProductDTO,
  CreateVariantProductDTO,
  BulkCreateVariantDTO,
} from "../types/product.types";

export function useMasterProducts(params?: Record<string, any>) {
  return useQuery<MasterProduct[]>({
    queryKey: ["products", "master", params],
    queryFn: () => getMasterProducts(params),
  });
}

export function useMasterProductsPaginated(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", "master", "paginated", params],
    queryFn: () => getMasterProductsPaginated(params),
  });
}

export function useVariantProducts(params?: Record<string, any>) {
  return useQuery<VariantProduct[]>({
    queryKey: ["products", "variants", params],
    queryFn: () => getVariantProducts(params),
  });
}

export function useVariantProductsPaginated(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", "variants", "paginated", params],
    queryFn: () => getVariantProductsPaginated(params),
  });
}

export function useMasterProductMutations() {
  const queryClient = useQueryClient();

  const createMut = useMutation({
    mutationFn: (dto: CreateMasterProductDTO) => createMasterProduct(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "master"] });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMasterProductDTO }) =>
      updateMasterProduct(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "master"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteMasterProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "master"] });
    },
  });

  const restoreMut = useMutation({
    mutationFn: (id: string) => restoreMasterProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "master"] });
    },
  });

  return { createMut, updateMut, deleteMut, restoreMut };
}

export function useVariantMutations() {
  const queryClient = useQueryClient();

  const createMut = useMutation({
    mutationFn: (dto: CreateVariantProductDTO) => createVariant(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "variants"] });
    },
  });

  const bulkCreateMut = useMutation({
    mutationFn: (dto: BulkCreateVariantDTO) => bulkCreateVariants(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "variants"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "variants"] });
    },
  });

  const restoreMut = useMutation({
    mutationFn: (id: string) => restoreVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "variants"] });
    },
  });

  const uploadPicMut = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadVariantPicture(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "variants"] });
    },
  });

  return { createMut, bulkCreateMut, deleteMut, restoreMut, uploadPicMut };
}
