// Documentation: https://www.inngest.com/docs

import { Inngest } from "inngest"

export const inngest = new Inngest({ id: "paintpro" })

// ============================================================
// EVENT TYPES (Phase 1 - no subscription events)
// ============================================================

export const INNGEST_EVENTS = {
  // Project events
  PROJECT_MATCHING_REQUESTED: "project/matching.requested",
  PROJECT_EXPIRY_SCHEDULED: "project/expiry.scheduled",

  // Lead events
  LEAD_EXPIRY_SCHEDULED: "lead/expiry.scheduled",
  LEAD_DECLINE_PROCESSED: "lead/decline.processed",

  // Quote events
  QUOTE_EXPIRY_SCHEDULED: "quote/expiry.scheduled",

  // Payment events
  PAYMENT_AUTO_RELEASE_SCHEDULED: "payment/auto-release.scheduled",
  PAYMENT_AUTO_RELEASE_CANCELLED: "payment/auto-release.cancelled",

  // Review events
  REVIEW_REQUEST_SCHEDULED: "review/request.scheduled",

  // REMOVED: Subscription events (Phase 1 - no subscription)
  // SUBSCRIPTION_BILLING_CYCLE: "subscription/billing-cycle",
  // SUBSCRIPTION_PAYMENT_FAILED: "subscription/payment.failed",
  // SUBSCRIPTION_PAYMENT_SUCCEEDED: "subscription/payment.succeeded",

  // Painter events
  PAINTER_FIRST_LEAD_SCHEDULED: "painter/first-lead.scheduled",

  // Notification events
  NOTIFICATION_LEAD_EXPIRY_WARNING: "notification/lead-expiry-warning",
} as const;

// ============================================================
// TYPE HELPERS
// ============================================================

export type InngestEvent<T extends keyof typeof INNGEST_EVENTS> = {
  name: (typeof INNGEST_EVENTS)[T];
  data: Record<string, unknown>;
};
