export interface UserRecord {
  id: number;
  name: string;
  role: string;
  gender: string;
  phone: string;
  email: string;
  status: string;
}

export interface RoleRecord {
  id: number;
  name: string;
  permission: number;
}

export interface PermissionRecord {
  id: number;
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
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  token?: string;
}
