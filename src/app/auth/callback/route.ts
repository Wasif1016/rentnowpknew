import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { resolveRedirectAfterLogin, type AppRole } from '@/lib/auth/safe-next'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

function redirectToPath(requestUrl: URL, path: string) {
  return NextResponse.redirect(new URL(path, requestUrl.origin))
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextParam = requestUrl.searchParams.get('next')

  if (!code) {
    return redirectToPath(requestUrl, '/auth/login?error=oauth')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return redirectToPath(requestUrl, '/auth/login?error=session')
  }

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return redirectToPath(requestUrl, '/auth/login?error=session')
  }

  const [dbUser] = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1)

  if (!dbUser) {
    await supabase.auth.signOut()
    return redirectToPath(requestUrl, '/auth/login?error=setup_incomplete')
  }

  const role = dbUser.role as AppRole
  const path = resolveRedirectAfterLogin(role, nextParam)

  return redirectToPath(requestUrl, path)
}
