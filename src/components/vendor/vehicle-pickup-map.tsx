'use client'

import { useEffect, useRef, useState } from 'react'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { cn } from '@/lib/utils'

/** Default map center (Bahawalnagar, PK) — user should search or move the pin. */
const DEFAULT_CENTER = { lat: 29.3956, lng: 71.6832 }

type VehiclePickupMapProps = {
  fieldError?: string
  className?: string
}

/**
 * Google Maps + Places Autocomplete for primary vehicle pickup.
 * Submits hidden fields: pickupLatitude, pickupLongitude, pickupPlaceId, pickupFormattedAddress.
 */
export function VehiclePickupMap({ fieldError, className }: VehiclePickupMapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mapInstRef = useRef<google.maps.Map | null>(null)
  const markerInstRef = useRef<google.maps.Marker | null>(null)
  const [pickup, setPickup] = useState({
    lat: '',
    lng: '',
    placeId: '',
    formattedAddress: '',
  })
  const [mapError, setMapError] = useState<string | null>(null)

  const configError =
    typeof process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'string' &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.trim().length > 0
      ? null
      : 'Maps are not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.'

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()
    if (!apiKey) {
      return
    }
    if (!mapDivRef.current || !searchInputRef.current) return

    let cancelled = false

    const applyPosition = (
      lat: number,
      lng: number,
      placeId: string,
      formattedAddress: string
    ) => {
      if (cancelled) return
      setPickup({
        lat: String(lat),
        lng: String(lng),
        placeId,
        formattedAddress,
      })
    }

    setOptions({ key: apiKey, v: 'weekly' })

    Promise.all([
      importLibrary('maps'),
      importLibrary('places'),
      importLibrary('marker'),
    ])
      .then(async () => {
        if (cancelled || !mapDivRef.current || !searchInputRef.current) return

        const map = new google.maps.Map(mapDivRef.current, {
          center: DEFAULT_CENTER,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })
        mapInstRef.current = map

        const marker = new google.maps.Marker({
          map,
          position: DEFAULT_CENTER,
          draggable: true,
          title: 'Pickup location',
        })
        markerInstRef.current = marker

        applyPosition(
          DEFAULT_CENTER.lat,
          DEFAULT_CENTER.lng,
          '',
          ''
        )

        const autocomplete = new google.maps.places.Autocomplete(
          searchInputRef.current,
          {
            fields: ['place_id', 'geometry', 'formatted_address'],
            types: ['geocode'],
          }
        )
        autocomplete.bindTo('bounds', map)

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.geometry?.location) return
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          map.panTo({ lat, lng })
          marker.setPosition({ lat, lng })
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport)
          }
          applyPosition(
            lat,
            lng,
            place.place_id ?? '',
            place.formatted_address ?? ''
          )
        })

        marker.addListener('dragend', () => {
          const pos = marker.getPosition()
          if (!pos) return
          applyPosition(pos.lat(), pos.lng(), '', '')
        })
      })
      .catch(() => {
        if (!cancelled) {
          setMapError('Could not load Google Maps. Check your API key and billing.')
        }
      })

    return () => {
      cancelled = true
      const m = mapInstRef.current
      const mk = markerInstRef.current
      if (m) google.maps.event.clearInstanceListeners(m)
      if (mk) google.maps.event.clearInstanceListeners(mk)
      mapInstRef.current = null
      markerInstRef.current = null
    }
  }, [])

  const err = configError ?? mapError ?? fieldError

  return (
    <div className={cn('space-y-3', className)}>
      <input type="hidden" name="pickupLatitude" value={pickup.lat} readOnly />
      <input type="hidden" name="pickupLongitude" value={pickup.lng} readOnly />
      <input type="hidden" name="pickupPlaceId" value={pickup.placeId} readOnly />
      <input type="hidden" name="pickupFormattedAddress" value={pickup.formattedAddress} readOnly />

      <Field data-invalid={!!err}>
        <FieldLabel htmlFor="pickup-search">Pickup location</FieldLabel>
        <FieldDescription>
          Search for an address or place, then fine-tune by dragging the pin. Must be in Pakistan.
        </FieldDescription>
        <input
          id="pickup-search"
          ref={searchInputRef}
          type="text"
          autoComplete="off"
          placeholder="Search e.g. Model Town, Bahawalnagar"
          disabled={!!configError}
          className={cn(
            'border-input bg-input/30 text-foreground placeholder:text-muted-foreground',
            'focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-colors outline-none focus-visible:ring-[3px] md:text-sm',
            'bg-card border-border'
          )}
        />
        <div
          ref={mapDivRef}
          className="border-border bg-muted mt-2 h-64 w-full rounded-md border md:h-80"
          role="presentation"
        />
        {err ? <FieldError>{err}</FieldError> : null}
      </Field>
    </div>
  )
}
