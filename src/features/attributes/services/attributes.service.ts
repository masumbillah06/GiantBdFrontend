import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api/http-client';
import { API } from '@/lib/api/endpoints';
import type {
  CategoryRecord,
  SubCategoryRecord,
  MaterialRecord,
  ColorRecord,
  WarehouseRecord,
  ZoneRecord,
  SubZoneRecord,
  RackRecord,
  StorageLocationRecord,
  CreateCategoryInput,
  CreateSubCategoryInput,
  CreateMaterialInput,
  CreateColorInput,
  CreateWarehouseInput,
  CreateZoneInput,
  CreateSubZoneInput,
  CreateRackInput,
  CreateBulkRacksInput,
} from '../types/attribute.types';

// ==========================================
// Categories
// ==========================================
export async function getCategories(params?: Record<string, unknown>): Promise<CategoryRecord[]> {
  return apiGet<CategoryRecord[]>(API.attributes.categories, params);
}

export async function getCategoryById(id: string): Promise<CategoryRecord> {
  return apiGet<CategoryRecord>(API.attributes.categoryById(id));
}

export async function createCategory(data: CreateCategoryInput): Promise<CategoryRecord> {
  // Backend CreateCategoryDTO only permits { name: string }
  const payload = {
    name: data.name.trim(),
  };
  return apiPost<CategoryRecord>(API.attributes.categories, payload);
}

export async function updateCategory(id: string, data: Partial<CreateCategoryInput>): Promise<CategoryRecord> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.status !== undefined) payload.status = data.status.toUpperCase();
  return apiPatch<CategoryRecord>(API.attributes.categoryById(id), payload);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiDelete(API.attributes.categoryById(id));
}

export async function restoreCategory(id: string): Promise<CategoryRecord> {
  return apiPost<CategoryRecord>(API.attributes.categoryRestore(id));
}

// ==========================================
// SubCategories
// ==========================================
export async function getSubCategories(params?: Record<string, unknown>): Promise<SubCategoryRecord[]> {
  return apiGet<SubCategoryRecord[]>(API.attributes.subCategories, params);
}

export async function getSubCategoryById(id: string): Promise<SubCategoryRecord> {
  return apiGet<SubCategoryRecord>(API.attributes.subCategoryById(id));
}

export async function createSubCategory(data: CreateSubCategoryInput): Promise<SubCategoryRecord> {
  // Backend CreateSubCategoryDTO only permits { name: string, categoryId: string }
  const payload = {
    name: data.name.trim(),
    categoryId: data.categoryId,
  };
  return apiPost<SubCategoryRecord>(API.attributes.subCategories, payload);
}

export async function updateSubCategory(id: string, data: Partial<CreateSubCategoryInput>): Promise<SubCategoryRecord> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
  if (data.status !== undefined) payload.status = data.status.toUpperCase();
  return apiPatch<SubCategoryRecord>(API.attributes.subCategoryById(id), payload);
}

export async function deleteSubCategory(id: string): Promise<void> {
  return apiDelete(API.attributes.subCategoryById(id));
}

// ==========================================
// Materials
// ==========================================
export async function getMaterials(params?: Record<string, unknown>): Promise<MaterialRecord[]> {
  return apiGet<MaterialRecord[]>(API.attributes.materials, params);
}

export async function getMaterialById(id: string): Promise<MaterialRecord> {
  return apiGet<MaterialRecord>(API.attributes.materialById(id));
}

export async function createMaterial(data: CreateMaterialInput): Promise<MaterialRecord> {
  // Backend CreateMaterialDTO permits { name: string, description?: string }
  const payload: Record<string, unknown> = {
    name: data.name.trim(),
  };
  if (data.description && data.description.trim()) {
    payload.description = data.description.trim();
  }
  return apiPost<MaterialRecord>(API.attributes.materials, payload);
}

export async function updateMaterial(id: string, data: Partial<CreateMaterialInput>): Promise<MaterialRecord> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.description !== undefined) payload.description = data.description.trim() || null;
  if (data.status !== undefined) payload.status = data.status.toUpperCase();
  return apiPatch<MaterialRecord>(API.attributes.materialById(id), payload);
}

export async function deleteMaterial(id: string): Promise<void> {
  return apiDelete(API.attributes.materialById(id));
}

// ==========================================
// Colors
// ==========================================
export async function getColors(params?: Record<string, unknown>): Promise<ColorRecord[]> {
  return apiGet<ColorRecord[]>(API.attributes.colors, params);
}

export async function getColorById(id: string): Promise<ColorRecord> {
  return apiGet<ColorRecord>(API.attributes.colorById(id));
}

export async function createColor(data: CreateColorInput): Promise<ColorRecord> {
  // Backend CreateColorDTO permits { name: string, code?: string, description?: string }
  const payload: Record<string, unknown> = {
    name: data.name.trim(),
  };
  if (data.code && data.code.trim()) {
    payload.code = data.code.trim();
  }
  if (data.description && data.description.trim()) {
    payload.description = data.description.trim();
  }
  return apiPost<ColorRecord>(API.attributes.colors, payload);
}

export async function updateColor(id: string, data: Partial<CreateColorInput>): Promise<ColorRecord> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.code !== undefined) payload.code = data.code.trim() || null;
  if (data.description !== undefined) payload.description = data.description.trim() || null;
  if (data.status !== undefined) payload.status = data.status.toUpperCase();
  return apiPatch<ColorRecord>(API.attributes.colorById(id), payload);
}

export async function deleteColor(id: string): Promise<void> {
  return apiDelete(API.attributes.colorById(id));
}

// ==========================================
// Warehouses
// ==========================================
export async function getWarehouses(params?: Record<string, unknown>): Promise<WarehouseRecord[]> {
  return apiGet<WarehouseRecord[]>(API.attributes.warehouses, params);
}

export async function getWarehouseById(id: string): Promise<WarehouseRecord> {
  return apiGet<WarehouseRecord>(API.attributes.warehouseById(id));
}

export async function createWarehouse(data: CreateWarehouseInput): Promise<WarehouseRecord> {
  // Backend CreateWarehouseDTO permits { name: string, code: string, description?: string }
  const payload: Record<string, unknown> = {
    name: data.name.trim(),
    code: data.code.trim(),
  };
  if (data.description && data.description.trim()) {
    payload.description = data.description.trim();
  }
  return apiPost<WarehouseRecord>(API.attributes.warehouses, payload);
}

export async function updateWarehouse(id: string, data: Partial<CreateWarehouseInput>): Promise<WarehouseRecord> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.code !== undefined) payload.code = data.code.trim();
  if (data.description !== undefined) payload.description = data.description.trim() || null;
  if (data.status !== undefined) payload.status = data.status.toUpperCase();
  return apiPatch<WarehouseRecord>(API.attributes.warehouseById(id), payload);
}

export async function deleteWarehouse(id: string): Promise<void> {
  return apiDelete(API.attributes.warehouseById(id));
}

// ==========================================
// Zones
// ==========================================
export async function getZones(params?: Record<string, unknown>): Promise<ZoneRecord[]> {
  return apiGet<ZoneRecord[]>(API.attributes.zones, params);
}

export async function getZoneById(id: string): Promise<ZoneRecord> {
  return apiGet<ZoneRecord>(API.attributes.zoneById(id));
}

export async function createZone(data: CreateZoneInput): Promise<ZoneRecord> {
  // Backend CreateZoneDTO permits { name: string, code: string, warehouseId: string, description?: string }
  const payload: Record<string, unknown> = {
    name: data.name.trim(),
    code: data.code.trim(),
    warehouseId: data.warehouseId,
  };
  if (data.description && data.description.trim()) {
    payload.description = data.description.trim();
  }
  return apiPost<ZoneRecord>(API.attributes.zones, payload);
}

export async function updateZone(id: string, data: Partial<CreateZoneInput>): Promise<ZoneRecord> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.code !== undefined) payload.code = data.code.trim();
  if (data.warehouseId !== undefined) payload.warehouseId = data.warehouseId;
  if (data.description !== undefined) payload.description = data.description.trim() || null;
  if (data.status !== undefined) payload.status = data.status.toUpperCase();
  return apiPatch<ZoneRecord>(API.attributes.zoneById(id), payload);
}

export async function deleteZone(id: string): Promise<void> {
  return apiDelete(API.attributes.zoneById(id));
}

// ==========================================
// SubZones
// ==========================================
export async function getSubZones(params?: Record<string, unknown>): Promise<SubZoneRecord[]> {
  return apiGet<SubZoneRecord[]>(API.attributes.subZones, params);
}

export async function getSubZoneById(id: string): Promise<SubZoneRecord> {
  return apiGet<SubZoneRecord>(API.attributes.subZoneById(id));
}

export async function createSubZone(data: CreateSubZoneInput): Promise<SubZoneRecord> {
  // Backend CreateSubZoneDTO permits { name: string, code: string, zoneId: string, description?: string }
  const payload: Record<string, unknown> = {
    name: data.name.trim(),
    code: data.code.trim(),
    zoneId: data.zoneId,
  };
  if (data.description && data.description.trim()) {
    payload.description = data.description.trim();
  }
  return apiPost<SubZoneRecord>(API.attributes.subZones, payload);
}

export async function updateSubZone(id: string, data: Partial<CreateSubZoneInput>): Promise<SubZoneRecord> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.code !== undefined) payload.code = data.code.trim();
  if (data.zoneId !== undefined) payload.zoneId = data.zoneId;
  if (data.description !== undefined) payload.description = data.description.trim() || null;
  if (data.status !== undefined) payload.status = data.status.toUpperCase();
  return apiPatch<SubZoneRecord>(API.attributes.subZoneById(id), payload);
}

export async function deleteSubZone(id: string): Promise<void> {
  return apiDelete(API.attributes.subZoneById(id));
}

// ==========================================
// Racks
// ==========================================
export async function getRacks(params?: Record<string, unknown>): Promise<RackRecord[]> {
  return apiGet<RackRecord[]>(API.attributes.racks, params);
}

export async function getRackById(id: string): Promise<RackRecord> {
  return apiGet<RackRecord>(API.attributes.rackById(id));
}

export async function createRack(data: CreateRackInput): Promise<RackRecord> {
  // Backend CreateRackDTO permits { name: string, code: string, subZoneId: string, description?: string }
  const payload: Record<string, unknown> = {
    name: data.name.trim(),
    code: data.code.trim(),
    subZoneId: data.subZoneId,
  };
  if (data.description && data.description.trim()) {
    payload.description = data.description.trim();
  }
  return apiPost<RackRecord>(API.attributes.racks, payload);
}

export async function createBulkRacks(data: CreateBulkRacksInput): Promise<{ count: number }> {
  return apiPost<{ count: number }>(API.attributes.racksBulk, data);
}

export async function updateRack(id: string, data: Partial<CreateRackInput>): Promise<RackRecord> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.code !== undefined) payload.code = data.code.trim();
  if (data.subZoneId !== undefined) payload.subZoneId = data.subZoneId;
  if (data.description !== undefined) payload.description = data.description.trim() || null;
  if (data.status !== undefined) payload.status = data.status.toUpperCase();
  return apiPatch<RackRecord>(API.attributes.rackById(id), payload);
}

export async function deleteRack(id: string): Promise<void> {
  return apiDelete(API.attributes.rackById(id));
}

// ==========================================
// Locations
// ==========================================
export async function getLocations(params?: Record<string, unknown>): Promise<StorageLocationRecord[]> {
  return apiGet<StorageLocationRecord[]>(API.attributes.locations, params);
}
