import type { CustomerRecord } from '../types/crm.types';
import { customerData } from '@/lib/mock-data/crm/buyer.mock';

export async function getBuyers(): Promise<CustomerRecord[]> {
  return customerData;
}
