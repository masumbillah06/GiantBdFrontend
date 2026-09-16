/**
 * Client and server-compatible authentication and session helpers.
 */

export const AUTH_TOKEN_KEY = "giantbd_token";
export const USER_INFO_KEY = "giantbd_user";

export function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  // Check cookie first
  const cookieMatch = document.cookie.match(new RegExp(`(^| )${AUTH_TOKEN_KEY}=([^;]+)`));
  if (cookieMatch) return decodeURIComponent(cookieMatch[2]);
  // Fallback to localStorage
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setClientToken(token: string, days = 7): void {
  if (typeof window === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeClientToken(): void {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
}

export function getClientUser<T = Record<string, unknown>>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setClientUser<T = Record<string, unknown>>(user: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
}

export function isClientAuthenticated(): boolean {
  return Boolean(getClientToken());
}

