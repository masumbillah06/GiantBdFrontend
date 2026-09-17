/**
 * HTTP Client — base layer for all API communication.
 * Powered by Axios with automatic token refresh, credentials, and error extraction.
 */

import { AxiosRequestConfig } from 'axios';
import { api, API_BASE_URL } from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export { api, API_BASE_URL };

export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await api.get<ApiResponse<T>>(endpoint, { ...config, params });
  return (res.data?.data !== undefined ? res.data.data : res.data) as T;
}

export async function apiGetPaginated<T>(
  endpoint: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<PaginatedResponse<T>> {
  const res = await api.get<PaginatedResponse<T>>(endpoint, { ...config, params });
  return res.data;
}

export async function apiPost<T, B = unknown>(
  endpoint: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await api.post<ApiResponse<T>>(endpoint, body, config);
  return (res.data?.data !== undefined ? res.data.data : res.data) as T;
}

export async function apiPut<T, B = unknown>(
  endpoint: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await api.put<ApiResponse<T>>(endpoint, body, config);
  return (res.data?.data !== undefined ? res.data.data : res.data) as T;
}

export async function apiPatch<T, B = unknown>(
  endpoint: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await api.patch<ApiResponse<T>>(endpoint, body, config);
  return (res.data?.data !== undefined ? res.data.data : res.data) as T;
}

export async function apiDelete<T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await api.delete<ApiResponse<T>>(endpoint, config);
  return (res.data?.data !== undefined ? res.data.data : res.data) as T;
}

export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST',
): Promise<T> {
  const res = await api.request<ApiResponse<T>>({
    method,
    url: endpoint,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return (res.data?.data !== undefined ? res.data.data : res.data) as T;
}

export default api;
