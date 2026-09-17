import type { User, Role, Permission } from '@/features/auth/types/auth.types';

export interface UserRecord {
  id: string | number;
  name: string;
  role: string;
  gender: string;
  phone: string;
  email: string;
  status: string;
  avatar?: string | null;
  raw?: User;
}

export interface RoleRecord {
  id: string | number;
  name: string;
  permission: number;
  description?: string;
  raw?: Role;
}

export interface PermissionRecord {
  id: string | number;
  moduleName: string;
  adjust: boolean;
  approve: boolean;
  challan: boolean;
  create: boolean;
  decide: boolean;
  delete: boolean;
  deliver: boolean;
  export: boolean;
  issue: boolean;
  manage: boolean;
  read: boolean;
  receive: boolean;
  reject: boolean;
  relocate: boolean;
  test: boolean;
  test234234: boolean;
  track: boolean;
  update: boolean;
  variant: boolean;
  watch: boolean;
  raw?: Permission;
}

export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export function adaptUserToRecord(u: User): UserRecord {
  return {
    id: u.id,
    name: u.name,
    role: u.role?.name || 'User',
    gender: u.gender ? u.gender.toLowerCase() : '-',
    phone: u.phone || '-',
    email: u.email,
    status: u.status ? u.status.toLowerCase() : 'active',
    avatar: u.avatar || u.image,
    raw: u,
  };
}

export function adaptRoleToRecord(r: Role): RoleRecord {
  const permCount = r.permissions?.length || r.rolePermissions?.length || 0;
  return {
    id: r.id,
    name: r.name,
    permission: permCount,
    description: r.description,
    raw: r,
  };
}
