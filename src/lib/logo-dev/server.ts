import 'server-only'

import { logoDevMakeImageUrl } from '@/lib/logo-dev/make-image-url'

const LOGO_SIZE = 256

/**
 * Public HTTPS URL to the Logo.dev name endpoint (PNG).
 * Uses `NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY` or `LOGO_DEV_PUBLISHABLE_KEY`.
 */
export function buildLogoDevMakeImageUrl(make: string): string | null {
  const token =
    process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY?.trim() ??
    process.env.LOGO_DEV_PUBLISHABLE_KEY?.trim()
  return logoDevMakeImageUrl(make, token, LOGO_SIZE)
}
