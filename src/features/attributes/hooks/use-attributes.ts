"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getColors,
  getMaterials,
  getSubCategories,
  getWarehouses,
  getZones,
  getSubZones,
  getRacks,
  getLocations,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/attributes.service";

export function useCategories(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "categories", params],
    queryFn: () => getCategories(params),
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "categories"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "categories"] }),
  });
  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "categories"] }),
  });
  return { createMut, updateMut, deleteMut };
}

export function useColors(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "colors", params],
    queryFn: () => getColors(params),
  });
}

export function useMaterials(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "materials", params],
    queryFn: () => getMaterials(params),
  });
}

export function useSubCategories(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "sub-categories", params],
    queryFn: () => getSubCategories(params),
  });
}

export function useWarehouses(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "warehouses", params],
    queryFn: () => getWarehouses(params),
  });
}

export function useZones(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "zones", params],
    queryFn: () => getZones(params),
  });
}

export function useSubZones(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "sub-zones", params],
    queryFn: () => getSubZones(params),
  });
}

export function useRacks(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "racks", params],
    queryFn: () => getRacks(params),
  });
}

export function useLocations(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["attributes", "locations", params],
    queryFn: () => getLocations(params),
  });
}
