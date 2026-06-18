import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/constants";
import { verifySessionToken } from "@/lib/auth/jwt";

// Route prefixes that require an authenticated session with a chosen role.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/seller",
  "/buyer",
  "/driver",
];
const AUTH_PAGES = ["/sign-in", "/sign-up"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  // Authenticated users should not see the auth pages.
  if (session && AUTH_PAGES.includes(pathname)) {
    const target = session.activeRole ? "/dashboard" : "/select-role";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (isProtected(pathname)) {
    if (!session) {
      const url = new URL("/sign-in", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    // Multi-role users must pick an active role before any dashboard.
    if (!session.activeRole) {
      return NextResponse.redirect(new URL("/select-role", request.url));
    }
  }

  // Users who still need to choose a role are sent to the selection screen.
  if (session && !session.activeRole && pathname === "/select-role") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/seller/:path*",
    "/buyer/:path*",
    "/driver/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
