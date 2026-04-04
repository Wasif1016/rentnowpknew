'use client'

import { useEffect, useRef } from 'react'
import { showToast } from '@/components/ui/toast'

/**
 * One-shot success toast after redirect from add-vehicle; strips `?created=1` from the URL bar.
 */
export function VehicleCreatedToast({ show }: { show: boolean }) {
  const fired = useRef(false)

  useEffect(() => {
    if (!show || fired.current) return
    fired.current = true
    showToast('Vehicle saved.', { type: 'success' })
    const u = new URL(window.location.href)
    u.searchParams.delete('created')
    const next = u.pathname + (u.search ? u.search : '') + u.hash
    window.history.replaceState(null, '', next)
  }, [show])

  return null
}
