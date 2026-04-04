/**
 * Server-only Google Maps Platform key (Place Details, Directions, Geocoding).
 * Never expose to the browser — use NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for Maps JS.
 */
export function getGoogleMapsServerKey(): string {
  const k = process.env.GOOGLE_MAPS_SERVER_KEY
  if (!k?.trim()) {
    throw new Error(
      'GOOGLE_MAPS_SERVER_KEY is not set. Add it for Places/Directions on the server.'
    )
  }
  return k.trim()
}
