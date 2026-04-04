import { Inngest } from "inngest"

export const inngest = new Inngest({ id: "rentnowpk" })

/** Event names for future workflows (booking, chat, reviews). */
export const INNGEST_EVENTS = {
  BOOKING_CREATED: "booking/created",
  BOOKING_CONFIRMED: "booking/confirmed",
  BOOKING_REJECTED: "booking/rejected",
  BOOKING_CANCELLED: "booking/cancelled",
  REVIEW_PROMPT_SCHEDULED: "review/prompt.scheduled",
  MESSAGE_NOTIFICATION: "message/notification",
} as const

export type InngestEvent<T extends keyof typeof INNGEST_EVENTS> = {
  name: (typeof INNGEST_EVENTS)[T]
  data: Record<string, unknown>
}
