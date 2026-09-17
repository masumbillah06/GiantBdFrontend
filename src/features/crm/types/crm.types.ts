import type { Status } from '@/features/auth/types/auth.types';

export type LCStatus = 'OPEN' | 'IN_PROGRESS' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED';
export type POStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'READY_FOR_SHIPMENT'
  | 'PARTIALLY_SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Buyer {
  id: string;
  name: string;
  code: string;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  contactPerson?: string | null;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBuyerDTO {
  name: string;
  code: string;
  country?: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
}

export interface UpdateBuyerDTO {
  name?: string;
  code?: string;
  country?: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
}

export interface LC {
  id: string;
  lcNumber: string;
  buyerId: string;
  buyer?: Buyer;
  issueDate?: string;
  expiryDate: string;
  shipmentDate?: string;
  remarks?: string | null;
  status: LCStatus;
  pos?: PO[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLCDTO {
  lcNumber: string;
  buyerId: string;
  issueDate?: string;
  expiryDate: string;
  shipmentDate?: string;
  remarks?: string;
  status?: LCStatus;
}

export interface POItem {
  id: string;
  poId: string;
  variantProductId: string;
  variantProduct?: {
    id: string;
    sku: string;
    name: string;
    size: string;
    color?: { name: string };
  };
  quantity: number;
  shippedQuantity: number;
}

export interface PO {
  id: string;
  poNumber: string;
  buyerId: string;
  buyer?: Buyer;
  lcId?: string | null;
  lc?: LC | null;
  orderDate?: string;
  deliveryDate?: string;
  remarks?: string | null;
  status: POStatus;
  items?: POItem[];
  totalQuantity?: number;
  shippedQuantity?: number;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePODTO {
  poNumber: string;
  buyerId: string;
  lcId?: string;
  orderDate?: string;
  deliveryDate?: string;
  remarks?: string;
  items?: { variantProductId: string; quantity: number }[];
}

// Backwards-compatible presentation format for buyer table
export interface CustomerRecord {
  id: string | number;
  customerName: string;
  customerLocations: string;
  createdOn: string;
  lastUpdated: string;
  code?: string;
  email?: string | null;
  phone?: string | null;
  raw?: Buyer;
}

export function adaptBuyerToCustomer(buyer: Buyer): CustomerRecord {
  return {
    id: buyer.id,
    customerName: buyer.name,
    customerLocations: buyer.address || buyer.country || 'N/A',
    createdOn: buyer.createdAt ? new Date(buyer.createdAt).toLocaleDateString() : 'N/A',
    lastUpdated: buyer.updatedAt ? new Date(buyer.updatedAt).toLocaleDateString() : 'N/A',
    code: buyer.code,
    email: buyer.email,
    phone: buyer.phone,
    raw: buyer,
  };
}
