// Status constants — single source of truth for all status values
// Imported from schema.ts, but re-exported here for convenience
// All transitions defined in architecture.md

import {
  projectStatusEnum,
  leadStatusEnum,
  quoteStatusEnum,
  paymentStatusEnum,
  painterStatusEnum,
  jobStatusEnum,
  disputeStatusEnum,
  reviewerTypeEnum,
  jobTypeEnum,
  notificationTypeEnum,
  jobUpdateTypeEnum,
  cancellationRefundPolicyEnum,
} from '@/lib/db/schema'

// Re-export from schema for easy access
// NOTE: subscriptionStatusEnum and subscriptionTierEnum removed for Phase 1
export {
  projectStatusEnum,
  leadStatusEnum,
  quoteStatusEnum,
  paymentStatusEnum,
  painterStatusEnum,
  jobStatusEnum,
  disputeStatusEnum,
  reviewerTypeEnum,
  jobTypeEnum,
  notificationTypeEnum,
  jobUpdateTypeEnum,
  cancellationRefundPolicyEnum,
}

// ============================================================
// PROJECT STATUSES
// ============================================================

export const PROJECT_STATUS = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  MATCHING: 'MATCHING',
  QUOTING: 'QUOTING',
  HIRED: 'HIRED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE_PENDING: 'COMPLETE_PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  NO_SUPPLY: 'NO_SUPPLY',
  DISPUTED: 'DISPUTED',
  REFUNDED: 'REFUNDED',
  REFUNDED_PARTIAL: 'REFUNDED_PARTIAL',
  SPLIT_SETTLED: 'SPLIT_SETTLED',
} as const

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS]

// Valid transitions from architecture.md
export const PROJECT_STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  [PROJECT_STATUS.DRAFT]: [PROJECT_STATUS.OPEN],
  [PROJECT_STATUS.OPEN]: [PROJECT_STATUS.MATCHING, PROJECT_STATUS.CANCELLED],
  [PROJECT_STATUS.MATCHING]: [PROJECT_STATUS.QUOTING, PROJECT_STATUS.NO_SUPPLY],
  [PROJECT_STATUS.QUOTING]: [PROJECT_STATUS.HIRED, PROJECT_STATUS.EXPIRED, PROJECT_STATUS.CANCELLED],
  [PROJECT_STATUS.HIRED]: [PROJECT_STATUS.IN_PROGRESS, PROJECT_STATUS.REFUNDED, PROJECT_STATUS.REFUNDED_PARTIAL, PROJECT_STATUS.CANCELLED],
  [PROJECT_STATUS.IN_PROGRESS]: [PROJECT_STATUS.COMPLETE_PENDING],
  [PROJECT_STATUS.COMPLETE_PENDING]: [PROJECT_STATUS.COMPLETED, PROJECT_STATUS.DISPUTED],
  [PROJECT_STATUS.COMPLETED]: [],
  [PROJECT_STATUS.CANCELLED]: [],
  [PROJECT_STATUS.EXPIRED]: [],
  [PROJECT_STATUS.NO_SUPPLY]: [],
  [PROJECT_STATUS.DISPUTED]: [PROJECT_STATUS.COMPLETED, PROJECT_STATUS.REFUNDED, PROJECT_STATUS.SPLIT_SETTLED],
  [PROJECT_STATUS.REFUNDED]: [],
  [PROJECT_STATUS.REFUNDED_PARTIAL]: [],
  [PROJECT_STATUS.SPLIT_SETTLED]: [],
}

// ============================================================
// LEAD STATUSES
// ============================================================

export const LEAD_STATUS = {
  SENT: 'SENT',
  VIEWED: 'VIEWED',
  QUOTED: 'QUOTED',
  DECLINED: 'DECLINED',
  EXPIRED: 'EXPIRED',
} as const

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS]

export const LEAD_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  [LEAD_STATUS.SENT]: [LEAD_STATUS.VIEWED, LEAD_STATUS.DECLINED, LEAD_STATUS.EXPIRED],
  [LEAD_STATUS.VIEWED]: [LEAD_STATUS.QUOTED, LEAD_STATUS.DECLINED, LEAD_STATUS.EXPIRED],
  [LEAD_STATUS.QUOTED]: [],
  [LEAD_STATUS.DECLINED]: [],
  [LEAD_STATUS.EXPIRED]: [],
}

// ============================================================
// QUOTE STATUSES
// ============================================================

export const QUOTE_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  WITHDRAWN: 'WITHDRAWN',
} as const

export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS]

export const QUOTE_STATUS_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  [QUOTE_STATUS.PENDING]: [QUOTE_STATUS.ACCEPTED, QUOTE_STATUS.REJECTED, QUOTE_STATUS.EXPIRED, QUOTE_STATUS.WITHDRAWN],
  [QUOTE_STATUS.ACCEPTED]: [],
  [QUOTE_STATUS.REJECTED]: [],
  [QUOTE_STATUS.EXPIRED]: [],
  [QUOTE_STATUS.WITHDRAWN]: [],
}

// ============================================================
// PAYMENT STATUSES
// ============================================================

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  ESCROWED: 'ESCROWED',
  RELEASED: 'RELEASED',
  DISPUTED: 'DISPUTED',
  REFUNDED: 'REFUNDED',
  SPLIT: 'SPLIT',
} as const

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const PAYMENT_STATUS_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  [PAYMENT_STATUS.PENDING]: [PAYMENT_STATUS.ESCROWED],
  [PAYMENT_STATUS.ESCROWED]: [PAYMENT_STATUS.RELEASED, PAYMENT_STATUS.DISPUTED],
  [PAYMENT_STATUS.RELEASED]: [],
  [PAYMENT_STATUS.DISPUTED]: [PAYMENT_STATUS.RELEASED, PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.SPLIT],
  [PAYMENT_STATUS.REFUNDED]: [],
  [PAYMENT_STATUS.SPLIT]: [],
}

// ============================================================
// PAINTER STATUSES (Phase 1 - no subscription, no LEADS_PAUSED)
// ============================================================

export const PAINTER_STATUS = {
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  // REMOVED: LEADS_PAUSED (Phase 1 - no subscription)
  REJECTED: 'REJECTED',
  BACKGROUND_FAILED: 'BACKGROUND_FAILED',
  BANNED: 'BANNED',
} as const

export type PainterStatus = (typeof PAINTER_STATUS)[keyof typeof PAINTER_STATUS]

export const PAINTER_STATUS_TRANSITIONS: Record<PainterStatus, PainterStatus[]> = {
  [PAINTER_STATUS.PENDING_VERIFICATION]: [PAINTER_STATUS.ACTIVE, PAINTER_STATUS.REJECTED, PAINTER_STATUS.BACKGROUND_FAILED],
  [PAINTER_STATUS.ACTIVE]: [PAINTER_STATUS.SUSPENDED, PAINTER_STATUS.BANNED],
  [PAINTER_STATUS.SUSPENDED]: [PAINTER_STATUS.ACTIVE],
  // REMOVED: LEADS_PAUSED transition
  [PAINTER_STATUS.REJECTED]: [],
  [PAINTER_STATUS.BACKGROUND_FAILED]: [],
  [PAINTER_STATUS.BANNED]: [],
}

// ============================================================
// SUBSCRIPTION STATUSES AND TIERS REMOVED FOR PHASE 1
// No subscription - painters join free, pay 5% only on completed jobs
// Add back for Phase 2 (optional Pro tier with priority matching, etc.)
// ============================================================

// ============================================================
// JOB STATUSES (for internal job tracking)
// ============================================================

export const JOB_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE_PENDING: 'COMPLETE_PENDING',
  COMPLETED: 'COMPLETED',
  DISPUTED: 'DISPUTED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  SPLIT_SETTLED: 'SPLIT_SETTLED',
} as const

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS]

// ============================================================
// DISPUTE STATUSES
// ============================================================

export const DISPUTE_STATUS = {
  OPEN: 'OPEN',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RESOLVED_PAINTER: 'RESOLVED_PAINTER',
  RESOLVED_HOMEOWNER: 'RESOLVED_HOMEOWNER',
  SPLIT_RESOLVED: 'SPLIT_RESOLVED',
} as const

export type DisputeStatus = (typeof DISPUTE_STATUS)[keyof typeof DISPUTE_STATUS]

// ============================================================
// REVIEW TYPES
// ============================================================

export const REVIEW_TYPE = {
  HOMEOWNER: 'HOMEOWNER',
  PAINTER: 'PAINTER',
} as const

export type ReviewType = (typeof REVIEW_TYPE)[keyof typeof REVIEW_TYPE]

// ============================================================
// JOB TYPES
// ============================================================

export const JOB_TYPE = {
  INTERIOR_PAINT: 'INTERIOR_PAINT',
  EXTERIOR_PAINT: 'EXTERIOR_PAINT',
  DECK_STAIN: 'DECK_STAIN',
  POWER_WASH: 'POWER_WASH',
  DRYWALL_REPAIR: 'DRYWALL_REPAIR',
  CABINET_REFINISH: 'CABINET_REFINISH',
  FENCE_STAIN: 'FENCE_STAIN',
  GUTTER_CLEAN: 'GUTTER_CLEAN',
  EPOXY_FLOOR: 'EPOXY_FLOOR',
  OTHER: 'OTHER',
} as const

export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE]

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export const NOTIFICATION_TYPE = {
  LEAD: 'LEAD',
  QUOTE: 'QUOTE',
  JOB: 'JOB',
  PAYMENT: 'PAYMENT',
  REVIEW: 'REVIEW',
  DISPUTE: 'DISPUTE',
  SYSTEM: 'SYSTEM',
  MESSAGE: 'MESSAGE',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

// ============================================================
// CANCELLATION REFUND POLICY
// ============================================================

export const CANCELLATION_REFUND_POLICY = {
  FULL_REFUND: 'FULL_REFUND',
  PARTIAL_REFUND: 'PARTIAL_REFUND',
  NO_REFUND: 'NO_REFUND',
} as const

export type CancellationRefundPolicy = (typeof CANCELLATION_REFUND_POLICY)[keyof typeof CANCELLATION_REFUND_POLICY]

// ============================================================
// VALIDATION HELPERS
// ============================================================

export function isValidTransition(
  currentStatus: string,
  newStatus: string,
  transitions: Record<string, string[]>
): boolean {
  const allowedTransitions = transitions[currentStatus]
  return allowedTransitions?.includes(newStatus) ?? false
}

// Helper to check if a status is terminal (no further transitions)
export function isTerminalStatus(
  status: string,
  transitions: Record<string, string[]>
): boolean {
  return transitions[status]?.length === 0
}
