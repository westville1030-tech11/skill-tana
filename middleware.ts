import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_PATHS = [
  "/coming-soon",
  "/login",
  "/signup",
  "/profile/edit",
  "/inbox",
  "/terms",
  "/privacy",
  "/about",
];

export function middleware(request: NextRequest) {
  if (process.env.COMING_SOON !== "true") return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/inquiry/") ||
    ALLOWED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
