import type { UserRecord, RoleRecord, PermissionRecord } from '../types/iam.types';
import { PERMISSION_DATA } from '@/lib/mock-data/iam/permission.mock';

const MOCK_USERS: UserRecord[] = [
  { id: 8, name: 'Mehedi', role: 'super_admin', gender: 'male', phone: '', email: 'hassanmehedi685@gmail.com', status: 'active' },
  { id: 7, name: 'MASUM BILLAH', role: 'super_admin', gender: 'male', phone: '', email: 'mbmasum06@gmail.com', status: 'active' },
  { id: 6, name: 'test_user', role: 'role_test_td', gender: 'male', phone: '', email: 'tashdikurrahman29@gmail.com', status: 'active' },
  { id: 5, name: 'Tashdik', role: 'super_admin', gender: 'male', phone: '', email: 'trk.ice153@gmail.com', status: 'active' },
  { id: 4, name: 'Super Admin', role: 'super_admin', gender: '-', phone: '', email: 'temp354700@gmail.com', status: 'active' },
  { id: 2, name: 'Super Admin', role: 'super_admin', gender: 'male', phone: '', email: 'trendsbirdwpbk@gmail.com', status: 'active' },
];

const MOCK_ROLES: RoleRecord[] = [
  { id: 8, name: 'Mehedi', permission: 5 },
  { id: 7, name: 'MASUM BILLAH', permission: 5 },
  { id: 6, name: 'test_user', permission: 5 },
  { id: 5, name: 'Tashdik', permission: 5 },
  { id: 4, name: 'Super Admin', permission: 5 },
  { id: 2, name: 'Super Admin', permission: 5 },
];

export async function getUsers(): Promise<UserRecord[]> { return MOCK_USERS; }
export async function getRoles(): Promise<RoleRecord[]> { return MOCK_ROLES; }
export async function getPermissions(): Promise<PermissionRecord[]> { return PERMISSION_DATA; }
