// ---------------------------------------------------------------------------
// Domain entity types for the Inventory feature
// NO mock data, NO JSX, NO React imports
// ---------------------------------------------------------------------------

export interface FGProductItem {
  id: number;
  name: string;
  masterProduct: string;
  color: string;
  gender: string;
  materialName: string;
  productsPerPacket: string;
  modelNumber: string;
  stockInDate: string;
  productionDate: string;
  expiryDate: string;
  availableSizes: string[];
  selectedSizes: string[];
}

export interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  fileSize?: string;
  uploadedAt?: string;
}

export interface BasicInfoData {
  shipmentLc: string;
  shipmentPo: string;
  buyer: string;
  toLocation: string;
  stockOutDate: string;
}

export interface StockOutProductItem {
  id: number;
  name: string;
  masterProduct: string;
  color: string;
  gender: string;
  availableSizes: string[];
  selectedSizes: string[];
  quantities?: Record<string, number>;
}

export interface BatchItem {
  id: number;
  batchId: string;
  stockInDate: string;
  productName: string;
  material: string;
  quantity: number;
  pkgQty: number;
  createdBy: string;
  productionDate: string;
}

export interface StockOutItem {
  id: number;
  lcNo: string;
  poNo: string;
  buyer: string;
  toLocation: string;
  stockOutDate: string;
  status: 'Issued' | 'Received' | 'Pending';
  productCount: number;
  totalQty: number;
  createdBy: string;
}
