"use server"

import { revalidatePath } from "next/cache"
import { and, eq, isNotNull } from "drizzle-orm"
import { z } from "zod"
import { getRequiredUser } from "@/lib/auth/session"
import {
  paramsVendorVerificationApproved,
  paramsVendorVerificationRejected,
} from "@/lib/email/templates/params"
import { db } from "@/lib/db"
import { vendorProfiles } from "@/lib/db/schema"
import { sendNotification } from "@/lib/notifications"

function appBaseUrl(): string {
  const u = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  if (!u) throw new Error("NEXT_PUBLIC_APP_URL is not set")
  return u
}

const vendorProfileIdSchema = z.string().uuid("Invalid vendor id.")

const rejectNoteSchema = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "Rejection reason is required.")
      .max(4000, "Reason is too long.")
  )

export type VendorDecisionResult =
  | { ok: true; emailSent: boolean; warning?: string }
  | { ok: false; message: string }

async function notifyVendorApproved(input: {
  userId: string
  vendorProfileId: string
  businessName: string
}): Promise<{ emailSent: boolean; warning?: string }> {
  const dashboardUrl = `${appBaseUrl()}/vendor`
  const params = paramsVendorVerificationApproved({
    businessName: input.businessName,
    dashboardUrl,
  })

  const result = await sendNotification({
    userId: input.userId,
    type: "VERIFICATION",
    title: "Your business is verified",
    body: `Great news — ${input.businessName} is approved on RentNowPk. Your vehicles can appear in search.`,
    actionUrl: "/vendor",
    entityType: "vendor_profile",
    entityId: input.vendorProfileId,
    sendInApp: true,
    sendEmail: true,
    emailTemplateKey: "VENDOR_VERIFICATION_APPROVED",
    emailParams: params,
  })

  if (result.email?.success) {
    return { emailSent: true }
  }
  return {
    emailSent: false,
    warning: result.email?.error
      ? `Decision saved, but email could not be sent: ${result.email.error}`
      : "Decision saved, but email could not be sent.",
  }
}

async function notifyVendorRejected(input: {
  userId: string
  vendorProfileId: string
  businessName: string
  reason: string
}): Promise<{ emailSent: boolean; warning?: string }> {
  const dashboardUrl = `${appBaseUrl()}/vendor`
  const params = paramsVendorVerificationRejected({
    businessName: input.businessName,
    rejectionReason: input.reason,
    dashboardUrl,
  })

  const result = await sendNotification({
    userId: input.userId,
    type: "VERIFICATION",
    title: "Verification needs attention",
    body: `We could not approve ${input.businessName} yet. Please review the note in your dashboard and resubmit.`,
    actionUrl: "/vendor",
    entityType: "vendor_profile",
    entityId: input.vendorProfileId,
    sendInApp: true,
    sendEmail: true,
    emailTemplateKey: "VENDOR_VERIFICATION_REJECTED",
    emailParams: params,
  })

  if (result.email?.success) {
    return { emailSent: true }
  }
  return {
    emailSent: false,
    warning: result.email?.error
      ? `Decision saved, but email could not be sent: ${result.email.error}`
      : "Decision saved, but email could not be sent.",
  }
}

const pendingWithSubmission = and(
  eq(vendorProfiles.verificationStatus, "PENDING_VERIFICATION"),
  isNotNull(vendorProfiles.verificationSubmittedAt)
)!

export async function approveVendorAction(
  _prev: VendorDecisionResult | null,
  formData: FormData
): Promise<VendorDecisionResult> {
  await getRequiredUser("ADMIN")

  const rawId = formData.get("vendorProfileId")
  const parsedId = vendorProfileIdSchema.safeParse(
    typeof rawId === "string" ? rawId : ""
  )
  if (!parsedId.success) {
    return {
      ok: false,
      message: parsedId.error.flatten().formErrors[0] ?? "Invalid request.",
    }
  }

  const id = parsedId.data
  const now = new Date()

  const [updated] = await db
    .update(vendorProfiles)
    .set({
      verificationStatus: "APPROVED",
      statusNote: null,
      updatedAt: now,
    })
    .where(and(eq(vendorProfiles.id, id), pendingWithSubmission)!)
    .returning({
      userId: vendorProfiles.userId,
      businessName: vendorProfiles.businessName,
    })

  if (!updated) {
    return {
      ok: false,
      message:
        "Could not approve this vendor. They may already be processed or have not submitted verification yet.",
    }
  }

  revalidatePath("/admin/vendors")

  try {
    const n = await notifyVendorApproved({
      userId: updated.userId,
      vendorProfileId: id,
      businessName: updated.businessName,
    })
    return {
      ok: true,
      emailSent: n.emailSent,
      ...(n.warning ? { warning: n.warning } : {}),
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return {
      ok: true,
      emailSent: false,
      warning: `Vendor approved, but notification failed: ${msg}`,
    }
  }
}

export async function rejectVendorAction(
  _prev: VendorDecisionResult | null,
  formData: FormData
): Promise<VendorDecisionResult> {
  await getRequiredUser("ADMIN")

  const rawId = formData.get("vendorProfileId")
  const parsedId = vendorProfileIdSchema.safeParse(
    typeof rawId === "string" ? rawId : ""
  )
  const rawNote = formData.get("statusNote")
  const parsedNote = rejectNoteSchema.safeParse(
    typeof rawNote === "string" ? rawNote : ""
  )

  if (!parsedId.success) {
    return {
      ok: false,
      message: parsedId.error.flatten().formErrors[0] ?? "Invalid request.",
    }
  }
  if (!parsedNote.success) {
    return {
      ok: false,
      message: parsedNote.error.flatten().formErrors[0] ?? "Invalid reason.",
    }
  }

  const id = parsedId.data
  const statusNote = parsedNote.data
  const now = new Date()

  const [updated] = await db
    .update(vendorProfiles)
    .set({
      verificationStatus: "REJECTED",
      statusNote,
      updatedAt: now,
    })
    .where(and(eq(vendorProfiles.id, id), pendingWithSubmission)!)
    .returning({
      userId: vendorProfiles.userId,
      businessName: vendorProfiles.businessName,
    })

  if (!updated) {
    return {
      ok: false,
      message:
        "Could not reject this vendor. They may already be processed or have not submitted verification yet.",
    }
  }

  revalidatePath("/admin/vendors")

  try {
    const n = await notifyVendorRejected({
      userId: updated.userId,
      vendorProfileId: id,
      businessName: updated.businessName,
      reason: statusNote,
    })
    return {
      ok: true,
      emailSent: n.emailSent,
      ...(n.warning ? { warning: n.warning } : {}),
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return {
      ok: true,
      emailSent: false,
      warning: `Rejection saved, but notification failed: ${msg}`,
    }
  }
}
