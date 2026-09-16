// Domain entity types for the Dashboard feature

export type StockInRow = {
  id: number;
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
  id: number;
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
