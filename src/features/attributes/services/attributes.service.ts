import { categoryData } from '@/lib/mock-data/attributes/category.mock';
import { colorData } from '@/lib/mock-data/attributes/color.mock';

export async function getCategories() { return categoryData; }
export async function getColors() { return colorData; }
export async function getMaterials() { return (await import('@/lib/mock-data/attributes/material.mock')).materialData; }
export async function getSubCategories() { return (await import('@/lib/mock-data/attributes/sub-category.mock')).subCategoryData; }
export async function getWarehouses() { return (await import('@/lib/mock-data/attributes/warehouse.mock')).warehouseData; }
export async function getZones() { return (await import('@/lib/mock-data/attributes/zone.mock')).zoneData; }
export async function getSubZones() { return (await import('@/lib/mock-data/attributes/sub-zone.mock')).subZoneData; }
export async function getRacks() { return (await import('@/lib/mock-data/attributes/rack.mock')).rackData; }
