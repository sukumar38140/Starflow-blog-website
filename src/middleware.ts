import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.AUTH_SECRET || "startflow_super_secret_key_1234567890_at_least_32_chars";
const KEY = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin paths
  if (pathname.startsWith("/admin")) {
    // Exclude login page and any static assets
    if (pathname === "/admin/login") {
      const session = request.cookies.get("session")?.value;
      if (session) {
        try {
          await jose.jwtVerify(session, KEY);
          // Already logged in, redirect to dashboard
          return NextResponse.redirect(new URL("/admin", request.url));
        } catch (e) {
          // Token invalid, let them view login
        }
      }
      return NextResponse.next();
    }

    const session = request.cookies.get("session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jose.jwtVerify(session, KEY);
      const role = payload.role as string;

      // Role-based route guards (Super Admin and Editor only for settings, users, leads, subscribers)
      const isSuperAdminOrEditor = role === "super_admin" || role === "editor";
      const isSuperAdminOnly = role === "super_admin";

      if (pathname.startsWith("/admin/users") && !isSuperAdminOnly) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (pathname.startsWith("/admin/roles") && !isSuperAdminOnly) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (
        (pathname.startsWith("/admin/leads") ||
          pathname.startsWith("/admin/subscribers") ||
          pathname.startsWith("/admin/settings")) &&
        !isSuperAdminOrEditor
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // User details passed in request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", (payload.id as string) || "");
      requestHeaders.set("x-user-role", role || "");
      requestHeaders.set("x-user-name", (payload.name as string) || "");

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
