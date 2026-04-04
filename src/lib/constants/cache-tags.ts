// Cache tags — use with "use cache" and updateTag() per AGENTS.md

export function vendorProfileTag(vendorId: string) {
  return `vendor-profile-${vendorId}`
}

export function vendorVehiclesTag(vendorId: string) {
  return `vendor-vehicles-${vendorId}`
}

export function vehiclePublicTag(vehicleId: string) {
  return `vehicle-public-${vehicleId}`
}

export function vehiclesCityTag(city: string) {
  return `vehicles-city-${city}`
}

export function bookingTag(bookingId: string) {
  return `booking-${bookingId}`
}

export function customerBookingsTag(userId: string) {
  return `customer-bookings-${userId}`
}

export function staticContentTag(key: string) {
  return `static-${key}`
}

export const CACHE_INVALIDATION_MAP = {
  updateVendorProfile: [
    (vendorId: string) => [vendorProfileTag(vendorId), vendorVehiclesTag(vendorId)],
  ],
  updateVehicle: [
    (vehicleId: string, vendorId: string) => [
      vehiclePublicTag(vehicleId),
      vendorVehiclesTag(vendorId),
    ],
  ],
  updateBooking: [
    (bookingId: string, customerUserId: string) => [
      bookingTag(bookingId),
      customerBookingsTag(customerUserId),
    ],
  ],
} as const

export type CacheTag =
  | ReturnType<typeof vendorProfileTag>
  | ReturnType<typeof vendorVehiclesTag>
  | ReturnType<typeof vehiclePublicTag>
  | ReturnType<typeof vehiclesCityTag>
  | ReturnType<typeof bookingTag>
  | ReturnType<typeof customerBookingsTag>
  | ReturnType<typeof staticContentTag>
