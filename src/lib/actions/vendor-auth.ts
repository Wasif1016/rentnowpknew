'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const pkPhone = z
  .string()
  .min(10)
  .max(16)
  .transform((s) => s.replace(/\s/g, ''))
  .refine(
    (s) => /^(\+92[0-9]{10}|03[0-9]{9})$/.test(s),
    'Enter a valid Pakistan mobile (e.g. 03XXXXXXXXX or +92XXXXXXXXXX)'
  )

const VendorSignupSchema = z.object({
  businessName: z.string().min(2).max(200).transform((s) => s.trim()),
  email: z.string().email().transform((s) => s.trim().toLowerCase()),
  whatsappPhone: pkPhone,
  password: z.string().min(8).max(128),
})

export type VendorSignupState =
  | { ok: false; error: string }
  | { ok: true; needsEmailConfirmation: true }

function appUrl(): string {
  const u = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
  if (!u) throw new Error('NEXT_PUBLIC_APP_URL is not set')
  return u
}

/**
 * Vendor self-service registration. Relies on DB trigger `handle_new_user` for public.users + vendor_profiles.
 */
export async function signUpVendorAction(
  _prev: VendorSignupState | null,
  formData: FormData
): Promise<VendorSignupState> {
  const parsed = VendorSignupSchema.safeParse({
    businessName: formData.get('businessName'),
    email: formData.get('email'),
    whatsappPhone: formData.get('whatsappPhone'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(' ')
    return { ok: false, error: msg || 'Invalid input' }
  }

  const supabase = await createClient()
  const nextPath = '/vendor/vehicles/add'
  const emailRedirectTo = `${appUrl()}/auth/callback?next=${encodeURIComponent(nextPath)}`

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo,
      data: {
        role: 'VENDOR',
        business_name: parsed.data.businessName,
        whatsapp_phone: parsed.data.whatsappPhone,
      },
    },
  })

  if (error) {
    return { ok: false, error: mapAuthError(error.message) }
  }

  if (!data.user) {
    return { ok: false, error: 'Could not create account. Try again.' }
  }

  if (data.session) {
    redirect(nextPath)
  }

  return { ok: true, needsEmailConfirmation: true }
}

function mapAuthError(raw: string): string {
  const lower = raw.toLowerCase()
  if (lower.includes('already registered') || lower.includes('already been registered'))
    return 'An account with this email already exists. Try logging in.'
  if (lower.includes('password')) return 'Password does not meet requirements.'
  return 'Something went wrong. Try again.'
}
