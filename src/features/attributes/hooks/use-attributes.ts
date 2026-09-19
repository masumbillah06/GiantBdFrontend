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
  restoreCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  createColor,
  updateColor,
  deleteColor,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  createZone,
  updateZone,
  deleteZone,
  createSubZone,
  updateSubZone,
  deleteSubZone,
  createRack,
  createBulkRacks,
  updateRack,
  deleteRack,
} from "../services/attributes.service";
import type {
  CreateCategoryInput,
  CreateSubCategoryInput,
  CreateMaterialInput,
  CreateColorInput,
  CreateWarehouseInput,
  CreateZoneInput,
  CreateSubZoneInput,
  CreateRackInput,
  CreateBulkRacksInput,
} from "../types/attribute.types";

// ==========================================
// CATEGORIES
// ==========================================

export function useCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "categories", params],
    queryFn: () => getCategories(params),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "categories"] }),
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "categories"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryInput> }) =>
      updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "categories"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "categories"] }),
  });
  const restoreMut = useMutation({
    mutationFn: (id: string) => restoreCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "categories"] }),
  });
  return { createMut, updateMut, deleteMut, restoreMut };
}

// ==========================================
// SUB CATEGORIES
// ==========================================

export function useSubCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "sub-categories", params],
    queryFn: () => getSubCategories(params),
  });
}

export function useCreateSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubCategoryInput) => createSubCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "sub-categories"] }),
  });
}

export function useSubCategoryMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (data: CreateSubCategoryInput) => createSubCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "sub-categories"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSubCategoryInput> }) =>
      updateSubCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "sub-categories"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteSubCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "sub-categories"] }),
  });
  return { createMut, updateMut, deleteMut };
}

// ==========================================
// MATERIALS
// ==========================================

export function useMaterials(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "materials", params],
    queryFn: () => getMaterials(params),
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMaterialInput) => createMaterial(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "materials"] }),
  });
}

export function useMaterialMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (data: CreateMaterialInput) => createMaterial(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "materials"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMaterialInput> }) =>
      updateMaterial(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "materials"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteMaterial(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "materials"] }),
  });
  return { createMut, updateMut, deleteMut };
}

// ==========================================
// COLORS
// ==========================================

export function useColors(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "colors", params],
    queryFn: () => getColors(params),
  });
}

export function useCreateColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateColorInput) => createColor(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "colors"] }),
  });
}

export function useColorMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (data: CreateColorInput) => createColor(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "colors"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateColorInput> }) =>
      updateColor(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "colors"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteColor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "colors"] }),
  });
  return { createMut, updateMut, deleteMut };
}

// ==========================================
// WAREHOUSES
// ==========================================

export function useWarehouses(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "warehouses", params],
    queryFn: () => getWarehouses(params),
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWarehouseInput) => createWarehouse(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "warehouses"] }),
  });
}

export function useWarehouseMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (data: CreateWarehouseInput) => createWarehouse(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "warehouses"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWarehouseInput> }) =>
      updateWarehouse(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "warehouses"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "warehouses"] }),
  });
  return { createMut, updateMut, deleteMut };
}

// ==========================================
// ZONES
// ==========================================

export function useZones(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "zones", params],
    queryFn: () => getZones(params),
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateZoneInput) => createZone(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "zones"] }),
  });
}

export function useZoneMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (data: CreateZoneInput) => createZone(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "zones"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateZoneInput> }) =>
      updateZone(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "zones"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteZone(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "zones"] }),
  });
  return { createMut, updateMut, deleteMut };
}

// ==========================================
// SUB ZONES
// ==========================================

export function useSubZones(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "sub-zones", params],
    queryFn: () => getSubZones(params),
  });
}

export function useCreateSubZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubZoneInput) => createSubZone(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "sub-zones"] }),
  });
}

export function useSubZoneMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (data: CreateSubZoneInput) => createSubZone(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "sub-zones"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSubZoneInput> }) =>
      updateSubZone(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "sub-zones"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteSubZone(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "sub-zones"] }),
  });
  return { createMut, updateMut, deleteMut };
}

// ==========================================
// RACKS
// ==========================================

export function useRacks(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "racks", params],
    queryFn: () => getRacks(params),
  });
}

export function useCreateRack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRackInput) => createRack(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "racks"] }),
  });
}

export function useRackMutations() {
  const queryClient = useQueryClient();
  const createMut = useMutation({
    mutationFn: (data: CreateRackInput) => createRack(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "racks"] }),
  });
  const createBulkMut = useMutation({
    mutationFn: (data: CreateBulkRacksInput) => createBulkRacks(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "racks"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRackInput> }) =>
      updateRack(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "racks"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteRack(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attributes", "racks"] }),
  });
  return { createMut, createBulkMut, updateMut, deleteMut };
}

// ==========================================
// LOCATIONS
// ==========================================

export function useLocations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["attributes", "locations", params],
    queryFn: () => getLocations(params),
  });
}
