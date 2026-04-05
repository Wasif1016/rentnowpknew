/** Pakistan-local display for booking chat seeds (Intl, no extra deps). */
const PK_TZ = 'Asia/Karachi'

export function formatBookingDateTime(utc: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: PK_TZ,
    timeZoneName: 'short',
  }).format(utc)
}

export function driveTypeLabel(drive: 'WITH_DRIVER' | 'SELF_DRIVE'): string {
  return drive === 'WITH_DRIVER' ? 'With driver' : 'Self drive'
}

export function buildBookingRequestSeedContent(params: {
  pickupAddress: string
  dropoffAddress: string
  pickupAt: Date
  dropoffAt: Date
  driveType: 'WITH_DRIVER' | 'SELF_DRIVE'
  distanceKm: string | null
  note: string | null
}): string {
  const lines = [
    'Booking request',
    `Pickup: ${params.pickupAddress}`,
    `Drop-off: ${params.dropoffAddress}`,
    `From: ${formatBookingDateTime(params.pickupAt)}`,
    `To: ${formatBookingDateTime(params.dropoffAt)}`,
    `Drive: ${driveTypeLabel(params.driveType)}`,
  ]
  if (params.distanceKm) {
    lines.push(`Distance: ${params.distanceKm} km`)
  }
  if (params.note?.trim()) {
    lines.push(`Note: ${params.note.trim()}`)
  }
  return lines.join('\n')
}
