import type { InferSelectModel } from 'drizzle-orm'
import { vendorProfiles } from '@/lib/db/schema'

export type VendorVerificationBannerMode =
  | 'hidden'
  | 'needs_verification'
  | 'under_review'
  | 'rejected'

export type VendorProfileRow = InferSelectModel<typeof vendorProfiles>

export function getVendorVerificationBannerMode(
  profile: VendorProfileRow
): VendorVerificationBannerMode {
  const s = profile.verificationStatus
  if (s === 'APPROVED' || s === 'SUSPENDED') {
    return 'hidden'
  }
  if (s === 'REJECTED') {
    return 'rejected'
  }
  if (s === 'PENDING_VERIFICATION') {
    return profile.verificationSubmittedAt != null ? 'under_review' : 'needs_verification'
  }
  return 'hidden'
}
