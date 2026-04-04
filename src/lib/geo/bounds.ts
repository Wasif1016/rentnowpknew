/**
 * Rough bounding box for Pakistan (mainland). Used to reject obviously wrong coordinates.
 * Values are approximate; extend if you need AJK/Gilgit precision.
 */
export const PAKISTAN_BOUNDS = {
  minLat: 23.5,
  maxLat: 37.2,
  minLng: 60.5,
  maxLng: 77.5,
} as const

export function isWithinPakistanBounds(lat: number, lng: number): boolean {
  return (
    lat >= PAKISTAN_BOUNDS.minLat &&
    lat <= PAKISTAN_BOUNDS.maxLat &&
    lng >= PAKISTAN_BOUNDS.minLng &&
    lng <= PAKISTAN_BOUNDS.maxLng
  )
}
