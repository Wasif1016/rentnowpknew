'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getRequiredUser } from '@/lib/auth/session'
import { vendorProfileTag } from '@/lib/constants/cache-tags'
import { db } from '@/lib/db'
import { users, vendorProfiles } from '@/lib/db/schema'
import { getVendorProfileByUserId } from '@/lib/db/vendor-profile'
import { formString } from '@/lib/form/form-data'
import {
  isValidPhoneCountryCode,
  parseLocalToE164,
} from '@/lib/phone/vendor-countries'
import { createClient } from '@/lib/supabase/server'

const fullNameSchema = z
  .string()
  .transform((s) => s.trim())
  .refine((s) => s.length > 0, { message: 'Enter your name.' })
  .refine((s) => s.length <= 200, { message: 'Name is too long.' })

const businessProfileSchema = z.object({
  businessName: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, { message: 'Enter your business name.' })
    .refine((s) => s.length >= 2, {
      message: 'Business name must be at least 2 characters.',
    })
    .refine((s) => s.length <= 200, { message: 'Business name is too long.' }),
  countryCode: z
    .string()
    .transform((s) => s.trim().toUpperCase())
    .refine((c) => isValidPhoneCountryCode(c), {
      message: 'Select a valid country.',
    }),
  phoneLocal: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, { message: 'Enter your phone number.' }),
})

const emailChangeSchema = z.object({
  email: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(
      z
        .string()
        .min(1, 'Enter your email address.')
        .email('Enter a valid email address.')
    ),
})

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' })
      .max(128, { message: 'Password is too long.' }),
    confirmNewPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'New passwords do not match.',
    path: ['confirmNewPassword'],
  })

export type VendorPersonalNameFieldKey = 'fullName'
export type VendorPersonalNameResult =
  | { ok: true }
  | {
      ok: false
      fieldErrors?: Partial<Record<VendorPersonalNameFieldKey, string>>
      formError?: string
    }

export type VendorBusinessFieldKey = 'businessName' | 'countryCode' | 'phoneLocal'
export type VendorBusinessResult =
  | { ok: true }
  | {
      ok: false
      fieldErrors?: Partial<Record<VendorBusinessFieldKey, string>>
      formError?: string
    }

export type VendorEmailFieldKey = 'email'
export type VendorEmailResult =
  | { ok: true; pendingConfirmation: true }
  | {
      ok: false
      fieldErrors?: Partial<Record<VendorEmailFieldKey, string>>
      formError?: string
    }

export type VendorPasswordFieldKey =
  | 'currentPassword'
  | 'newPassword'
  | 'confirmNewPassword'
export type VendorPasswordResult =
  | { ok: true }
  | {
      ok: false
      fieldErrors?: Partial<Record<VendorPasswordFieldKey, string>>
      formError?: string
    }

function zodToFieldErrors<K extends string>(
  issues: z.core.$ZodIssue[],
  keys: readonly K[]
): Partial<Record<K, string>> {
  const set = new Set(keys)
  const out: Partial<Record<K, string>> = {}
  for (const issue of issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && set.has(key as K) && !out[key as K]) {
      out[key as K] = issue.message
    }
  }
  return out
}

function mapEmailUpdateError(raw: string): string {
  const lower = raw.toLowerCase()
  if (lower.includes('already registered') || lower.includes('already been registered'))
    return 'That email is already in use.'
  if (lower.includes('same')) return 'That is already your email address.'
  return 'Could not update email. Try again or contact support.'
}

function invalidateVendorUi(vendorProfileId: string) {
  updateTag(vendorProfileTag(vendorProfileId))
  revalidatePath('/vendor/profile')
  revalidatePath('/vendor', 'layout')
}

export async function updateVendorPersonalName(
  _prev: VendorPersonalNameResult | null,
  formData: FormData
): Promise<VendorPersonalNameResult> {
  const parsed = fullNameSchema.safeParse(formString(formData, 'fullName'))
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: zodToFieldErrors(parsed.error.issues, ['fullName'] as const),
    }
  }

  const user = await getRequiredUser('VENDOR')
  const profile = await getVendorProfileByUserId(user.id)
  if (!profile) {
    return { ok: false, formError: 'Vendor profile not found.' }
  }

  const now = new Date()
  await db
    .update(users)
    .set({ fullName: parsed.data, updatedAt: now })
    .where(eq(users.id, user.id))

  invalidateVendorUi(profile.id)
  return { ok: true }
}

export async function updateVendorBusinessProfile(
  _prev: VendorBusinessResult | null,
  formData: FormData
): Promise<VendorBusinessResult> {
  const parsed = businessProfileSchema.safeParse({
    businessName: formString(formData, 'businessName'),
    countryCode: formString(formData, 'countryCode'),
    phoneLocal: formString(formData, 'phoneLocal'),
  })

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: zodToFieldErrors(parsed.error.issues, [
        'businessName',
        'countryCode',
        'phoneLocal',
      ] as const),
    }
  }

  const phone = parseLocalToE164(parsed.data.countryCode, parsed.data.phoneLocal)
  if (!phone.ok) {
    return {
      ok: false,
      fieldErrors: { phoneLocal: phone.message },
    }
  }

  const user = await getRequiredUser('VENDOR')
  const profile = await getVendorProfileByUserId(user.id)
  if (!profile) {
    return { ok: false, formError: 'Vendor profile not found.' }
  }

  const now = new Date()
  const e164 = phone.e164

  await db.transaction(async (tx) => {
    await tx
      .update(vendorProfiles)
      .set({
        businessName: parsed.data.businessName,
        whatsappPhone: e164,
        updatedAt: now,
      })
      .where(eq(vendorProfiles.id, profile.id))

    await tx
      .update(users)
      .set({ phone: e164, updatedAt: now })
      .where(eq(users.id, user.id))
  })

  invalidateVendorUi(profile.id)
  return { ok: true }
}

export async function requestVendorEmailChange(
  _prev: VendorEmailResult | null,
  formData: FormData
): Promise<VendorEmailResult> {
  const parsed = emailChangeSchema.safeParse({
    email: formString(formData, 'email'),
  })
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: zodToFieldErrors(parsed.error.issues, ['email'] as const),
    }
  }

  const user = await getRequiredUser('VENDOR')
  const profile = await getVendorProfileByUserId(user.id)
  if (!profile) {
    return { ok: false, formError: 'Vendor profile not found.' }
  }

  if (parsed.data.email === user.email.toLowerCase()) {
    return {
      ok: false,
      formError: 'That is already your email address.',
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    email: parsed.data.email,
  })

  if (error) {
    return {
      ok: false,
      formError: mapEmailUpdateError(error.message),
    }
  }

  invalidateVendorUi(profile.id)
  return { ok: true, pendingConfirmation: true }
}

export async function changeVendorPassword(
  _prev: VendorPasswordResult | null,
  formData: FormData
): Promise<VendorPasswordResult> {
  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formString(formData, 'currentPassword'),
    newPassword: formString(formData, 'newPassword'),
    confirmNewPassword: formString(formData, 'confirmNewPassword'),
  })

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: zodToFieldErrors(parsed.error.issues, [
        'currentPassword',
        'newPassword',
        'confirmNewPassword',
      ] as const),
    }
  }

  const user = await getRequiredUser('VENDOR')
  const profile = await getVendorProfileByUserId(user.id)
  if (!profile) {
    return { ok: false, formError: 'Vendor profile not found.' }
  }

  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email.trim().toLowerCase(),
    password: parsed.data.currentPassword,
  })

  if (signInError) {
    return {
      ok: false,
      formError: 'Current password is incorrect.',
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  })

  if (updateError) {
    return {
      ok: false,
      formError: 'Could not update password. Try again.',
    }
  }

  invalidateVendorUi(profile.id)
  return { ok: true }
}
