/**
 * Inventory service — currently returns mock data.
 * When the API is ready, replace each function body with an apiGet() / apiPost() call.
 * The return types and hook signatures will not need to change.
 */
import type { BatchItem, StockOutItem } from '../types/inventory.types';
import { batchMockData } from '@/lib/mock-data/inventory/batch.mock';
import { stockOutMockData } from '@/lib/mock-data/inventory/stockout-list.mock';

export async function getBatches(): Promise<BatchItem[]> {
  // TODO: replace with apiGet<BatchItem[]>(API.inventory.batches)
  return batchMockData;
}

export async function getStockOutList(): Promise<StockOutItem[]> {
  // TODO: replace with apiGet<StockOutItem[]>(API.inventory.stockOutList)
  return stockOutMockData;
}

export async function createStockIn(payload: unknown): Promise<void> {
  // TODO: replace with apiPost(API.inventory.stockIn, payload)
  console.log('[StockIn] Created:', payload);
}

export async function createStockOut(payload: unknown): Promise<void> {
  // TODO: replace with apiPost(API.inventory.stockOut, payload)
  console.log('[StockOut] Created:', payload);
}
