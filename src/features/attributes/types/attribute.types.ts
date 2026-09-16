export interface CategoryRecord {
  id: number;
  name: string;
  description: string;
}

export interface SubCategoryRecord {
  id: number;
  name: string;
  category: string;
  description: string;
  status: string;
}

export interface MaterialRecord {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface ColorRecord {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface WarehouseRecord {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface ZoneRecord {
  id: number;
  name: string;
  code: string;
  warehouse: string;
  description: string;
}

export interface SubZoneRecord {
  id: number;
  name: string;
  code: string;
  zone: string;
  description: string;
}

export interface RackRecord {
  id: number;
  name: string;
  code: string;
  subZone: string;
  description: string;
}
