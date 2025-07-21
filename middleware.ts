import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and auth pages
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/uploads/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/verify-email") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Get session token from cookies to check authentication without importing auth
  const sessionToken = request.cookies.get("authjs.session-token")?.value ||
                      request.cookies.get("__Secure-authjs.session-token")?.value

  // If user is not authenticated, redirect to login
  if (!sessionToken) {
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // For authenticated users, let the page components handle profile checks
  // This avoids Edge Runtime issues with Prisma and other Node.js modules

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (file uploads)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)",
  ],
}
