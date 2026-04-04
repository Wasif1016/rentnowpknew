import {
  bookingStatusEnum,
  vendorVerificationEnum,
  userRoleEnum,
} from '@/lib/db/schema'

export { bookingStatusEnum, vendorVerificationEnum, userRoleEnum }

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  COMPLETED: 'COMPLETED',
} as const

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

export const VENDOR_VERIFICATION = {
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const

export type VendorVerificationStatus =
  (typeof VENDOR_VERIFICATION)[keyof typeof VENDOR_VERIFICATION]

export const USER_ROLE = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]
