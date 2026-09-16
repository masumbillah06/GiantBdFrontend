"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getColors,
  getMaterials,
  getSubCategories,
  getWarehouses,
  getZones,
  getSubZones,
  getRacks,
} from "../services/attributes.service";

export function useCategories() {
  return useQuery({
    queryKey: ["attributes", "categories"],
    queryFn: getCategories,
  });
}

export function useColors() {
  return useQuery({
    queryKey: ["attributes", "colors"],
    queryFn: getColors,
  });
}

export function useMaterials() {
  return useQuery({
    queryKey: ["attributes", "materials"],
    queryFn: getMaterials,
  });
}

export function useSubCategories() {
  return useQuery({
    queryKey: ["attributes", "sub-categories"],
    queryFn: getSubCategories,
  });
}

export function useWarehouses() {
  return useQuery({
    queryKey: ["attributes", "warehouses"],
    queryFn: getWarehouses,
  });
}

export function useZones() {
  return useQuery({
    queryKey: ["attributes", "zones"],
    queryFn: getZones,
  });
}

export function useSubZones() {
  return useQuery({
    queryKey: ["attributes", "sub-zones"],
    queryFn: getSubZones,
  });
}

export function useRacks() {
  return useQuery({
    queryKey: ["attributes", "racks"],
    queryFn: getRacks,
  });
}

