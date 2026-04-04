// Notifications helper — in-app rows now; email/SMS via Brevo/Twilio later.

import { db } from '@/lib/db'
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
}

export interface NotificationResult {
  inApp?: { success: boolean; error?: string }
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
) {
  try {
    await db.insert(notifications).values({
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
    return { success: true }
  } catch (error) {
    console.error('Failed to create in-app notification:', error)
    return { success: false, error: String(error) }
  }
}

async function sendEmailNotification(email: string, subject: string, htmlBody: string) {
  console.log(`[Email] To: ${email}, Subject: ${subject}, bodyLength: ${htmlBody.length}`)
  return { success: true }
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
  } = options

  const result: NotificationResult = {}

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user) {
    console.error(`User not found: ${userId}`)
    return result
  }

  if (sendInApp) {
    result.inApp = await createInAppNotification(userId, type, title, body, {
      actionUrl,
      entityType,
      entityId,
    })
  }

  if (sendEmail && user.email) {
    result.email = await sendEmailNotification(user.email, title, body)
  }

  const shouldSendSms =
    sendSms && SMS_ENABLED_TYPES.includes(type) && user.phone

  if (shouldSendSms) {
    const smsBody = body.length > 160 ? `${body.slice(0, 157)}...` : body
    result.sms = await sendSmsNotification(user.phone!, smsBody)
  }

  return result
}
