// proxy.ts - REPLACES middleware.ts in Next.js 16
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/for-painters",
  "/how-it-works",
  "/pricing",
  "/blog",
  "/login",
  "/signup",
  "/join",
  "/trust",
  "/about",
  "/contact",
  "/painters",
  "/verify-email",
  "/api/inngest", // Inngest Dev Server needs access
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets — always allow
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|svg|ico|css|js|woff2?)$/)
  )
    return NextResponse.next();

  // Webhooks — always allow (Stripe, etc. have no session cookie)
  if (pathname.startsWith("/api/webhooks")) return NextResponse.next();

  // Public paths — allow
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isPublic) return NextResponse.next();

  // Protected — check cookie exists only. Layouts do real auth.
  const session = request.cookies.get("sb-auth-token");
  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
