/**
 * Builds a Logo.dev "name" image URL (PNG). Safe to use in the browser with the
 * publishable key from `NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY`.
 */
export function logoDevMakeImageUrl(
  make: string,
  token: string | null | undefined,
  size = 128
): string | null {
  const t = typeof token === 'string' ? token.trim() : ''
  if (!t) return null
  const name = make.trim()
  if (!name) return null
  const q = new URLSearchParams({
    token: t,
    size: String(size),
    format: 'png',
  })
  return `https://img.logo.dev/name/${encodeURIComponent(name)}?${q.toString()}`
}
