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

  // Allow public assets, internal Next.js paths, favicon, and login
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Route protection — checks token when ENABLE_AUTH_GUARD is set
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const isAuthGuardActive = process.env.ENABLE_AUTH_GUARD === "true";

  if (isAuthGuardActive && !token) {
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

