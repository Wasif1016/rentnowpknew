'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// ============================================================
// SCHEMAS
// ============================================================

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(['HOMEOWNER', 'PAINTER']),
})

// ============================================================
// TYPES
// ============================================================

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

// ============================================================
// ACTIONS
// ============================================================

/**
 * Login action - authenticates user and redirects to role-based dashboard
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { success: false, error: 'Invalid email or password' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Redirect handled by client - return success
  return { success: true }
}

/**
 * Signup action - creates Supabase user + User record, redirects based on role
 */
export async function signupAction(formData: FormData): Promise<ActionResult<{ userId: string }>> {
  const parsed = SignupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    role: formData.get('role'),
  })

  if (!parsed.success) {
    return { success: false, error: 'Invalid signup data' }
  }

  const supabase = await createClient()

  // Create Supabase auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        role: parsed.data.role,
      },
    },
  })

  if (authError || !authData.user) {
    return { success: false, error: authError?.message || 'Failed to create account' }
  }

  // TODO: Create User record in database (requires database to be set up)
  // const { db } = await import('@/lib/db')
  // const { users } = await import('@/lib/db/schema')
  // await db.insert(users).values({
  //   id: authData.user.id,
  //   email: parsed.data.email,
  //   fullName: parsed.data.fullName,
  //   role: parsed.data.role,
  // })

  return { success: true, data: { userId: authData.user.id } }
}

/**
 * Logout action - signs out user and redirects to home
 */
export async function logoutAction(): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: error.message }
  }

  redirect('/')
}

/**
 * Get OAuth sign in URL for provider
 */
export async function getOAuthSignInUrl(provider: 'google' | 'apple') {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: { url: data.url } }
}

/**
 * Reset password action
 */
export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email')

  if (!email || typeof email !== 'string') {
    return { success: false, error: 'Email is required' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/reset-password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
