import type { LoginRequest, LoginResponse } from '../types/auth.types';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // TODO: replace with apiPost(API.auth.login, credentials)
  console.log('[Auth] Login attempt:', credentials.email);
  return {
    token: 'mock-jwt-token',
    user: { id: 1, name: 'Demo User', email: credentials.email, role: 'super_admin' },
  };
}

export async function logout(): Promise<void> {
  // TODO: replace with apiPost(API.auth.logout)
  console.log('[Auth] Logout');
}
