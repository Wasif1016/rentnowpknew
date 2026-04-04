// Notifications helper - single source of truth for sending notifications
// Uses Resend for email, Twilio for SMS, and in-app notifications
// Never call Twilio or Resend directly - always use this helper

import { db } from '@/lib/db'
import { notifications, users, notificationTypeEnum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// ============================================================
// TYPES
// ============================================================

export type NotificationType =
  | 'LEAD'
  | 'QUOTE'
  | 'JOB'
  | 'PAYMENT'
  | 'REVIEW'
  | 'DISPUTE'
  | 'SYSTEM'
  | 'MESSAGE'

export interface SendNotificationOptions {
  userId: string
  type: NotificationType
  title: string
  body: string
  actionUrl?: string
  entityType?: 'LEAD' | 'QUOTE' | 'JOB' | 'PAYMENT' | 'REVIEW' | 'DISPUTE' | 'SYSTEM' | 'MESSAGE'
  entityId?: string
  // Channels - omit any you don't want
  sendSms?: boolean
  sendEmail?: boolean
  sendInApp?: boolean
}

export interface NotificationResult {
  inApp?: { success: boolean; error?: string }
  email?: { success: boolean; error?: string }
  sms?: { success: boolean; error?: string }
}

// ============================================================
// SMS NOTIFICATION TYPES (only for high urgency events)
// ============================================================

const SMS_ENABLED_TYPES = ['LEAD', 'QUOTE', 'DISPUTE', 'JOB', 'PAYMENT'] as const

// ============================================================
// IN-APP NOTIFICATION
// ============================================================

/**
 * Create in-app notification
 */
async function createInAppNotification(
  userId: string,
  title: string,
  body: string,
  options?: {
    actionUrl?: string
    entityType?: 'LEAD' | 'QUOTE' | 'JOB' | 'PAYMENT' | 'REVIEW' | 'DISPUTE' | 'SYSTEM' | 'MESSAGE'
    entityId?: string
  }
) {
  try {
    await db.insert(notifications).values({
      userId,
      type: options?.entityType || 'SYSTEM',
      title,
      body,
      actionUrl: options?.actionUrl,
      entityType: options?.entityType,
      entityId: options?.entityId,
      isRead: false,
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to create in-app notification:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================================
// EMAIL NOTIFICATION
// ============================================================

/**
 * Send email notification via Resend
 */
async function sendEmailNotification(
  email: string,
  subject: string,
  body: string
) {
  // TODO: Implement with Resend
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  //
  // await resend.emails.send({
  //   from: process.env.FROM_EMAIL || 'notifications@paintpro.com',
  //   to: email,
  //   subject,
  //   html: body,
  // })

  console.log(`[Email] To: ${email}, Subject: ${subject}`)
  return { success: true }
}

// ============================================================
// SMS NOTIFICATION
// ============================================================

/**
 * Send SMS notification via Twilio
 */
async function sendSmsNotification(
  phone: string,
  body: string
) {
  // TODO: Implement with Twilio
  // import twilio from 'twilio'
  // const client = twilio(
  //   process.env.TWILIO_ACCOUNT_SID,
  //   process.env.TWILIO_AUTH_TOKEN
  // )
  //
  // await client.messages.create({
  //   body,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phone,
  // })

  console.log(`[SMS] To: ${phone}, Body: ${body}`)
  return { success: true }
}

// ============================================================
// MAIN SEND NOTIFICATION FUNCTION
// ============================================================

/**
 * Send notification - the main function to use throughout the codebase
 * Supports in-app, email, and SMS channels
 */
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
    sendEmail = true,
    sendSms = false,
  } = options

  const result: NotificationResult = {}

  // Get user for contact info
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    console.error(`User not found: ${userId}`)
    return result
  }

  // In-app notification (always enabled by default)
  if (sendInApp) {
    result.inApp = await createInAppNotification(userId, title, body, {
      actionUrl,
      entityType,
      entityId,
    })
  }

  // Email notification (always enabled by default)
  if (sendEmail && user.email) {
    result.email = await sendEmailNotification(user.email, title, body)
  }

  // SMS notification (only for high urgency events)
  // Per architecture.md: LEAD, JOB, PAYMENT, DISPUTE for painters
  // HOMEONWER: COMPLETE_PENDING, auto-release WARNING
  const smsEnabledForType = SMS_ENABLED_TYPES.includes(type as any)
  const shouldSendSms = sendSms && smsEnabledForType && user.phone

  if (shouldSendSms) {
    // Shorten message for SMS
    const smsBody = body.length > 160 ? body.substring(0, 157) + '...' : body
    result.sms = await sendSmsNotification(user.phone!, smsBody)
  }

  return result
}

// ============================================================
// SPECIALIZED HELPERS
// ============================================================

/**
 * Send lead notification to painter
 */
export async function notifyPainterOfNewLead(
  painterId: string,
  projectCity: string,
  jobType: string,
  leadId: string
) {
  return sendNotification({
    userId: painterId,
    type: 'LEAD',
    title: 'New lead in your area',
    body: `A homeowner in ${projectCity} needs ${jobType} work`,
    actionUrl: `/painter/leads/${leadId}`,
    entityType: 'LEAD',
    entityId: leadId,
    sendSms: true, // HIGH PRIORITY
    sendEmail: true,
    sendInApp: true,
  })
}

/**
 * Notify homeowner of new quote
 */
export async function notifyHomeownerOfNewQuote(
  homeownerId: string,
  painterName: string,
  projectTitle: string,
  quoteId: string
) {
  return sendNotification({
    userId: homeownerId,
    type: 'QUOTE',
    title: 'New quote received',
    body: `${painterName} submitted a quote for "${projectTitle}"`,
    actionUrl: `/dashboard/quotes/${quoteId}`,
    entityType: 'QUOTE',
    entityId: quoteId,
    sendEmail: true,
    sendInApp: true,
  })
}

/**
 * Notify homeowner that job is complete (release payment)
 */
export async function notifyHomeownerJobComplete(
  homeownerId: string,
  jobId: string,
  painterName: string
) {
  return sendNotification({
    userId: homeownerId,
    type: 'JOB',
    title: 'Job marked complete',
    body: `${painterName} has marked the job as complete. Review and release payment.`,
    actionUrl: `/dashboard/jobs/${jobId}`,
    entityType: 'JOB',
    entityId: jobId,
    sendSms: true, // HIGH PRIORITY
    sendEmail: true,
    sendInApp: true,
  })
}

/**
 * Notify painter of payment released
 */
export async function notifyPainterPaymentReleased(
  painterId: string,
  jobId: string,
  amount: string
) {
  return sendNotification({
    userId: painterId,
    type: 'PAYMENT',
    title: 'Payment released!',
    body: `$${amount} has been deposited to your account.`,
    actionUrl: `/painter/jobs/${jobId}`,
    entityType: 'JOB',
    entityId: jobId,
    sendSms: true, // HIGH PRIORITY
    sendEmail: true,
    sendInApp: true,
  })
}

/**
 * Notify both parties of dispute
 */
export async function notifyOfDispute(
  homeownerId: string,
  painterId: string,
  jobId: string,
  disputeId: string
) {
  // Notify homeowner
  sendNotification({
    userId: homeownerId,
    type: 'DISPUTE',
    title: 'Dispute raised',
    body: 'You raised a dispute. Both parties have 48 hours to submit evidence.',
    actionUrl: `/dashboard/disputes/${disputeId}`,
    entityType: 'DISPUTE',
    entityId: disputeId,
    sendSms: true, // HIGH PRIORITY
    sendEmail: true,
    sendInApp: true,
  })

  // Notify painter
  return sendNotification({
    userId: painterId,
    type: 'DISPUTE',
    title: 'Dispute raised',
    body: 'The homeowner has raised a dispute. Please respond within 48 hours.',
    actionUrl: `/painter/disputes/${disputeId}`,
    entityType: 'DISPUTE',
    entityId: disputeId,
    sendSms: true, // HIGH PRIORITY
    sendEmail: true,
    sendInApp: true,
  })
}
