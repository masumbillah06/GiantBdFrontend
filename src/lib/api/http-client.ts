/**
 * HTTP Client — base layer for all API communication.
 *
 * Currently a thin wrapper around fetch. When the backend API is ready:
 * 1. Set NEXT_PUBLIC_API_URL in .env.local
 * 2. Add auth token injection (see `getAuthHeaders`)
 * 3. Replace service stubs in features/<domain>/services/ to call apiGet/apiPost
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// ---------------------------------------------------------------------------
// Auth header helper
// ---------------------------------------------------------------------------

import { getClientToken } from "@/lib/auth/session";

function getAuthHeaders(): HeadersInit {
  const token = getClientToken();
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

// ---------------------------------------------------------------------------
// Core request helper
// ---------------------------------------------------------------------------

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: unknown,
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // TODO: redirect to /login and clear session
    throw new Error('Unauthorized — please log in again.');
  }

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${message}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function apiGet<T>(endpoint: string): Promise<T> {
  return request<T>('GET', endpoint);
}

export function apiPost<T, B = unknown>(endpoint: string, body: B): Promise<T> {
  return request<T>('POST', endpoint, body);
}

export function apiPut<T, B = unknown>(endpoint: string, body: B): Promise<T> {
  return request<T>('PUT', endpoint, body);
}

export function apiPatch<T, B = unknown>(endpoint: string, body: B): Promise<T> {
  return request<T>('PATCH', endpoint, body);
}

export function apiDelete<T>(endpoint: string): Promise<T> {
  return request<T>('DELETE', endpoint);
}

