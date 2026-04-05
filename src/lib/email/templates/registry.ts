/**
 * Logical email kinds → Brevo transactional template IDs (env).
 * Add a row here + env var + template in Brevo dashboard for each new email.
 */

export const EMAIL_TEMPLATE_KEYS = [
  "VENDOR_VERIFICATION_APPROVED",
  "VENDOR_VERIFICATION_REJECTED",
] as const

export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number]

const ENV_BY_KEY: Record<EmailTemplateKey, string | undefined> = {
  VENDOR_VERIFICATION_APPROVED: process.env.BREVO_TEMPLATE_VENDOR_VERIFICATION_APPROVED,
  VENDOR_VERIFICATION_REJECTED: process.env.BREVO_TEMPLATE_VENDOR_VERIFICATION_REJECTED,
}

export function getBrevoTemplateId(key: EmailTemplateKey): number {
  const raw = ENV_BY_KEY[key]?.trim()
  if (!raw) {
    throw new Error(
      `Missing Brevo template id env for "${key}" (set the matching BREVO_TEMPLATE_* variable)`
    )
  }
  const n = Number.parseInt(raw, 10)
  if (Number.isNaN(n) || n < 1) {
    throw new Error(`Invalid numeric template id for "${key}"`)
  }
  return n
}
