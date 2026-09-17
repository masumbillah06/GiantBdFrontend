import { apiGet } from '@/lib/api/http-client';
import { API } from '@/lib/api/endpoints';
import type { DashboardData, StockInRow, RequisitionRow } from '../types/dashboard.types';
import { stockInData, requisitionData } from '@/lib/mock-data/dashboard/dashboard.mock';

export async function getDashboardMetrics(): Promise<DashboardData> {
  return apiGet<DashboardData>(API.dashboard.metrics);
}

export async function getDashboardStockIn(): Promise<StockInRow[]> {
  try {
    const metrics = await getDashboardMetrics();
    if (metrics.recentStocks && metrics.recentStocks.length > 0) {
      return metrics.recentStocks.map((rs, idx) => ({
        id: rs.id || idx,
        productName: rs.productName,
        batchNo: rs.batchNumber || rs.batchId,
        material: rs.material || 'Standard',
        received: rs.totalQty,
        issued: rs.totalQty - rs.availableQty,
        blocked: 0,
        shipable: rs.availableQty,
        pkgQty: rs.packetCount || 1,
        agingZone: rs.locationName || 'Zone A',
        agingChange: '+2.5%',
      }));
    }
  } catch (error) {
    console.warn('[DashboardService] Fallback to mock stock-in data:', error);
  }
  return stockInData;
}

export async function getDashboardRequisitions(): Promise<RequisitionRow[]> {
  try {
    const metrics = await getDashboardMetrics();
    if (metrics.pendingChallans && metrics.pendingChallans.length > 0) {
      return metrics.pendingChallans.map((pc, idx) => ({
        id: pc.id || idx,
        labelColor: idx % 2 === 0 ? 'green' : 'purple',
        lcNo: 'LC-' + (idx + 100),
        poNo: 'PO-' + (idx + 200),
        reqType: 'Challan Dispatch',
        customer: pc.buyerName || 'Direct Buyer',
        reqDate: pc.dispatchDate ? new Date(pc.dispatchDate).toLocaleDateString() : 'Today',
        dueDate: 'Flexible',
        requester: 'Dispatch Officer',
        product: pc.itemsCount || 1,
        quantity: pc.itemsCount || 10,
        status: pc.status === 'DELIVERED' ? 'Received' : 'Issued',
        actions: ['clipboard', 'package', 'print'],
      }));
    }
  } catch (error) {
    console.warn('[DashboardService] Fallback to mock requisitions data:', error);
  }
  return requisitionData;
}
