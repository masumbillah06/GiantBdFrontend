import type { Status } from '@/features/auth/types/auth.types';
import type { BackendVariantProduct, ProductGender } from '@/features/products/types/product.types';
import type { Buyer, PO } from '@/features/crm/types/crm.types';
import type { StorageLocationRecord } from '@/features/attributes/types/attribute.types';

export type InventoryMovementType =
  | 'RECEIVED'
  | 'SALE'
  | 'TRANSFER'
  | 'RETURN'
  | 'DAMAGE'
  | 'ADJUSTMENT';

export type StockOutType =
  | 'PO_SHIPMENT'
  | 'DIRECT_SALE'
  | 'SAMPLE_DISPATCH'
  | 'DAMAGE_SCRAP'
  | 'INTERNAL_TRANSFER';

export type StockOutStatus =
  | 'ISSUED'
  | 'DELIVERED'
  | 'PAYMENT_RECEIVED'
  | 'CANCELLED';

// Backend Prisma Entity Schemas
export interface BackendBatch {
  id: string;
  batch_id: string;
  batch_number?: string | null;
  productionDate: string;
  expirationDate: string;
  poId?: string | null;
  po?: PO | null;
  items?: BackendBatchItem[];
  documents?: DocumentItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendBatchItem {
  id: string;
  batchId: string;
  batch?: BackendBatch;
  productId: string;
  product?: BackendVariantProduct;
  locationId: string;
  location?: StorageLocationRecord;
  availableQty: number;
  reservedQty: number;
  totalQuantity: number;
  itemsPerPacket: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendStockOut {
  id: string;
  challanNumber: string;
  type: StockOutType;
  status: StockOutStatus;
  partialSequence?: number;
  poId?: string | null;
  po?: PO | null;
  buyerId?: string | null;
  buyer?: Buyer | null;
  destination?: string | null;
  dispatchDate: string;
  note?: string | null;
  receiptDocument?: string | null;
  issuerId?: string;
  issuer?: {
    id: string;
    name: string;
    signature?: string | null;
  };
  items?: BackendStockOutItem[];
  itemsCount?: number;
  totalQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendStockOutItem {
  id: string;
  stockOutId: string;
  variantProductId: string;
  variantProduct?: BackendVariantProduct;
  batchItemId: string;
  batchItem?: BackendBatchItem;
  quantity: number;
}

export interface InventoryMovement {
  id: string;
  type: InventoryMovementType;
  quantity: number;
  inventoryBatchItemId: string;
  inventoryBatchItem?: BackendBatchItem;
  fromLocationId?: string | null;
  toLocationId?: string | null;
  referenceId?: string | null;
  note?: string | null;
  createdAt: string;
}

// Payload DTOs
export interface StockInItemPayload {
  variantProductId?: string;
  size?: string;
  gender?: ProductGender;
  colorId?: string;
  receivedQty: number;
  itemsPerPacket?: number;
  locationId: string;
}

export interface StockInPayload {
  masterProductId?: string;
  productionDate: string;
  expirationDate?: string;
  batch_id?: string;
  batch_number?: string;
  poId?: string;
  note?: string;
  defaultLocationId?: string;
  items: StockInItemPayload[];
}

export interface StockOutPayload {
  type: StockOutType;
  poId?: string;
  buyerId?: string;
  destination?: string;
  dispatchDate?: string;
  note?: string;
  items: { batchItemId: string; issueQty: number }[];
}

// Presentation interfaces for UI Tables
export interface FGProductItem {
  id: string | number;
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
  path?: string;
  name?: string;
  fileName?: string;
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
  id: string | number;
  name: string;
  masterProduct: string;
  color: string;
  gender: string;
  availableSizes: string[];
  selectedSizes: string[];
  quantities?: Record<string, number>;
}

export interface BatchItem {
  id: string | number;
  batchId: string;
  batchNumber?: string;
  stockInDate: string;
  productName: string;
  sku?: string;
  color?: string;
  colorCode?: string;
  gender?: string;
  material: string;
  quantity: number;
  inHandQty?: number;
  receivedQty?: number;
  cartons?: number;
  itemsPerPacket?: number;
  pkgQty: number;
  createdBy: string;
  productionDate: string;
  ageInDays?: number | null;
  locationCode?: string;
  raw?: BackendBatch;
}

export interface StockOutItem {
  id: string | number;
  lcNo: string;
  poNo: string;
  buyer: string;
  toLocation: string;
  stockOutDate: string;
  status: 'Issued' | 'Received' | 'Pending' | 'Delivered' | 'Cancelled' | string;
  productCount: number;
  totalQty: number;
  createdBy: string;
  challanNumber?: string;
  raw?: BackendStockOut;
}

// Adapters
export function adaptBatchToItem(batch: BackendBatch): BatchItem {
  const itemsList: any[] = (batch as any).batchItems || batch.items || [];
  const firstItem = itemsList[0];

  const summary = (batch as any).summary;
  const totalReceived =
    summary?.totalReceivedQty ??
    itemsList.reduce((sum, item) => sum + (item.receivedQty ?? item.totalQuantity ?? 0), 0);
  const totalInHand =
    summary?.totalAvailableQty ??
    itemsList.reduce((sum, item) => sum + (item.availableQty ?? item.totalQuantity ?? 0), 0);
  const totalCartons =
    summary?.totalPackets ??
    itemsList.reduce((sum, item) => sum + (item.packetCount ?? 0), 0);

  const colorName = firstItem?.product?.color?.name || 'Standard';
  const colorCode = firstItem?.product?.color?.code;
  const gender = firstItem?.product?.gender || 'MALE';
  const material =
    firstItem?.product?.masterProduct?.material?.name ||
    (typeof firstItem?.product?.masterProduct?.material === 'string'
      ? firstItem.product.masterProduct.material
      : 'Standard');
  const productName =
    firstItem?.product?.masterProduct?.name ||
    firstItem?.product?.name ||
    'Finished Goods';

  // Calculate age in days
  const prodDate = batch.productionDate ? new Date(batch.productionDate) : null;
  const ageInDays =
    prodDate && !isNaN(prodDate.getTime())
      ? Math.max(0, Math.floor((Date.now() - prodDate.getTime()) / (1000 * 60 * 60 * 24)))
      : null;

  return {
    id: batch.id,
    batchId: batch.batch_id || batch.batch_number || String(batch.id).slice(0, 8),
    batchNumber: batch.batch_number || undefined,
    productName,
    sku: firstItem?.product?.sku || firstItem?.product?.masterProduct?.sku,
    color: colorName,
    colorCode,
    gender,
    material,
    quantity: totalReceived,
    inHandQty: totalInHand,
    receivedQty: totalReceived,
    cartons: totalCartons || Math.ceil(totalReceived / (firstItem?.itemsPerPacket || 10)) || 1,
    itemsPerPacket: firstItem?.itemsPerPacket || 1,
    pkgQty: totalCartons || 1,
    createdBy: 'Warehouse Team',
    productionDate: batch.productionDate ? new Date(batch.productionDate).toLocaleDateString() : 'N/A',
    ageInDays,
    stockInDate: batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A',
    locationCode: firstItem?.location?.code || firstItem?.location?.rack?.code,
    raw: batch,
  };
}

export function adaptStockOutToItem(so: BackendStockOut): StockOutItem {
  let displayStatus = 'Issued';
  if (so.status === 'DELIVERED') displayStatus = 'Received';
  else if (so.status === 'PAYMENT_RECEIVED') displayStatus = 'Delivered';
  else if (so.status === 'CANCELLED') displayStatus = 'Cancelled';

  return {
    id: so.id,
    lcNo: so.po?.lc?.lcNumber || 'N/A',
    poNo: so.po?.poNumber || 'N/A',
    buyer: so.buyer?.name || 'Direct / Warehouse',
    toLocation: so.destination || 'Customer Store',
    stockOutDate: so.dispatchDate ? new Date(so.dispatchDate).toLocaleDateString() : 'N/A',
    status: displayStatus,
    productCount: so.itemsCount || so.items?.length || 0,
    totalQty: so.totalQuantity || so.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0,
    createdBy: so.issuer?.name || 'Dispatch Officer',
    challanNumber: so.challanNumber,
    raw: so,
  };
}
