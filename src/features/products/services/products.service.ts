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
  return apiPost<BackendMasterProduct>(API.products.master, dto);
}

export async function updateMasterProduct(
  id: string,
  dto: UpdateMasterProductDTO
): Promise<BackendMasterProduct> {
  return apiPatch<BackendMasterProduct>(API.products.masterById(id), dto);
}

export async function deleteMasterProduct(id: string): Promise<void> {
  return apiDelete(API.products.masterById(id));
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
  return apiPost<{ count: number; variants: BackendVariantProduct[] }>(
    API.products.variantBulk,
    dto
  );
}

export async function uploadVariantPicture(
  id: string,
  file: File
): Promise<BackendVariantProduct> {
  const formData = new FormData();
  formData.append('picture', file);
  return apiUpload<BackendVariantProduct>(API.products.variantPicture(id), formData);
}
