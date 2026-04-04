import 'server-only'

import { getGoogleMapsServerKey } from '@/lib/google-maps/config'

export type DrivingRouteSummary = {
  /** Driving distance along roads (km). */
  distanceKm: number
  /** Typical duration in traffic-agnostic model (seconds). */
  durationSeconds: number
}

const DIRECTIONS_BASE = 'https://maps.googleapis.com/maps/api/directions/json'

/**
 * Driving distance and duration between two WGS84 points (same model as Google Maps driving directions).
 */
export async function getDrivingRouteSummary(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<DrivingRouteSummary | null> {
  const key = getGoogleMapsServerKey()
  const origin = `${originLat},${originLng}`
  const destination = `${destLat},${destLng}`
  const params = new URLSearchParams({
    origin,
    destination,
    key,
  })
  const res = await fetch(`${DIRECTIONS_BASE}?${params.toString()}`, {
    next: { revalidate: 0 },
  })
  if (!res.ok) return null

  const data = (await res.json()) as {
    status: string
    routes?: Array<{
      legs?: Array<{
        distance?: { value: number }
        duration?: { value: number }
      }>
    }>
  }

  if (data.status !== 'OK' || !data.routes?.[0]?.legs?.[0]) {
    return null
  }

  const leg = data.routes[0].legs[0]
  const meters = leg.distance?.value
  const seconds = leg.duration?.value
  if (meters == null || seconds == null) return null

  return {
    distanceKm: meters / 1000,
    durationSeconds: seconds,
  }
}
