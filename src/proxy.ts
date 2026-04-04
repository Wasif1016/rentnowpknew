// proxy.ts — Next.js 16 replacement for middleware.ts (Node.js runtime).
// Session refresh lives in @/lib/supabase/middleware (Supabase + SSR pattern).
// Do not gate routes here; layouts use getRequiredUser() for role checks.

import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static assets — no Supabase session work needed
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|svg|ico|css|js|woff2?)$/)
  ) {
    return NextResponse.next()
  }

  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
