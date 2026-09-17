// Domain entity types for the Dashboard feature

export interface KpiMetrics {
  totalStockPairs: number;
  lowStockCount: number;
  activePoCount: number;
  poFulfillmentRate: number;
  activeLcCount: number;
  totalBuyersCount: number;
  todayStockInBatches: number;
  todayStockOutChallans: number;
}

export interface MovementTrendItem {
  month: string;
  stockIn: number;
  stockOut: number;
}

export interface PoStatusDistribution {
  name: string;
  count: number;
  color: string;
}

export interface ActiveLcItem {
  id: string;
  lcNumber: string;
  buyerName: string;
  currency?: string;
  amount?: number;
  posCount: number;
  status: string;
}

export interface PendingChallan {
  id: string;
  challanNumber: string;
  buyerName?: string;
  destination?: string;
  dispatchDate: string;
  itemsCount: number;
  status: string;
}

export interface RecentStockBatch {
  id: string;
  batchId: string;
  batchNumber?: string;
  productName: string;
  material?: string;
  colorName?: string;
  gender?: string;
  availableQty: number;
  totalQty: number;
  packetCount: number;
  locationName: string;
  poNumber?: string;
  createdAt: string;
}

export interface DashboardData {
  kpi: KpiMetrics;
  movementTrends: MovementTrendItem[];
  poDistribution: PoStatusDistribution[];
  activeLcs: ActiveLcItem[];
  pendingChallans: PendingChallan[];
  recentStocks: RecentStockBatch[];
}

export type StockInRow = {
  id: number | string;
  productName: string;
  batchNo: string;
  material: string;
  received: number;
  issued: number;
  blocked: number;
  shipable: number;
  pkgQty: number;
  agingZone: string;
  agingChange: string;
};

export type RequisitionRow = {
  id: number | string;
  labelColor: 'green' | 'purple';
  lcNo: string;
  poNo: string;
  reqType: string;
  customer: string;
  reqDate: string;
  dueDate: string;
  requester: string;
  product: number;
  quantity: number;
  status: 'Issued' | 'Received';
  actions?: Array<'clipboard' | 'package' | 'truck' | 'print'>;
};

export interface DashboardStats {
  dailyIn: number;
  weeklyIn: number;
  monthlyIn: number;
  yearlyIn: number;
  totalIn: number;
  dailyOut: number;
  weeklyOut: number;
  monthlyOut: number;
  yearlyOut: number;
  totalOut: number;
}
