'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { resolveRedirectAfterLogin, type AppRole } from '@/lib/auth/safe-next'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

export async function loginAction(
  formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
  const nextRaw = formData.get('next')
  const next = typeof nextRaw === 'string' ? nextRaw : null

  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { success: false, error: 'Invalid email or password.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email.trim().toLowerCase(),
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, error: mapLoginError(error.message) }
  }

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()
  if (!authUser) {
    return { success: false, error: 'Could not sign in.' }
  }

  const [dbUser] = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1)

  if (!dbUser) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'Account setup is incomplete. Contact support or try signing up again.',
    }
  }

  const role = dbUser.role as AppRole
  const redirectTo = resolveRedirectAfterLogin(role, next)

  return { success: true, data: { redirectTo } }
}

function mapLoginError(raw: string): string {
  const lower = raw.toLowerCase()
  if (lower.includes('invalid login') || lower.includes('invalid credentials'))
    return 'Invalid email or password.'
  if (lower.includes('email not confirmed')) return 'Please confirm your email before signing in.'
  return 'Could not sign in. Try again.'
}

export async function logoutAction(): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: error.message }
  }

  redirect('/')
}

export async function getOAuthSignInUrl(provider: 'google' | 'apple') {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
  if (!base) {
    return { success: false, error: 'App URL is not configured' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${base}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: { url: data.url } }
}

export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email')

  if (!email || typeof email !== 'string') {
    return { success: false, error: 'Email is required' }
  }

  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
  if (!base) {
    return { success: false, error: 'App URL is not configured' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${base}/auth/reset-password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
