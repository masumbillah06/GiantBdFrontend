export type MasterProductLabel = 'verified' | 'warning';

export interface MasterProduct {
  id: number;
  masterProductName: string;
  masterProduct: string;
  productName: string;
  material: string;
  sku: string;
  category: string;
  subCategory: string;
  variants: number;
  label: MasterProductLabel;
}

export interface ProductRecord {
  id: number;
  name: string;
  sku: string;
  category: string;
  material: string;
  status: string;
}

export interface VariantProduct {
  id: number;
  masterProduct: string;
  material: string;
  sku: string;
  modelNo: string;
  size: string;
  color: string;
  gender: string;
  uom: string;
  productsPerPacket: number;
  status: "active" | "inactive";
}
