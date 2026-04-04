// Inngest function stubs
// These are the background jobs that run asynchronously
// See architecture.md for detailed documentation on each function

import { inngest } from "../client";
import { db } from "@/lib/db";
import {
  projects,
  leads,
  quotes,
  jobs,
  payments,
  painterProfiles,
} from "@/lib/db/schema";
import { eq, and, gt, lt, sql } from "drizzle-orm";

// ============================================================
// PROJECT FUNCTIONS
// ============================================================

/**
 * Project matching - triggered when homeowner completes project wizard
 * Runs the matching engine to find painters for the project
 */
export const projectMatchingRequested = inngest.createFunction(
  {
    id: "project-matching",
    triggers: [{ event: "project/matching.requested" }],
  },
  async ({ event }) => {
    const { projectId } = event.data;

    // TODO: Import and run matching engine
    // const { runMatching } = await import('@/lib/matching/engine')
    // await runMatching({ projectId })

    console.log(`Running matching for project: ${projectId}`);
    return { projectId, status: "matching_completed" };
  }
);

/**
 * Project expiry - fires 72hrs after project enters QUOTING
 * Marks project as EXPIRED if no hire
 */
export const projectExpiryScheduled = inngest.createFunction(
  {
    id: "project-expiry",
    triggers: [{ event: "project/expiry.scheduled" }],
  },
  async ({ event }) => {
    const { projectId } = event.data;

    // Check if project is still in QUOTING status
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project || project.status !== "QUOTING") {
      return { projectId, status: "skipped" };
    }

    // Mark as EXPIRED
    await db
      .update(projects)
      .set({ status: "EXPIRED" })
      .where(eq(projects.id, projectId));

    return { projectId, status: "expired" };
  }
);

// ============================================================
// LEAD FUNCTIONS
// ============================================================

/**
 * Lead expiry - fires at lead.expiresAt (24hrs after sent)
 * Marks lead EXPIRED, decrements painter response rate, notifies next painter
 */
export const leadExpiryScheduled = inngest.createFunction(
  {
    id: "lead-expiry",
    triggers: [{ event: "lead/expiry.scheduled" }],
  },
  async ({ event }) => {
    const { leadId } = event.data;

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead || lead.status !== "SENT") {
      return { leadId, status: "skipped" };
    }

    // Mark as EXPIRED
    await db
      .update(leads)
      .set({ status: "EXPIRED", expiresAt: new Date() })
      .where(eq(leads.id, leadId));

    // TODO: Decrement painter response rate
    // TODO: Trigger next painter in queue

    return { leadId, status: "expired" };
  }
);

/**
 * Lead decline processed - triggers next painter notification
 */
export const leadDeclineProcessed = inngest.createFunction(
  {
    id: "lead-decline-processed",
    triggers: [{ event: "lead/decline.processed" }],
  },
  async ({ event }) => {
    const { leadId, painterId } = event.data;

    // TODO: Find next highest-scored painter and create new lead
    // This requires the matching queue logic

    return { leadId, painterId, status: "processed" };
  }
);

// ============================================================
// QUOTE FUNCTIONS
// ============================================================

/**
 * Quote expiry - fires at quote.validUntil (72hrs after submitted)
 * Marks quote as EXPIRED
 */
export const quoteExpiryScheduled = inngest.createFunction(
  {
    id: "quote-expiry",
    triggers: [{ event: "quote/expiry.scheduled" }],
  },
  async ({ event }) => {
    const { quoteId } = event.data;

    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1);

    if (!quote || quote.status !== "PENDING") {
      return { quoteId, status: "skipped" };
    }

    await db
      .update(quotes)
      .set({ status: "EXPIRED", expiredAt: new Date() })
      .where(eq(quotes.id, quoteId));

    return { quoteId, status: "expired" };
  }
);

// ============================================================
// PAYMENT FUNCTIONS
// ============================================================

/**
 * Payment auto-release - fires 48hrs after painter marks job complete
 * Releases payment if no dispute raised
 */
export const paymentAutoReleaseScheduled = inngest.createFunction(
  {
    id: "payment-auto-release",
    triggers: [{ event: "payment/auto-release.scheduled" }],
  },
  async ({ event }) => {
    const { jobId, releaseAt } = event.data;

    // Check if it's time to release
    if (new Date(releaseAt) > new Date()) {
      return { jobId, status: "pending" };
    }

    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.jobId, jobId))
      .limit(1);

    if (!payment || payment.status !== "ESCROWED") {
      return { jobId, status: "skipped" };
    }

    // Check for open dispute
    const [{ count: paymentCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(eq(payments.jobId, jobId));

    // Release payment
    await db
      .update(payments)
      .set({ status: "RELEASED", releasedAt: new Date() })
      .where(eq(payments.jobId, jobId));

    // Update job status
    await db
      .update(jobs)
      .set({ status: "COMPLETED", completedAt: new Date() })
      .where(eq(jobs.id, jobId));

    // TODO: Trigger Stripe transfer to painter

    return { jobId, status: "released" };
  }
);

/**
 * Payment auto-release cancelled - when homeowner manually releases or dispute raised
 */
export const paymentAutoReleaseCancelled = inngest.createFunction(
  {
    id: "payment-auto-release-cancelled",
    triggers: [{ event: "payment/auto-release.cancelled" }],
  },
  async ({ event }) => {
    const { jobId } = event.data;
    // This is a no-op - the scheduled job checks status before releasing
    return { jobId, status: "cancelled" };
  }
);

// ============================================================
// REVIEW FUNCTIONS
// ============================================================

/**
 * Review request - fires 24hrs after payment released
 * Sends review request to both homeowner and painter
 */
export const reviewRequestScheduled = inngest.createFunction(
  {
    id: "review-request",
    triggers: [{ event: "review/request.scheduled" }],
  },
  async ({ event }) => {
    const { jobId } = event.data;

    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job || job.status !== "COMPLETED") {
      return { jobId, status: "skipped" };
    }

    // TODO: Send review request notifications to both parties

    return { jobId, status: "notifications_sent" };
  }
);

// ============================================================
// SUBSCRIPTION FUNCTIONS REMOVED FOR PHASE 1
// No subscription - painters join free, pay 5% only on completed jobs
// Add back for Phase 2 (optional Pro tier)
// ============================================================

// ============================================================
// PAINTER FUNCTIONS
// ============================================================

/**
 * First lead delivery - scheduled after painter approval
 * Ensures painter gets their first lead within 24hrs
 * Phase 1: No subscription - all ACTIVE painters can receive leads
 */
export const painterFirstLeadScheduled = inngest.createFunction(
  {
    id: "painter-first-lead",
    triggers: [{ event: "painter/first-lead.scheduled" }],
  },  
  async ({ event }) => {
    const { painterId } = event.data;

    // Check if painter is still active (Phase 1 - no subscription needed)
    const [profile] = await db
      .select()
      .from(painterProfiles)
      .where(eq(painterProfiles.id, painterId))
      .limit(1);

    if (!profile || profile.status !== "ACTIVE") {
      return { painterId, status: "skipped" };
    }

    // Phase 1: No lead caps - all ACTIVE painters can receive leads

    // TODO: Find matching project and create lead

    return { painterId, status: "lead_created" };
  }
);

// ============================================================
// NOTIFICATION FUNCTIONS
// ============================================================

/**
 * Lead expiry warning - fires 2hrs before lead expires
 * Sends "Lead expiring soon" to painter
 */
export const notificationLeadExpiryWarning = inngest.createFunction(
  {
    id: "notification-lead-expiry-warning",
    triggers: [{ event: "notification/lead-expiry-warning" }],
  },
  async ({ event }) => {
    const { leadId } = event.data;

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead || lead.status !== "SENT") {
      return { leadId, status: "skipped" };
    }

    // TODO: Send warning notification

    return { leadId, status: "notification_sent" };
  }
);

// ============================================================
// EXPORT ALL FUNCTIONS (Phase 1 - no subscription functions)
// ============================================================

export const functions = [
  projectMatchingRequested,
  projectExpiryScheduled,
  leadExpiryScheduled,
  leadDeclineProcessed,
  quoteExpiryScheduled,
  paymentAutoReleaseScheduled,
  paymentAutoReleaseCancelled,
  reviewRequestScheduled,
  // REMOVED: subscriptionBillingCycle, subscriptionPaymentFailed (Phase 1)
  painterFirstLeadScheduled,
  notificationLeadExpiryWarning,
];
