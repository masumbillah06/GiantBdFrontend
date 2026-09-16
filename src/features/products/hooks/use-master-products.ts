"use client";

import { useQuery } from "@tanstack/react-query";
import { getMasterProducts, getVariantProducts } from "../services/products.service";
import type { MasterProduct, VariantProduct } from "../types/product.types";

export function useMasterProducts() {
  return useQuery<MasterProduct[]>({
    queryKey: ["products", "master"],
    queryFn: getMasterProducts,
  });
}

export function useVariantProducts() {
  return useQuery<VariantProduct[]>({
    queryKey: ["products", "variants"],
    queryFn: getVariantProducts,
  });
}
