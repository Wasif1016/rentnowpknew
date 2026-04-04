import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Refreshes the Supabase session from cookies and applies updated auth cookies to the response.
 * Call this from `proxy.ts` on every request that should participate in SSR auth (not static assets).
 *
 * Do not use `getSession()` here for authorization — use `getUser()` (validates with Auth server).
 * Route protection stays in layouts via `getRequiredUser()` in `src/lib/auth/session.ts`.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshes expired sessions; do not add auth redirects here — use layout guards instead.
  await supabase.auth.getUser()

  return supabaseResponse
}
