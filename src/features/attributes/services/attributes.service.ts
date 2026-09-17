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
} from '../types/attribute.types';

// Categories
export async function getCategories(params?: Record<string, any>): Promise<CategoryRecord[]> {
  return apiGet<CategoryRecord[]>(API.attributes.categories, params);
}
export async function getCategoryById(id: string): Promise<CategoryRecord> {
  return apiGet<CategoryRecord>(API.attributes.categoryById(id));
}
export async function createCategory(data: { name: string; description?: string }): Promise<CategoryRecord> {
  return apiPost<CategoryRecord>(API.attributes.categories, data);
}
export async function updateCategory(id: string, data: { name?: string; description?: string }): Promise<CategoryRecord> {
  return apiPatch<CategoryRecord>(API.attributes.categoryById(id), data);
}
export async function deleteCategory(id: string): Promise<void> {
  return apiDelete(API.attributes.categoryById(id));
}

// SubCategories
export async function getSubCategories(params?: Record<string, any>): Promise<SubCategoryRecord[]> {
  return apiGet<SubCategoryRecord[]>(API.attributes.subCategories, params);
}
export async function getSubCategoryById(id: string): Promise<SubCategoryRecord> {
  return apiGet<SubCategoryRecord>(API.attributes.subCategoryById(id));
}
export async function createSubCategory(data: { name: string; categoryId: string; description?: string }): Promise<SubCategoryRecord> {
  return apiPost<SubCategoryRecord>(API.attributes.subCategories, data);
}
export async function updateSubCategory(id: string, data: { name?: string; categoryId?: string; description?: string }): Promise<SubCategoryRecord> {
  return apiPatch<SubCategoryRecord>(API.attributes.subCategoryById(id), data);
}
export async function deleteSubCategory(id: string): Promise<void> {
  return apiDelete(API.attributes.subCategoryById(id));
}

// Materials
export async function getMaterials(params?: Record<string, any>): Promise<MaterialRecord[]> {
  return apiGet<MaterialRecord[]>(API.attributes.materials, params);
}
export async function createMaterial(data: { name: string; description?: string }): Promise<MaterialRecord> {
  return apiPost<MaterialRecord>(API.attributes.materials, data);
}
export async function updateMaterial(id: string, data: { name?: string; description?: string }): Promise<MaterialRecord> {
  return apiPatch<MaterialRecord>(API.attributes.materialById(id), data);
}
export async function deleteMaterial(id: string): Promise<void> {
  return apiDelete(API.attributes.materialById(id));
}

// Colors
export async function getColors(params?: Record<string, any>): Promise<ColorRecord[]> {
  return apiGet<ColorRecord[]>(API.attributes.colors, params);
}
export async function createColor(data: { name: string; code?: string; description?: string }): Promise<ColorRecord> {
  return apiPost<ColorRecord>(API.attributes.colors, data);
}
export async function updateColor(id: string, data: { name?: string; code?: string; description?: string }): Promise<ColorRecord> {
  return apiPatch<ColorRecord>(API.attributes.colorById(id), data);
}
export async function deleteColor(id: string): Promise<void> {
  return apiDelete(API.attributes.colorById(id));
}

// Warehouses
export async function getWarehouses(params?: Record<string, any>): Promise<WarehouseRecord[]> {
  return apiGet<WarehouseRecord[]>(API.attributes.warehouses, params);
}
export async function createWarehouse(data: { name: string; code: string; description?: string }): Promise<WarehouseRecord> {
  return apiPost<WarehouseRecord>(API.attributes.warehouses, data);
}
export async function updateWarehouse(id: string, data: { name?: string; code?: string; description?: string }): Promise<WarehouseRecord> {
  return apiPatch<WarehouseRecord>(API.attributes.warehouseById(id), data);
}
export async function deleteWarehouse(id: string): Promise<void> {
  return apiDelete(API.attributes.warehouseById(id));
}

// Zones
export async function getZones(params?: Record<string, any>): Promise<ZoneRecord[]> {
  return apiGet<ZoneRecord[]>(API.attributes.zones, params);
}
export async function createZone(data: { name: string; code: string; warehouseId: string; description?: string }): Promise<ZoneRecord> {
  return apiPost<ZoneRecord>(API.attributes.zones, data);
}
export async function updateZone(id: string, data: { name?: string; code?: string; warehouseId?: string; description?: string }): Promise<ZoneRecord> {
  return apiPatch<ZoneRecord>(API.attributes.zoneById(id), data);
}
export async function deleteZone(id: string): Promise<void> {
  return apiDelete(API.attributes.zoneById(id));
}

// SubZones
export async function getSubZones(params?: Record<string, any>): Promise<SubZoneRecord[]> {
  return apiGet<SubZoneRecord[]>(API.attributes.subZones, params);
}
export async function createSubZone(data: { name: string; code: string; zoneId: string; description?: string }): Promise<SubZoneRecord> {
  return apiPost<SubZoneRecord>(API.attributes.subZones, data);
}
export async function updateSubZone(id: string, data: { name?: string; code?: string; zoneId?: string; description?: string }): Promise<SubZoneRecord> {
  return apiPatch<SubZoneRecord>(API.attributes.subZoneById(id), data);
}
export async function deleteSubZone(id: string): Promise<void> {
  return apiDelete(API.attributes.subZoneById(id));
}

// Racks
export async function getRacks(params?: Record<string, any>): Promise<RackRecord[]> {
  return apiGet<RackRecord[]>(API.attributes.racks, params);
}
export async function createRack(data: { name: string; code: string; subZoneId: string; description?: string }): Promise<RackRecord> {
  return apiPost<RackRecord>(API.attributes.racks, data);
}
export async function updateRack(id: string, data: { name?: string; code?: string; subZoneId?: string; description?: string }): Promise<RackRecord> {
  return apiPatch<RackRecord>(API.attributes.rackById(id), data);
}
export async function deleteRack(id: string): Promise<void> {
  return apiDelete(API.attributes.rackById(id));
}

// Locations
export async function getLocations(params?: Record<string, any>): Promise<StorageLocationRecord[]> {
  return apiGet<StorageLocationRecord[]>(API.attributes.locations, params);
}
