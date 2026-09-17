import { api, apiGet, apiPost, apiPatch, apiUpload } from '@/lib/api/http-client';
import { API } from '@/lib/api/endpoints';
import {
  type BackendBatch,
  type BackendStockOut,
  type BatchItem,
  type StockOutItem,
  type StockInPayload,
  type StockOutPayload,
  type InventoryMovement,
  adaptBatchToItem,
  adaptStockOutToItem,
} from '../types/inventory.types';

// Batches
export async function getBatches(params?: Record<string, any>): Promise<BatchItem[]> {
  try {
    const res = await api.get(API.inventory.batches, { params });
    const rawList: BackendBatch[] = res.data?.data || [];
    return rawList.map(adaptBatchToItem);
  } catch (error) {
    console.warn('[InventoryService] Failed to fetch batches:', error);
    return [];
  }
}

export async function getRawBatches(params?: Record<string, any>): Promise<BackendBatch[]> {
  return apiGet<BackendBatch[]>(API.inventory.batches, params);
}

export async function getBatchById(id: string): Promise<BackendBatch> {
  return apiGet<BackendBatch>(API.inventory.batchById(id));
}

// Stock Out List
export async function getStockOutList(params?: Record<string, any>): Promise<StockOutItem[]> {
  try {
    const res = await api.get(API.inventory.stockOut, { params });
    const rawList: BackendStockOut[] = res.data?.data || [];
    return rawList.map(adaptStockOutToItem);
  } catch (error) {
    console.warn('[InventoryService] Failed to fetch stock out list:', error);
    return [];
  }
}

export async function getRawStockOutList(params?: Record<string, any>): Promise<BackendStockOut[]> {
  return apiGet<BackendStockOut[]>(API.inventory.stockOut, params);
}

export async function getStockOutById(id: string): Promise<BackendStockOut> {
  return apiGet<BackendStockOut>(API.inventory.stockOutById(id));
}

// Stock In
export async function previewStockIn(query: {
  masterProductId?: string;
  colorId?: string;
  gender?: string;
}): Promise<any> {
  return apiGet(API.inventory.stockInPreview, query);
}

export async function createStockIn(
  payload: StockInPayload,
  documentFile?: File
): Promise<any> {
  if (documentFile) {
    const formData = new FormData();
    if (payload.masterProductId) formData.append('masterProductId', payload.masterProductId);
    formData.append('productionDate', payload.productionDate);
    if (payload.expirationDate) formData.append('expirationDate', payload.expirationDate);
    if (payload.batch_id) formData.append('batch_id', payload.batch_id);
    if (payload.batch_number) formData.append('batch_number', payload.batch_number);
    if (payload.poId) formData.append('poId', payload.poId);
    if (payload.note) formData.append('note', payload.note);
    if (payload.defaultLocationId) formData.append('defaultLocationId', payload.defaultLocationId);
    formData.append('items', JSON.stringify(payload.items));
    formData.append('document', documentFile);

    return apiUpload(API.inventory.stockIn, formData);
  }

  return apiPost(API.inventory.stockIn, payload);
}

// Stock Out Operations
export async function previewStockOutByPo(poId: string): Promise<any> {
  return apiGet(API.inventory.stockOutPreviewPo(poId));
}

export async function createStockOut(payload: StockOutPayload): Promise<BackendStockOut> {
  return apiPost<BackendStockOut>(API.inventory.stockOut, payload);
}

export async function updateStockOutStatus(
  id: string,
  status: 'DELIVERED' | 'PAYMENT_RECEIVED',
  note?: string,
  receiptDocument?: File
): Promise<BackendStockOut> {
  if (receiptDocument) {
    const formData = new FormData();
    formData.append('status', status);
    if (note) formData.append('note', note);
    formData.append('receiptDocument', receiptDocument);
    return apiUpload(API.inventory.stockOutStatus(id), formData, 'PATCH');
  }

  return apiPatch(API.inventory.stockOutStatus(id), { status, note });
}

export async function cancelStockOut(id: string, note?: string): Promise<any> {
  return apiPost(API.inventory.stockOutCancel(id), { note });
}

// Live Stock & Movements
export async function getStockOverview(params?: Record<string, any>): Promise<any> {
  return apiGet(API.inventory.stock, params);
}

export async function getMovements(params?: Record<string, any>): Promise<InventoryMovement[]> {
  return apiGet<InventoryMovement[]>(API.inventory.movements, params);
}
