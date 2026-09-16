"use client";

import { useQuery } from "@tanstack/react-query";
import { getBuyers } from "../services/crm.service";
import type { CustomerRecord } from "../types/crm.types";

export function useBuyers() {
  return useQuery<CustomerRecord[]>({
    queryKey: ["crm", "buyers"],
    queryFn: getBuyers,
  });
}

