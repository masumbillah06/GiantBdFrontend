import { api, apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api/http-client';
import { API } from '@/lib/api/endpoints';
import {
  type Buyer,
  type CreateBuyerDTO,
  type UpdateBuyerDTO,
  type LC,
  type CreateLCDTO,
  type PO,
  type CreatePODTO,
  type CustomerRecord,
  adaptBuyerToCustomer,
} from '../types/crm.types';

// Buyers
export async function getBuyers(params?: Record<string, any>): Promise<CustomerRecord[]> {
  try {
    const res = await api.get(API.crm.buyers, { params });
    const rawList: Buyer[] = res.data?.data || [];
    return rawList.map(adaptBuyerToCustomer);
  } catch (error) {
    console.warn('[CRMService] Failed to fetch buyers:', error);
    return [];
  }
}

export async function getRawBuyers(params?: Record<string, any>): Promise<Buyer[]> {
  return apiGet<Buyer[]>(API.crm.buyers, params);
}

export async function getBuyerById(id: string): Promise<Buyer> {
  return apiGet<Buyer>(API.crm.buyerById(id));
}

export async function createBuyer(dto: CreateBuyerDTO): Promise<Buyer> {
  return apiPost<Buyer>(API.crm.buyers, dto);
}

export async function updateBuyer(id: string, dto: UpdateBuyerDTO): Promise<Buyer> {
  return apiPatch<Buyer>(API.crm.buyerById(id), dto);
}

export async function deleteBuyer(id: string): Promise<void> {
  return apiDelete(API.crm.buyerById(id));
}

// Letters of Credit (LC)
export async function getLCs(params?: Record<string, any>): Promise<LC[]> {
  return apiGet<LC[]>(API.crm.lc, params);
}

export async function getLCById(id: string): Promise<LC> {
  return apiGet<LC>(API.crm.lcById(id));
}

export async function createLC(dto: CreateLCDTO): Promise<LC> {
  return apiPost<LC>(API.crm.lc, dto);
}

// Purchase Orders (PO)
export async function getPOs(params?: Record<string, any>): Promise<PO[]> {
  return apiGet<PO[]>(API.crm.po, params);
}

export async function getPOById(id: string): Promise<PO> {
  return apiGet<PO>(API.crm.poById(id));
}

export async function createPO(dto: CreatePODTO): Promise<PO> {
  return apiPost<PO>(API.crm.po, dto);
}

export async function addPOItems(
  id: string,
  items: { variantProductId: string; quantity: number }[]
): Promise<PO> {
  return apiPost<PO>(API.crm.poItems(id), { items });
}
