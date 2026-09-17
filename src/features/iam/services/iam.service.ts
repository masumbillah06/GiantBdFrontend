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
  data: { name?: string; phone?: string; gender?: string; roleId?: string; status?: string }
): Promise<User> {
  return apiPatch<User>(API.users.byId(id), data);
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

// Permissions
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
