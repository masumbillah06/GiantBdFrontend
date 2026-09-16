import type { MasterProduct, VariantProduct } from '../types/product.types';
import { masterProducts } from '@/lib/mock-data/products/master-products.mock';
import { variantProducts } from '@/lib/mock-data/products/variant-products.mock';

export async function getMasterProducts(): Promise<MasterProduct[]> {
  // TODO: replace with apiGet<MasterProduct[]>(API.products.master)
  return masterProducts;
}

export async function getVariantProducts(): Promise<VariantProduct[]> {
  // TODO: replace with apiGet<VariantProduct[]>(API.products.variants)
  return variantProducts;
}
