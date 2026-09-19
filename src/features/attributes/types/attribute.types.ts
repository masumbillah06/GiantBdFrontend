import type { Status } from '@/features/auth/types/auth.types';

export interface CategoryRecord {
  id: string | number;
  name: string;
  description?: string | null;
  status?: Status | string;
  _count?: {
    masterProducts?: number;
    subCategories?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategoryRecord {
  id: string | number;
  name: string;
  categoryId?: string;
  category?: string | { id: string; name: string };
  description?: string | null;
  status?: Status | string;
  _count?: {
    masterProducts?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialRecord {
  id: string | number;
  name: string;
  description?: string | null;
  status?: Status | string;
  _count?: {
    masterProducts?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ColorRecord {
  id: string | number;
  name: string;
  code?: string | null; // Hex code e.g. #FF0000
  description?: string | null;
  status?: Status | string;
  _count?: {
    variantProducts?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface WarehouseRecord {
  id: string | number;
  name: string;
  code: string;
  description?: string | null;
  status?: Status | string;
  _count?: {
    zones?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ZoneRecord {
  id: string | number;
  name: string;
  code: string;
  warehouseId?: string;
  warehouse?: string | { id: string; name: string; code: string };
  description?: string | null;
  status?: Status | string;
  _count?: {
    subZones?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SubZoneRecord {
  id: string | number;
  name: string;
  code: string;
  zoneId?: string;
  zone?: string | { id: string; name: string; code: string };
  description?: string | null;
  status?: Status | string;
  _count?: {
    racks?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface RackRecord {
  id: string | number;
  name: string;
  code: string;
  subZoneId?: string;
  subZone?: string | { id: string; name: string; code: string };
  description?: string | null;
  status?: Status | string;
  _count?: {
    storageLocations?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface StorageLocationRecord {
  id: string | number;
  code: string;
  barcode?: string;
  warehouseId?: string;
  zoneId?: string;
  subZoneId?: string;
  rackId?: string;
  status?: Status | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  status?: string;
}

export interface CreateSubCategoryInput {
  name: string;
  categoryId: string;
  description?: string;
  status?: string;
}

export interface CreateMaterialInput {
  name: string;
  description?: string;
  status?: string;
}

export interface CreateColorInput {
  name: string;
  code?: string;
  description?: string;
  status?: string;
}

export interface CreateWarehouseInput {
  name: string;
  code: string;
  description?: string;
  status?: string;
}

export interface CreateZoneInput {
  name: string;
  code: string;
  warehouseId: string;
  description?: string;
  status?: string;
}

export interface CreateSubZoneInput {
  name: string;
  code: string;
  zoneId: string;
  description?: string;
  status?: string;
}

export interface CreateRackInput {
  name: string;
  code: string;
  subZoneId: string;
  description?: string;
  status?: string;
}
