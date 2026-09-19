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
  const payload: any = {
    name: dto.name.trim(),
    code: dto.code.trim(),
  };
  if (dto.email && dto.email.trim()) payload.email = dto.email.trim();
  if (dto.phone && dto.phone.trim()) payload.phone = dto.phone.trim();
  if (dto.address && dto.address.trim()) payload.address = dto.address.trim();
  if (dto.country && dto.country.trim()) payload.country = dto.country.trim();
  if (dto.contactPerson && dto.contactPerson.trim()) payload.contactPerson = dto.contactPerson.trim();
  return apiPost<Buyer>(API.crm.buyers, payload);
}

export async function updateBuyer(id: string, dto: UpdateBuyerDTO): Promise<Buyer> {
  const payload: any = {};
  if (dto.name !== undefined && dto.name.trim()) payload.name = dto.name.trim();
  if (dto.code !== undefined && dto.code.trim()) payload.code = dto.code.trim();
  if (dto.email !== undefined) {
    if (dto.email.trim()) payload.email = dto.email.trim();
  }
  if (dto.phone !== undefined && dto.phone.trim()) payload.phone = dto.phone.trim();
  if (dto.address !== undefined && dto.address.trim()) payload.address = dto.address.trim();
  if (dto.country !== undefined && dto.country.trim()) payload.country = dto.country.trim();
  if (dto.contactPerson !== undefined && dto.contactPerson.trim()) payload.contactPerson = dto.contactPerson.trim();
  return apiPatch<Buyer>(API.crm.buyerById(id), payload);
}

export async function deleteBuyer(id: string): Promise<void> {
  return apiDelete(API.crm.buyerById(id));
}

export async function restoreBuyer(id: string): Promise<Buyer> {
  return apiPost<Buyer>(API.crm.buyerRestore(id));
}

// Letters of Credit (LC)
export async function getLCs(params?: Record<string, any>): Promise<LC[]> {
  return apiGet<LC[]>(API.crm.lc, params);
}

export async function getLCById(id: string): Promise<LC> {
  return apiGet<LC>(API.crm.lcById(id));
}

export async function createLC(dto: CreateLCDTO): Promise<LC> {
  const payload: any = {
    lcNumber: dto.lcNumber.trim(),
    buyerId: dto.buyerId,
  };
  if (dto.issueDate) payload.issueDate = new Date(dto.issueDate).toISOString();
  if (dto.expiryDate) payload.expiryDate = new Date(dto.expiryDate).toISOString();
  if (dto.shipmentDate) payload.shipmentDate = new Date(dto.shipmentDate).toISOString();
  if (dto.status) payload.status = dto.status;
  if (dto.remarks && dto.remarks.trim()) payload.remarks = dto.remarks.trim();
  return apiPost<LC>(API.crm.lc, payload);
}

export async function updateLC(id: string, dto: Partial<CreateLCDTO>): Promise<LC> {
  const payload: any = {};
  if (dto.lcNumber !== undefined && dto.lcNumber.trim()) payload.lcNumber = dto.lcNumber.trim();
  if (dto.buyerId !== undefined) payload.buyerId = dto.buyerId;
  if (dto.issueDate) payload.issueDate = new Date(dto.issueDate).toISOString();
  if (dto.expiryDate) payload.expiryDate = new Date(dto.expiryDate).toISOString();
  if (dto.shipmentDate) payload.shipmentDate = new Date(dto.shipmentDate).toISOString();
  if (dto.status) payload.status = dto.status;
  if (dto.remarks !== undefined) payload.remarks = dto.remarks.trim();
  return apiPatch<LC>(API.crm.lcById(id), payload);
}

export async function deleteLC(id: string): Promise<void> {
  return apiDelete(API.crm.lcById(id));
}

export async function restoreLC(id: string): Promise<LC> {
  return apiPost<LC>(API.crm.lcRestore(id));
}

// Purchase Orders (PO)
export async function getPOs(params?: Record<string, any>): Promise<PO[]> {
  return apiGet<PO[]>(API.crm.po, params);
}

export async function getPOById(id: string): Promise<PO> {
  return apiGet<PO>(API.crm.poById(id));
}

export async function createPO(dto: CreatePODTO): Promise<PO> {
  const payload: any = {
    poNumber: dto.poNumber.trim(),
    lcId: dto.lcId,
  };
  if (dto.buyerId) payload.buyerId = dto.buyerId;
  if (dto.orderDate) payload.orderDate = new Date(dto.orderDate).toISOString();
  if (dto.deliveryDate) payload.deliveryDate = new Date(dto.deliveryDate).toISOString();
  if (dto.remarks && dto.remarks.trim()) payload.remarks = dto.remarks.trim();
  if (dto.items && dto.items.length > 0) payload.items = dto.items;
  return apiPost<PO>(API.crm.po, payload);
}

export async function updatePO(id: string, dto: Partial<CreatePODTO>): Promise<PO> {
  const payload: any = {};
  if (dto.poNumber !== undefined && dto.poNumber.trim()) payload.poNumber = dto.poNumber.trim();
  if (dto.buyerId !== undefined) payload.buyerId = dto.buyerId;
  if (dto.lcId !== undefined) payload.lcId = dto.lcId;
  if (dto.orderDate) payload.orderDate = new Date(dto.orderDate).toISOString();
  if (dto.deliveryDate) payload.deliveryDate = new Date(dto.deliveryDate).toISOString();
  if (dto.remarks !== undefined) payload.remarks = dto.remarks.trim();
  return apiPatch<PO>(API.crm.poById(id), payload);
}

export async function addPOItems(
  id: string,
  items: { variantProductId: string; quantity: number }[]
): Promise<PO> {
  return apiPost<PO>(API.crm.poItems(id), { items });
}

export async function deletePO(id: string): Promise<void> {
  return apiDelete(API.crm.poById(id));
}

export async function restorePO(id: string): Promise<PO> {
  return apiPost<PO>(API.crm.poRestore(id));
}
