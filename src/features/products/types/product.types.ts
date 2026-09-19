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
  sku?: string;
  categoryId: string;
  subCategoryId: string;
  materialId: string;
  description?: string;
}

export interface UpdateMasterProductDTO {
  name?: string;
  sku?: string;
  categoryId?: string;
  subCategoryId?: string;
  materialId?: string;
  description?: string;
}

export interface CreateVariantProductDTO {
  masterProductId: string;
  size: string;
  colorId: string;
  gender: ProductGender;
  uom?: UnitOfMeasurement;
  itemsPerPacket?: number;
  packingType?: PackingType;
  name?: string;
  sku?: string;
  barcode?: string;
  costPrice?: number;
  sellingPrice?: number;
  mrp?: number;
}

export interface BulkCreateVariantDTO {
  masterProductId: string;
  colorIds?: string[];
  colorId?: string;
  sizes: string[];
  gender: ProductGender;
  uom?: UnitOfMeasurement;
  itemsPerPacket?: number;
  packingType?: PackingType;
  costPrice?: number;
  sellingPrice?: number;
  mrp?: number;
}

// Adapters
export function adaptMasterProduct(raw: BackendMasterProduct): MasterProduct {
  const variantCount = raw._count?.variantProducts ?? raw.variantProducts?.length ?? 0;
  const materialName =
    typeof raw.material === 'object' && raw.material !== null
      ? raw.material.name
      : typeof raw.material === 'string'
      ? raw.material
      : 'N/A';
  const categoryName =
    typeof raw.category === 'object' && raw.category !== null
      ? raw.category.name
      : typeof raw.category === 'string'
      ? raw.category
      : 'N/A';
  const subCategoryName =
    typeof raw.subCategory === 'object' && raw.subCategory !== null
      ? raw.subCategory.name
      : typeof raw.subCategory === 'string'
      ? raw.subCategory
      : 'N/A';

  return {
    id: raw.id,
    masterProductName: raw.name,
    masterProduct: raw.name,
    productName: raw.name,
    sku: raw.sku,
    material: materialName || 'N/A',
    category: categoryName || 'N/A',
    subCategory: subCategoryName || 'N/A',
    variants: variantCount,
    label: raw.status === 'ACTIVE' ? 'verified' : 'warning',
    raw,
  };
}

export function adaptVariantProduct(raw: BackendVariantProduct): VariantProduct {
  const masterProductName =
    typeof raw.masterProduct === 'object' && raw.masterProduct !== null
      ? raw.masterProduct.name
      : typeof raw.masterProduct === 'string'
      ? raw.masterProduct
      : 'N/A';
  const materialName =
    typeof raw.masterProduct?.material === 'object' && raw.masterProduct?.material !== null
      ? raw.masterProduct.material.name
      : typeof raw.masterProduct?.material === 'string'
      ? raw.masterProduct.material
      : 'N/A';
  const colorName =
    typeof raw.color === 'object' && raw.color !== null
      ? raw.color.name
      : typeof raw.color === 'string'
      ? raw.color
      : 'N/A';

  return {
    id: raw.id,
    masterProduct: masterProductName || 'N/A',
    material: materialName || 'N/A',
    sku: raw.sku,
    modelNo: raw.sku,
    size: raw.size,
    color: colorName || 'N/A',
    gender: raw.gender,
    uom: raw.uom,
    productsPerPacket: raw.itemsPerPacket || 1,
    status: raw.status === 'ACTIVE' ? 'active' : 'inactive',
    barcode: raw.barcode,
    picture: raw.picture,
    raw,
  };
}
