"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers, getRoles, getPermissions } from "../services/iam.service";
import type { UserRecord, RoleRecord, PermissionRecord } from "../types/iam.types";

export function useUsers() {
  return useQuery<UserRecord[]>({
    queryKey: ["iam", "users"],
    queryFn: getUsers,
  });
}

export function useRoles() {
  return useQuery<RoleRecord[]>({
    queryKey: ["iam", "roles"],
    queryFn: getRoles,
  });
}

export function usePermissions() {
  return useQuery<PermissionRecord[]>({
    queryKey: ["iam", "permissions"],
    queryFn: getPermissions,
  });
}

