// Domain entity types for the FG Reports feature

export interface DeliverySummaryRow {
  id: number;
  lcNo: string;
  poNo: string;
  buyer: string;
  shipDate: string;
  quantity: number;
  status: string;
}

export interface WeeklyDeliveryRow {
  id: number;
  week: string;
  productName: string;
  quantity: number;
  destination: string;
}

export interface MonthlyDeliveryRow {
  id: number;
  month: string;
  productName: string;
  quantity: number;
  destination: string;
}

export interface StockAgingRow {
  id: number;
  batchId: string;
  productName: string;
  stockInDate: string;
  ageDays: number;
  quantity: number;
  zone: string;
}
