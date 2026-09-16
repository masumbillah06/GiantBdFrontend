/**
 * Reports service — returns mock data, ready for API integration.
 */
import { getDeliverySummaryForYear } from "@/lib/mock-data/reports/delivery-summary.mock";
import { weeklyDeliveryData } from "@/lib/mock-data/reports/weekly-delivery.mock";
import { monthlyDeliveryData } from "@/lib/mock-data/reports/monthly-delivery.mock";

export async function getDeliverySummary(year = 2026) {
  // TODO: replace with apiGet(API.reports.deliverySummary + `?year=${year}`)
  return getDeliverySummaryForYear(year);
}

export async function getWeeklyDelivery() {
  // TODO: replace with apiGet(API.reports.weekllyDelivery)
  return weeklyDeliveryData;
}

export async function getMonthlyDelivery() {
  // TODO: replace with apiGet(API.reports.monthlyDelivery)
  return monthlyDeliveryData;
}
