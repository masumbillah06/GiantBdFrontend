"use client";

import { useQuery } from "@tanstack/react-query";
import { getDeliverySummary, getWeeklyDelivery, getMonthlyDelivery } from "../services/reports.service";

export function useDeliverySummary(year = 2026) {
  return useQuery({
    queryKey: ["reports", "delivery-summary", year],
    queryFn: () => getDeliverySummary(year),
  });
}

export function useWeeklyDelivery() {
  return useQuery({
    queryKey: ["reports", "weekly-delivery"],
    queryFn: getWeeklyDelivery,
  });
}

export function useMonthlyDelivery() {
  return useQuery({
    queryKey: ["reports", "monthly-delivery"],
    queryFn: getMonthlyDelivery,
  });
}

