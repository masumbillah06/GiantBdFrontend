"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getRawUsers,
  getUserById,
  getCurrentUser,
  registerUser,
  updateUser,
  deleteUser,
  restoreUser,
  getRoles,
  getRawRoles,
  getRoleById,
  getPermissions,
} from "../services/iam.service";
import type { UserRecord, RoleRecord, PermissionRecord } from "../types/iam.types";

export function useUsers(params?: Record<string, any>) {
  return useQuery<UserRecord[]>({
    queryKey: ["iam", "users", params],
    queryFn: () => getUsers(params),
  });
}

export function useRawUsers(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["iam", "users", "raw", params],
    queryFn: () => getRawUsers(params),
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: ["iam", "users", id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["iam", "users", "me"],
    queryFn: getCurrentUser,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const registerMut = useMutation({
    mutationFn: (formData: FormData) => registerUser(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["iam", "users"] }),
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; phone?: string; gender?: string; roleId?: string; status?: string };
    }) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["iam", "users"] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["iam", "users"] }),
  });

  const restoreMut = useMutation({
    mutationFn: (id: string) => restoreUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["iam", "users"] }),
  });

  return { registerMut, updateMut, deleteMut, restoreMut };
}

export function useRoles(params?: Record<string, any>) {
  return useQuery<RoleRecord[]>({
    queryKey: ["iam", "roles", params],
    queryFn: () => getRoles(params),
  });
}

export function useRawRoles(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["iam", "roles", "raw", params],
    queryFn: () => getRawRoles(params),
  });
}

export function useRoleDetail(id: string) {
  return useQuery({
    queryKey: ["iam", "roles", id],
    queryFn: () => getRoleById(id),
    enabled: Boolean(id),
  });
}

export function usePermissions() {
  return useQuery<PermissionRecord[]>({
    queryKey: ["iam", "permissions"],
    queryFn: getPermissions,
  });
}
