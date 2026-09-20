import { api, apiGet, apiPost, apiPatch, apiDelete, apiUpload } from '@/lib/api/http-client';
import { API } from '@/lib/api/endpoints';
import type { User, Role, Permission } from '@/features/auth/types/auth.types';
import {
  type UserRecord,
  type RoleRecord,
  type PermissionRecord,
  adaptUserToRecord,
  adaptRoleToRecord,
} from '../types/iam.types';
import { PERMISSION_DATA } from '@/lib/mock-data/iam/permission.mock';

// Users
export async function getUsers(params?: Record<string, any>): Promise<UserRecord[]> {
  try {
    const res = await api.get(API.users.list, { params });
    const rawList: User[] = res.data?.data || [];
    return rawList.map(adaptUserToRecord);
  } catch (error) {
    console.warn('[IAMService] Failed to fetch users:', error);
    return [];
  }
}

export async function getRawUsers(params?: Record<string, any>): Promise<User[]> {
  return apiGet<User[]>(API.users.list, params);
}

export async function getUserById(id: string): Promise<User> {
  return apiGet<User>(API.users.byId(id));
}

export async function getCurrentUser(): Promise<User> {
  return apiGet<User>(API.users.me);
}

export async function registerUser(formData: FormData): Promise<User> {
  return apiUpload<User>(API.users.register, formData);
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    gender?: any;
    roleId?: string;
    status?: string;
    password?: string;
    image?: string;
    signature?: string;
    isTwoFactorEnabled?: boolean;
  }
): Promise<User> {
  const payload: any = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.gender !== undefined) payload.gender = data.gender;
  if (data.roleId !== undefined) payload.roleId = data.roleId;
  if (data.status !== undefined) payload.status = data.status;
  if (data.password !== undefined && data.password.trim() !== '') payload.password = data.password;
  if (data.image !== undefined) payload.image = data.image;
  if (data.signature !== undefined) payload.signature = data.signature;
  if (data.isTwoFactorEnabled !== undefined) payload.isTwoFactorEnabled = data.isTwoFactorEnabled;
  return apiPatch<User>(API.users.byId(id), payload);
}

export async function deleteUser(id: string): Promise<void> {
  return apiDelete(API.users.byId(id));
}

export async function restoreUser(id: string): Promise<User> {
  return apiPost<User>(API.users.restore(id));
}

export async function uploadUserAvatar(id: string, file: File): Promise<User> {
  const formData = new FormData();
  formData.append('avatar', file);
  return apiUpload<User>(API.users.avatar(id), formData);
}

export async function uploadUserSignature(id: string, file: File): Promise<User> {
  const formData = new FormData();
  formData.append('signature', file);
  return apiUpload<User>(API.users.signature(id), formData);
}

// Roles
export async function getRoles(params?: Record<string, any>): Promise<RoleRecord[]> {
  try {
    const res = await api.get(API.roles.list, { params });
    const rawList: Role[] = res.data?.data || [];
    return rawList.map(adaptRoleToRecord);
  } catch (error) {
    console.warn('[IAMService] Failed to fetch roles:', error);
    return [];
  }
}

export async function getRawRoles(params?: Record<string, any>): Promise<Role[]> {
  return apiGet<Role[]>(API.roles.list, params);
}

export async function getRoleById(id: string): Promise<Role> {
  return apiGet<Role>(API.roles.byId(id));
}

export async function createRole(data: {
  name: string;
  description?: string;
  isTwoFactorRequired?: boolean;
  permissionIds?: string[];
}): Promise<Role> {
  const payload: any = { name: data.name.trim() };
  if (data.description !== undefined && data.description.trim()) {
    payload.description = data.description.trim();
  }
  if (data.isTwoFactorRequired !== undefined) {
    payload.isTwoFactorRequired = Boolean(data.isTwoFactorRequired);
  }
  if (data.permissionIds && data.permissionIds.length > 0) {
    payload.permissionIds = data.permissionIds;
  }
  return apiPost<Role>(API.roles.create, payload);
}

export async function updateRole(
  id: string,
  data: {
    name?: string;
    description?: string;
    isTwoFactorRequired?: boolean;
    status?: string;
    permissionIds?: string[];
  }
): Promise<Role> {
  const payload: any = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.isTwoFactorRequired !== undefined) payload.isTwoFactorRequired = Boolean(data.isTwoFactorRequired);
  if (data.status !== undefined) payload.status = data.status;
  if (data.permissionIds !== undefined) payload.permissionIds = data.permissionIds;
  return apiPatch<Role>(API.roles.byId(id), payload);
}

export async function deleteRole(id: string): Promise<void> {
  return apiDelete(API.roles.byId(id));
}

export async function restoreRole(id: string): Promise<Role> {
  return apiPost<Role>(API.roles.restore(id));
}

// Permissions
export async function getRawPermissions(): Promise<Permission[]> {
  try {
    const permissions = await apiGet<Permission[]>(API.permissions.list);
    return permissions || [];
  } catch (error) {
    console.warn('[IAMService] Failed to fetch raw permissions:', error);
    return [];
  }
}

export async function seedPermissions(): Promise<{
  message: string;
  created: number;
  existing: number;
  total: number;
}> {
  return apiPost(API.permissions.seed);
}

export async function getPermissions(): Promise<PermissionRecord[]> {
  try {
    const permissions = await apiGet<Permission[]>(API.permissions.list);
    if (permissions && permissions.length > 0) {
      // Group permissions by module
      const moduleMap = new Map<string, PermissionRecord>();
      permissions.forEach((p, idx) => {
        const mod = p.module || 'GENERAL';
        if (!moduleMap.has(mod)) {
          moduleMap.set(mod, {
            id: idx + 1,
            moduleName: mod,
            adjust: false,
            approve: false,
            challan: false,
            create: false,
            decide: false,
            delete: false,
            deliver: false,
            export: false,
            issue: false,
            manage: false,
            read: false,
            receive: false,
            reject: false,
            relocate: false,
            test: false,
            test234234: false,
            track: false,
            update: false,
            variant: false,
            watch: false,
          });
        }
        const record = moduleMap.get(mod)!;
        const action = p.name.split(':')[1]?.toLowerCase();
        if (action && action in record) {
          (record as any)[action] = true;
        }
      });
      return Array.from(moduleMap.values());
    }
  } catch (error) {
    console.warn('[IAMService] Failed to fetch permissions:', error);
  }
  return PERMISSION_DATA;
}
