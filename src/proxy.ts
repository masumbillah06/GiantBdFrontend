import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_KEY } from "@/lib/auth/session";

/**
 * Route protection proxy for Next.js 16+ App Router (replaces middleware.ts).
 *
 * Checks for authentication token in cookies on dashboard routes.
 * Redirects unauthenticated requests to /login when ENABLE_AUTH_GUARD is set.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, Next.js internals, API routes, and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const isAuthGuardDisabled = process.env.DISABLE_AUTH_GUARD === "true";

  // If user is already authenticated
  if (token) {
    // Prevent authenticated users from seeing /login or root landing page
    if (pathname === "/login" || pathname === "/") {
      const from = request.nextUrl.searchParams.get("from") || "/inventory/dashboard";
      return NextResponse.redirect(new URL(from, request.url));
    }
    return NextResponse.next();
  }

  // If user is NOT authenticated
  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect all other routes unless explicitly disabled
  if (!isAuthGuardDisabled) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

