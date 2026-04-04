'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { getRequiredUser } from '@/lib/auth/session'
import { uploadVerificationImage } from '@/lib/cloudinary/server'
import { db } from '@/lib/db'
import { users, vendorProfiles } from '@/lib/db/schema'
import { cnicInputSchema } from '@/lib/validation/cnic'
import { getVendorProfileByUserId } from '@/lib/db/vendor-profile'

export type SubmitVendorVerificationResult =
  | { ok: true }
  | { ok: false; message: string }

const FOLDER_PREFIX = 'rentnowpk/vendor-verification'

function sanitizePublicIdSegment(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'file'
}

async function readImagePart(
  part: FormDataEntryValue | null,
  label: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (!part || typeof part === 'string') {
    throw new Error(`${label} is required`)
  }
  if (part.size === 0) {
    throw new Error(`${label} is empty`)
  }
  const mimeType = part.type || 'application/octet-stream'
  const ab = await part.arrayBuffer()
  return { buffer: Buffer.from(ab), mimeType }
}

export async function submitVendorVerification(
  _prev: SubmitVendorVerificationResult | null,
  formData: FormData
): Promise<SubmitVendorVerificationResult> {
  const user = await getRequiredUser('VENDOR')
  const profile = await getVendorProfileByUserId(user.id)
  if (!profile) {
    return { ok: false, message: 'Vendor profile not found.' }
  }

  const status = profile.verificationStatus
  const submitted = profile.verificationSubmittedAt != null

  if (status === 'APPROVED' || status === 'SUSPENDED') {
    return { ok: false, message: 'Verification cannot be submitted for this account.' }
  }

  if (status === 'PENDING_VERIFICATION' && submitted) {
    return {
      ok: false,
      message: 'Your documents are already under review. You will be notified within 24 hours.',
    }
  }

  if (status !== 'PENDING_VERIFICATION' && status !== 'REJECTED') {
    return { ok: false, message: 'Verification cannot be submitted right now.' }
  }

  const cnicRaw = formData.get('cnicNumber')
  if (typeof cnicRaw !== 'string') {
    return { ok: false, message: 'CNIC is required.' }
  }

  const cnicParsed = cnicInputSchema.safeParse(cnicRaw)
  if (!cnicParsed.success) {
    const err = cnicParsed.error.flatten().formErrors[0]
    return { ok: false, message: err ?? 'Invalid CNIC.' }
  }
  const cnicNumber = cnicParsed.data

  try {
    const cnicFront = await readImagePart(formData.get('cnic_front'), 'CNIC front photo')
    const cnicBack = await readImagePart(formData.get('cnic_back'), 'CNIC back photo')
    const selfie = await readImagePart(formData.get('selfie'), 'Profile / selfie photo')
    const logo = await readImagePart(formData.get('logo'), 'Business logo')

    const vendorFolder = `${FOLDER_PREFIX}/${profile.id}`

    const [cnicFrontUrl, cnicBackUrl, selfieUrl, logoUrl] = await Promise.all([
      uploadVerificationImage({
        folder: vendorFolder,
        publicId: `cnic_front_${sanitizePublicIdSegment(crypto.randomUUID())}`,
        mimeType: cnicFront.mimeType,
        buffer: cnicFront.buffer,
      }),
      uploadVerificationImage({
        folder: vendorFolder,
        publicId: `cnic_back_${sanitizePublicIdSegment(crypto.randomUUID())}`,
        mimeType: cnicBack.mimeType,
        buffer: cnicBack.buffer,
      }),
      uploadVerificationImage({
        folder: vendorFolder,
        publicId: `selfie_${sanitizePublicIdSegment(crypto.randomUUID())}`,
        mimeType: selfie.mimeType,
        buffer: selfie.buffer,
      }),
      uploadVerificationImage({
        folder: vendorFolder,
        publicId: `logo_${sanitizePublicIdSegment(crypto.randomUUID())}`,
        mimeType: logo.mimeType,
        buffer: logo.buffer,
      }),
    ])

    const now = new Date()

    await db.transaction(async (tx) => {
      await tx
        .update(vendorProfiles)
        .set({
          cnicNumber,
          cnicFrontUrl,
          cnicBackUrl,
          selfieUrl,
          businessLogoUrl: logoUrl,
          verificationSubmittedAt: now,
          verificationStatus: 'PENDING_VERIFICATION',
          statusNote: status === 'REJECTED' ? null : profile.statusNote,
          updatedAt: now,
        })
        .where(eq(vendorProfiles.id, profile.id))

      await tx
        .update(users)
        .set({
          avatarUrl: selfieUrl,
          updatedAt: now,
        })
        .where(eq(users.id, user.id))
    })

    revalidatePath('/vendor')
    revalidatePath('/vendor', 'layout')

    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Something went wrong. Try again.'
    return { ok: false, message }
  }
}
