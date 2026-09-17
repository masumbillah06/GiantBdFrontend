import type { Status } from '@/features/auth/types/auth.types';
import type { CategoryRecord, SubCategoryRecord, MaterialRecord, ColorRecord } from '@/features/attributes/types/attribute.types';

export type ProductGender =
  | 'MALE'
  | 'LADY'
  | 'KIDS'
  | 'JUNIOR'
  | 'TWIN_JUNIOR';

export type UnitOfMeasurement = 'PAIR' | 'LEFT' | 'RIGHT';
export type PackingType = 'POLY_BAG';
export type MasterProductLabel = 'verified' | 'warning';

// Backend Prisma Entity Schema
export interface BackendMasterProduct {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  categoryId: string;
  category?: CategoryRecord | null;
  subCategoryId?: string | null;
  subCategory?: SubCategoryRecord | null;
  materialId?: string | null;
  material?: MaterialRecord | null;
  status: Status;
  variantProducts?: BackendVariantProduct[];
  _count?: {
    variantProducts?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendVariantProduct {
  id: string;
  name: string;
  sku: string;
  barcode?: string | null;
  picture?: string | null;
  size: string;
  gender: ProductGender;
  colorId: string;
  color?: ColorRecord | null;
  masterProductId: string;
  masterProduct?: BackendMasterProduct | null;
  categoryId?: string | null;
  subCategoryId?: string | null;
  uom: UnitOfMeasurement;
  packingType?: PackingType;
  itemsPerPacket: number;
  costPrice?: number | null;
  sellingPrice?: number | null;
  mrp?: number | null;
  shippableQuantity: number;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}

// UI Table Row Presentation Interfaces (Backwards-compatible with current UI components)
export interface MasterProduct {
  id: string | number;
  masterProductName: string;
  masterProduct: string;
  productName: string;
  material: string;
  sku: string;
  category: string;
  subCategory: string;
  variants: number;
  label: MasterProductLabel;
  raw?: BackendMasterProduct;
}

export interface VariantProduct {
  id: string | number;
  masterProduct: string;
  material: string;
  sku: string;
  modelNo: string;
  size: string;
  color: string;
  gender: string;
  uom: string;
  productsPerPacket: number;
  status: 'active' | 'inactive';
  barcode?: string | null;
  picture?: string | null;
  raw?: BackendVariantProduct;
}

// DTOs for Mutations
export interface CreateMasterProductDTO {
  name: string;
  sku: string;
  categoryId: string;
  subCategoryId?: string;
  materialId?: string;
  description?: string;
}

export interface UpdateMasterProductDTO {
  name?: string;
  categoryId?: string;
  subCategoryId?: string;
  materialId?: string;
  description?: string;
}

export interface CreateVariantProductDTO {
  name: string;
  sku: string;
  size: string;
  colorId: string;
  gender: ProductGender;
  masterProductId: string;
  uom?: UnitOfMeasurement;
  itemsPerPacket?: number;
  costPrice?: number;
  sellingPrice?: number;
  mrp?: number;
}

export interface BulkCreateVariantDTO {
  masterProductId: string;
  colorId: string;
  gender: ProductGender;
  uom?: UnitOfMeasurement;
  itemsPerPacket?: number;
  sizes: string[];
}

// Adapters
export function adaptMasterProduct(raw: BackendMasterProduct): MasterProduct {
  const variantCount = raw._count?.variantProducts ?? raw.variantProducts?.length ?? 0;
  return {
    id: raw.id,
    masterProductName: raw.name,
    masterProduct: raw.name,
    productName: raw.name,
    sku: raw.sku,
    material: raw.material?.name || 'N/A',
    category: raw.category?.name || 'N/A',
    subCategory: raw.subCategory?.name || 'N/A',
    variants: variantCount,
    label: raw.status === 'ACTIVE' ? 'verified' : 'warning',
    raw,
  };
}

export function adaptVariantProduct(raw: BackendVariantProduct): VariantProduct {
  return {
    id: raw.id,
    masterProduct: raw.masterProduct?.name || 'N/A',
    material: raw.masterProduct?.material?.name || 'N/A',
    sku: raw.sku,
    modelNo: raw.sku,
    size: raw.size,
    color: raw.color?.name || 'N/A',
    gender: raw.gender,
    uom: raw.uom,
    productsPerPacket: raw.itemsPerPacket || 1,
    status: raw.status === 'ACTIVE' ? 'active' : 'inactive',
    barcode: raw.barcode,
    picture: raw.picture,
    raw,
  };
}
