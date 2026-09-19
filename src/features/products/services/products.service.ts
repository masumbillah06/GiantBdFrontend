import { api, apiGet, apiPost, apiPatch, apiDelete, apiUpload } from '@/lib/api/http-client';
import { API } from '@/lib/api/endpoints';
import type { PaginatedMeta } from '@/types/api.types';
import {
  type BackendMasterProduct,
  type BackendVariantProduct,
  type MasterProduct,
  type VariantProduct,
  type CreateMasterProductDTO,
  type UpdateMasterProductDTO,
  type CreateVariantProductDTO,
  type BulkCreateVariantDTO,
  adaptMasterProduct,
  adaptVariantProduct,
} from '../types/product.types';

export interface GetMasterProductsResult {
  items: MasterProduct[];
  raw: BackendMasterProduct[];
  meta: PaginatedMeta;
}

export interface GetVariantProductsResult {
  items: VariantProduct[];
  raw: BackendVariantProduct[];
  meta: PaginatedMeta;
}

// Master Products
export async function getMasterProducts(
  params?: Record<string, any>
): Promise<MasterProduct[]> {
  try {
    const res = await api.get(API.products.master, { params });
    const rawList: BackendMasterProduct[] =
      res.data?.data !== undefined
        ? res.data.data || []
        : Array.isArray(res.data)
        ? res.data
        : [];
    return rawList.map(adaptMasterProduct);
  } catch (error) {
    console.warn('[ProductsService] Failed to fetch master products:', error);
    return [];
  }
}

export async function getMasterProductsPaginated(
  params?: Record<string, any>
): Promise<GetMasterProductsResult> {
  const res = await api.get(API.products.master, { params });
  const rawList: BackendMasterProduct[] =
    res.data?.data !== undefined
      ? res.data.data || []
      : Array.isArray(res.data)
      ? res.data
      : [];
  const meta: PaginatedMeta = res.data?.meta || {
    total: rawList.length,
    per_page: params?.per_page || 20,
    current_page: params?.page || 1,
    total_page: 1,
  };
  return {
    items: rawList.map(adaptMasterProduct),
    raw: rawList,
    meta,
  };
}

export async function getMasterProductById(id: string): Promise<BackendMasterProduct> {
  return apiGet<BackendMasterProduct>(API.products.masterById(id));
}

export async function createMasterProduct(
  dto: CreateMasterProductDTO
): Promise<BackendMasterProduct> {
  const payload: Record<string, unknown> = {
    name: dto.name.trim(),
    categoryId: dto.categoryId,
    subCategoryId: dto.subCategoryId,
    materialId: dto.materialId,
  };
  if (dto.sku && dto.sku.trim()) {
    payload.sku = dto.sku.trim();
  }
  if (dto.description && dto.description.trim()) {
    payload.description = dto.description.trim();
  }
  return apiPost<BackendMasterProduct>(API.products.master, payload);
}

export async function updateMasterProduct(
  id: string,
  dto: UpdateMasterProductDTO
): Promise<BackendMasterProduct> {
  const payload: Record<string, unknown> = {};
  if (dto.name !== undefined) payload.name = dto.name.trim();
  if (dto.sku !== undefined) payload.sku = dto.sku.trim();
  if (dto.categoryId !== undefined) payload.categoryId = dto.categoryId;
  if (dto.subCategoryId !== undefined) payload.subCategoryId = dto.subCategoryId;
  if (dto.materialId !== undefined) payload.materialId = dto.materialId;
  if (dto.description !== undefined) payload.description = dto.description.trim() || null;
  return apiPatch<BackendMasterProduct>(API.products.masterById(id), payload);
}

export async function deleteMasterProduct(id: string): Promise<void> {
  return apiDelete(API.products.masterById(id));
}

export async function restoreMasterProduct(id: string): Promise<BackendMasterProduct> {
  return apiPost<BackendMasterProduct>(API.products.masterRestore(id));
}

// Variant Products
export async function getVariantProducts(
  params?: Record<string, any>
): Promise<VariantProduct[]> {
  try {
    const res = await api.get(API.products.variants, { params });
    const rawList: BackendVariantProduct[] =
      res.data?.data !== undefined
        ? res.data.data || []
        : Array.isArray(res.data)
        ? res.data
        : [];
    return rawList.map(adaptVariantProduct);
  } catch (error) {
    console.warn('[ProductsService] Failed to fetch variants:', error);
    return [];
  }
}

export async function getVariantProductsPaginated(
  params?: Record<string, any>
): Promise<GetVariantProductsResult> {
  const res = await api.get(API.products.variants, { params });
  const rawList: BackendVariantProduct[] =
    res.data?.data !== undefined
      ? res.data.data || []
      : Array.isArray(res.data)
      ? res.data
      : [];
  const meta: PaginatedMeta = res.data?.meta || {
    total: rawList.length,
    per_page: params?.per_page || 20,
    current_page: params?.page || 1,
    total_page: 1,
  };
  return {
    items: rawList.map(adaptVariantProduct),
    raw: rawList,
    meta,
  };
}

export async function createVariant(
  dto: CreateVariantProductDTO
): Promise<BackendVariantProduct> {
  return apiPost<BackendVariantProduct>(API.products.variants, dto);
}

export async function bulkCreateVariants(
  dto: BulkCreateVariantDTO
): Promise<{ count: number; variants: BackendVariantProduct[] }> {
  const colorIds =
    dto.colorIds && dto.colorIds.length > 0
      ? dto.colorIds
      : dto.colorId
      ? [dto.colorId]
      : [];

  const payload: Record<string, unknown> = {
    masterProductId: dto.masterProductId,
    colorIds,
    sizes: dto.sizes,
    gender: dto.gender,
    uom: dto.uom || 'PAIR',
    itemsPerPacket: Number(dto.itemsPerPacket) || 1,
  };
  if (dto.packingType) payload.packingType = dto.packingType;
  if (dto.costPrice !== undefined && dto.costPrice !== null) payload.costPrice = Number(dto.costPrice);
  if (dto.sellingPrice !== undefined && dto.sellingPrice !== null) payload.sellingPrice = Number(dto.sellingPrice);
  if (dto.mrp !== undefined && dto.mrp !== null) payload.mrp = Number(dto.mrp);

  return apiPost<{ count: number; variants: BackendVariantProduct[] }>(
    API.products.variantBulk,
    payload
  );
}

export async function deleteVariant(id: string): Promise<void> {
  return apiDelete(API.products.variantById(id));
}

export async function restoreVariant(id: string): Promise<BackendVariantProduct> {
  return apiPost<BackendVariantProduct>(API.products.variantRestore(id));
}

export async function uploadVariantPicture(
  id: string,
  file: File
): Promise<BackendVariantProduct> {
  const formData = new FormData();
  formData.append('picture', file);
  return apiUpload<BackendVariantProduct>(API.products.variantPicture(id), formData);
}
