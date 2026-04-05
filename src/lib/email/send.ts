import { brevoSendTransactional } from "./brevo/client"
import { getBrevoTemplateId, type EmailTemplateKey } from "./templates/registry"

function requireSenderEmail(): string {
  const v = process.env.BREVO_SENDER_EMAIL?.trim()
  if (!v) throw new Error("BREVO_SENDER_EMAIL is not configured")
  return v
}

function senderName(): string {
  return process.env.BREVO_SENDER_NAME?.trim() || "RentNowPk"
}

export async function sendTransactionalEmail(options: {
  templateKey: EmailTemplateKey
  to: string
  params: Record<string, string | number | boolean>
}): Promise<void> {
  const templateId = getBrevoTemplateId(options.templateKey)
  const email = options.to.trim().toLowerCase()
  if (!email) throw new Error("Recipient email is empty")

  const stringParams: Record<string, string> = {}
  for (const [k, v] of Object.entries(options.params)) {
    stringParams[k] = String(v)
  }

  await brevoSendTransactional({
    sender: { name: senderName(), email: requireSenderEmail() },
    to: [{ email }],
    templateId,
    params: stringParams,
  })
}
