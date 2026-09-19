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
} from '../types/attribute.types';

// Categories
export async function getCategories(params?: Record<string, unknown>): Promise<CategoryRecord[]> {
  return apiGet<CategoryRecord[]>(API.attributes.categories, params);
}
export async function getCategoryById(id: string): Promise<CategoryRecord> {
  return apiGet<CategoryRecord>(API.attributes.categoryById(id));
}
export async function createCategory(data: CreateCategoryInput): Promise<CategoryRecord> {
  return apiPost<CategoryRecord>(API.attributes.categories, data);
}
export async function updateCategory(id: string, data: Partial<CreateCategoryInput>): Promise<CategoryRecord> {
  return apiPatch<CategoryRecord>(API.attributes.categoryById(id), data);
}
export async function deleteCategory(id: string): Promise<void> {
  return apiDelete(API.attributes.categoryById(id));
}

// SubCategories
export async function getSubCategories(params?: Record<string, unknown>): Promise<SubCategoryRecord[]> {
  return apiGet<SubCategoryRecord[]>(API.attributes.subCategories, params);
}
export async function getSubCategoryById(id: string): Promise<SubCategoryRecord> {
  return apiGet<SubCategoryRecord>(API.attributes.subCategoryById(id));
}
export async function createSubCategory(data: CreateSubCategoryInput): Promise<SubCategoryRecord> {
  return apiPost<SubCategoryRecord>(API.attributes.subCategories, data);
}
export async function updateSubCategory(id: string, data: Partial<CreateSubCategoryInput>): Promise<SubCategoryRecord> {
  return apiPatch<SubCategoryRecord>(API.attributes.subCategoryById(id), data);
}
export async function deleteSubCategory(id: string): Promise<void> {
  return apiDelete(API.attributes.subCategoryById(id));
}

// Materials
export async function getMaterials(params?: Record<string, unknown>): Promise<MaterialRecord[]> {
  return apiGet<MaterialRecord[]>(API.attributes.materials, params);
}
export async function getMaterialById(id: string): Promise<MaterialRecord> {
  return apiGet<MaterialRecord>(API.attributes.materialById(id));
}
export async function createMaterial(data: CreateMaterialInput): Promise<MaterialRecord> {
  return apiPost<MaterialRecord>(API.attributes.materials, data);
}
export async function updateMaterial(id: string, data: Partial<CreateMaterialInput>): Promise<MaterialRecord> {
  return apiPatch<MaterialRecord>(API.attributes.materialById(id), data);
}
export async function deleteMaterial(id: string): Promise<void> {
  return apiDelete(API.attributes.materialById(id));
}

// Colors
export async function getColors(params?: Record<string, unknown>): Promise<ColorRecord[]> {
  return apiGet<ColorRecord[]>(API.attributes.colors, params);
}
export async function getColorById(id: string): Promise<ColorRecord> {
  return apiGet<ColorRecord>(API.attributes.colorById(id));
}
export async function createColor(data: CreateColorInput): Promise<ColorRecord> {
  return apiPost<ColorRecord>(API.attributes.colors, data);
}
export async function updateColor(id: string, data: Partial<CreateColorInput>): Promise<ColorRecord> {
  return apiPatch<ColorRecord>(API.attributes.colorById(id), data);
}
export async function deleteColor(id: string): Promise<void> {
  return apiDelete(API.attributes.colorById(id));
}

// Warehouses
export async function getWarehouses(params?: Record<string, unknown>): Promise<WarehouseRecord[]> {
  return apiGet<WarehouseRecord[]>(API.attributes.warehouses, params);
}
export async function getWarehouseById(id: string): Promise<WarehouseRecord> {
  return apiGet<WarehouseRecord>(API.attributes.warehouseById(id));
}
export async function createWarehouse(data: CreateWarehouseInput): Promise<WarehouseRecord> {
  return apiPost<WarehouseRecord>(API.attributes.warehouses, data);
}
export async function updateWarehouse(id: string, data: Partial<CreateWarehouseInput>): Promise<WarehouseRecord> {
  return apiPatch<WarehouseRecord>(API.attributes.warehouseById(id), data);
}
export async function deleteWarehouse(id: string): Promise<void> {
  return apiDelete(API.attributes.warehouseById(id));
}

// Zones
export async function getZones(params?: Record<string, unknown>): Promise<ZoneRecord[]> {
  return apiGet<ZoneRecord[]>(API.attributes.zones, params);
}
export async function getZoneById(id: string): Promise<ZoneRecord> {
  return apiGet<ZoneRecord>(API.attributes.zoneById(id));
}
export async function createZone(data: CreateZoneInput): Promise<ZoneRecord> {
  return apiPost<ZoneRecord>(API.attributes.zones, data);
}
export async function updateZone(id: string, data: Partial<CreateZoneInput>): Promise<ZoneRecord> {
  return apiPatch<ZoneRecord>(API.attributes.zoneById(id), data);
}
export async function deleteZone(id: string): Promise<void> {
  return apiDelete(API.attributes.zoneById(id));
}

// SubZones
export async function getSubZones(params?: Record<string, unknown>): Promise<SubZoneRecord[]> {
  return apiGet<SubZoneRecord[]>(API.attributes.subZones, params);
}
export async function getSubZoneById(id: string): Promise<SubZoneRecord> {
  return apiGet<SubZoneRecord>(API.attributes.subZoneById(id));
}
export async function createSubZone(data: CreateSubZoneInput): Promise<SubZoneRecord> {
  return apiPost<SubZoneRecord>(API.attributes.subZones, data);
}
export async function updateSubZone(id: string, data: Partial<CreateSubZoneInput>): Promise<SubZoneRecord> {
  return apiPatch<SubZoneRecord>(API.attributes.subZoneById(id), data);
}
export async function deleteSubZone(id: string): Promise<void> {
  return apiDelete(API.attributes.subZoneById(id));
}

// Racks
export async function getRacks(params?: Record<string, unknown>): Promise<RackRecord[]> {
  return apiGet<RackRecord[]>(API.attributes.racks, params);
}
export async function getRackById(id: string): Promise<RackRecord> {
  return apiGet<RackRecord>(API.attributes.rackById(id));
}
export async function createRack(data: CreateRackInput): Promise<RackRecord> {
  return apiPost<RackRecord>(API.attributes.racks, data);
}
export async function updateRack(id: string, data: Partial<CreateRackInput>): Promise<RackRecord> {
  return apiPatch<RackRecord>(API.attributes.rackById(id), data);
}
export async function deleteRack(id: string): Promise<void> {
  return apiDelete(API.attributes.rackById(id));
}

// Locations
export async function getLocations(params?: Record<string, unknown>): Promise<StorageLocationRecord[]> {
  return apiGet<StorageLocationRecord[]>(API.attributes.locations, params);
}
