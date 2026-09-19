import { apiPost } from '@/lib/api/http-client';
import { API } from '@/lib/api/endpoints';
import type {
  LoginRequest,
  LoginResponse,
  VerifyOtpRequest,
  ChangePasswordRequest,
} from '../types/auth.types';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await apiPost<LoginResponse>(API.auth.login, {
    email: credentials.email,
    password: credentials.password,
  });
  return res;
}

export async function verifyOtp(payload: VerifyOtpRequest): Promise<LoginResponse> {
  const res = await apiPost<LoginResponse>(API.auth.verifyOtp, payload);
  return res;
}

export async function resendOtp(email: string): Promise<{ message: string }> {
  return apiPost<{ message: string }>(API.auth.resendOtp, { email });
}

export async function logout(): Promise<void> {
  try {
    await apiPost(API.auth.logout);
  } catch (error) {
    console.warn('[AuthService] Logout error (proceeding anyway):', error);
  }
}

export async function changePassword(payload: ChangePasswordRequest): Promise<{ message: string }> {
  return apiPost<{ message: string }>(API.auth.changePassword, payload);
}
