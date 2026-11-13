import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";

/**
 * Ultra-lightweight Next.js Edge Middleware.
 * Strictly checks cookie presence for protected admin routes.
 * ZERO database connections, ZERO Prisma imports, ZERO heavy operations.
 * Guaranteed < 1ms execution time.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and subroutes, excluding /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME);

    if (!hasSessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

/**
 * Strict matcher configuration:
 * Only executes for protected admin routes.
 * Completely ignores public routes, static files, and API endpoints.
 */
export const config = {
  matcher: [
    /*
     * Match /admin and all subpaths except:
     * - api routes
     * - _next/static, _next/image
     * - icon.svg, favicon.ico
     */
    "/admin/:path*",
  ],
};
