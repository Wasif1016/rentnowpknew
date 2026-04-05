// Notifications helper — in-app rows; email via Brevo transactional templates; SMS stub for later.

import { db } from '@/lib/db'
import { sendTransactionalEmail, type EmailTemplateKey } from '@/lib/email'
import { notifications, notificationTypeEnum, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type NotificationType = (typeof notificationTypeEnum.enumValues)[number]

export interface SendNotificationOptions {
  userId: string
  type: NotificationType
  title: string
  body: string
  actionUrl?: string
  entityType?: string
  entityId?: string
  sendSms?: boolean
  sendEmail?: boolean
  sendInApp?: boolean
  /** When sendEmail is true, use this Brevo template + params (required for email delivery). */
  emailTemplateKey?: EmailTemplateKey
  /** Must match placeholder names in the Brevo template (e.g. BUSINESS_NAME). */
  emailParams?: Record<string, string | number | boolean>
}

export interface NotificationResult {
  inApp?: { success: boolean; error?: string; notificationId?: string }
  email?: { success: boolean; error?: string }
  sms?: { success: boolean; error?: string }
}

const SMS_ENABLED_TYPES: NotificationType[] = ['BOOKING', 'CONTACT_FLAG']

async function createInAppNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  options?: {
    actionUrl?: string
    entityType?: string
    entityId?: string
  }
): Promise<{ success: boolean; error?: string; notificationId?: string }> {
  try {
    const [row] = await db
      .insert(notifications)
      .values({
        userId,
        type,
        title,
        body,
        actionUrl: options?.actionUrl,
        entityType: options?.entityType,
        entityId: options?.entityId,
        sentInApp: true,
        isRead: false,
      })
      .returning({ id: notifications.id })
    return { success: true, notificationId: row?.id }
  } catch (error) {
    console.error('Failed to create in-app notification:', error)
    return { success: false, error: String(error) }
  }
}

async function sendEmailViaBrevo(
  email: string,
  templateKey: EmailTemplateKey,
  params: Record<string, string | number | boolean>
) {
  const stringParams: Record<string, string> = {}
  for (const [k, v] of Object.entries(params)) {
    stringParams[k] = String(v)
  }
  await sendTransactionalEmail({
    templateKey,
    to: email,
    params: stringParams,
  })
  return { success: true as const }
}

async function sendSmsNotification(phone: string, body: string) {
  console.log(`[SMS] To: ${phone}, Body: ${body}`)
  return { success: true }
}

export async function sendNotification(options: SendNotificationOptions): Promise<NotificationResult> {
  const {
    userId,
    type,
    title,
    body,
    actionUrl,
    entityType,
    entityId,
    sendInApp = true,
    sendEmail = false,
    sendSms = false,
    emailTemplateKey,
    emailParams,
  } = options

  const result: NotificationResult = {}

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user) {
    console.error(`User not found: ${userId}`)
    return result
  }

  if (sendInApp) {
    const inApp = await createInAppNotification(userId, type, title, body, {
      actionUrl,
      entityType,
      entityId,
    })
    result.inApp = inApp
  }

  if (sendEmail && user.email) {
    if (!emailTemplateKey || !emailParams) {
      result.email = {
        success: false,
        error: 'emailTemplateKey and emailParams are required when sendEmail is true',
      }
    } else {
      try {
        await sendEmailViaBrevo(user.email, emailTemplateKey, emailParams)
        result.email = { success: true }
        if (result.inApp?.notificationId) {
          await db
            .update(notifications)
            .set({ sentEmail: true })
            .where(eq(notifications.id, result.inApp.notificationId))
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error('Brevo email failed:', msg)
        result.email = { success: false, error: msg }
      }
    }
  }

  const shouldSendSms =
    sendSms && SMS_ENABLED_TYPES.includes(type) && user.phone

  if (shouldSendSms) {
    const smsBody = body.length > 160 ? `${body.slice(0, 157)}...` : body
    result.sms = await sendSmsNotification(user.phone!, smsBody)
  }

  return result
}
