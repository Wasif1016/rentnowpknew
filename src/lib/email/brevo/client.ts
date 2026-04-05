/**
 * Brevo (Sendinblue) transactional email API — server-only.
 * https://developers.brevo.com/reference/sendtransacemail
 */

export type BrevoTransactionalPayload = {
  sender: { name: string; email: string }
  to: { email: string }[]
  templateId: number
  /** Keys must match placeholder names configured in the Brevo template. */
  params?: Record<string, string | number | boolean>
}

export type BrevoSendResponse = {
  messageId?: string
}

export async function brevoSendTransactional(
  payload: BrevoTransactionalPayload
): Promise<BrevoSendResponse> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey?.trim()) {
    throw new Error("BREVO_API_KEY is not configured")
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(25_000),
  })

  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Brevo HTTP ${res.status}: ${text.slice(0, 600)}`)
  }

  if (!text) return {}
  try {
    return JSON.parse(text) as BrevoSendResponse
  } catch {
    return {}
  }
}
