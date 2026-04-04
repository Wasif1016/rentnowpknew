export type AppRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN'

const ROLE_HOME: Record<AppRole, string> = {
  CUSTOMER: '/customer',
  VENDOR: '/vendor',
  ADMIN: '/admin',
}

/** Allowed relative paths for post-login / post-callback redirects (same-origin only). */
const PREFIXES = ['/vendor', '/customer', '/admin'] as const

/**
 * Returns a safe internal path or `fallback` if the value is missing or unsafe.
 */
export function sanitizeNextPath(input: string | null | undefined, fallback: string): string {
  if (!input || typeof input !== 'string') return fallback
  let path = input.trim()
  try {
    path = decodeURIComponent(path)
  } catch {
    return fallback
  }
  const q = path.indexOf('?')
  if (q >= 0) path = path.slice(0, q)
  if (!path.startsWith('/') || path.startsWith('//')) return fallback
  const ok = PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))
  return ok ? path : fallback
}

export function defaultPathForRole(role: AppRole): string {
  return ROLE_HOME[role] ?? '/vendor'
}

export function resolveRedirectAfterLogin(role: AppRole, next: string | null | undefined): string {
  const fb = defaultPathForRole(role)
  const candidate = sanitizeNextPath(next, fb)
  if (role === 'VENDOR' && (candidate.startsWith('/customer') || candidate.startsWith('/admin')))
    return fb
  if (role === 'CUSTOMER' && (candidate.startsWith('/vendor') || candidate.startsWith('/admin')))
    return fb
  if (role === 'ADMIN' && (candidate.startsWith('/vendor') || candidate.startsWith('/customer')))
    return fb
  return candidate
}
