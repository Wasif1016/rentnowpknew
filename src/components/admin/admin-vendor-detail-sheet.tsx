"use client"

import { useActionState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  approveVendorAction,
  rejectVendorAction,
  type VendorDecisionResult,
} from "@/lib/actions/admin-vendors"
import type { AdminVendorDetail } from "@/lib/db/admin-vendors"
import type { AdminVendorsSearchState } from "@/lib/admin/admin-vendors-url"
import { buildAdminVendorsHref } from "@/lib/admin/admin-vendors-url"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { showToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

function statusBadgeClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "border-primary/30 bg-accent text-accent-foreground"
    case "REJECTED":
      return "border-destructive/40 bg-destructive/10 text-foreground"
    case "SUSPENDED":
      return "border-border bg-muted text-muted-foreground"
    default:
      return "border-border bg-muted/80 text-foreground"
  }
}

function VerificationImage({ src, label }: { src: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <div className="bg-muted relative aspect-video w-full max-w-sm overflow-hidden rounded-md border border-border">
        <Image
          src={src}
          alt={label}
          fill
          className="object-contain"
          sizes="320px"
        />
      </div>
    </div>
  )
}

export function AdminVendorDetailSheet(props: {
  open: boolean
  listState: AdminVendorsSearchState
  detail: AdminVendorDetail | null
  detailNotFound: boolean
}) {
  const router = useRouter()
  const closeHref = buildAdminVendorsHref(props.listState, { detail: null })
  const lastResultKey = useRef<string | null>(null)

  useEffect(() => {
    lastResultKey.current = null
  }, [props.detail?.profile.id])

  const [approveState, approveAction, approvePending] = useActionState(
    approveVendorAction,
    null as VendorDecisionResult | null
  )
  const [rejectState, rejectAction, rejectPending] = useActionState(
    rejectVendorAction,
    null as VendorDecisionResult | null
  )

  useEffect(() => {
    const s = approveState ?? rejectState
    if (!s) return
    const key = JSON.stringify({ approveState, rejectState })
    if (key === lastResultKey.current) return
    lastResultKey.current = key

    if (s.ok) {
      const title = s.warning
        ? "Decision saved."
        : s.emailSent
          ? "Decision saved and vendor notified."
          : "Decision saved."
      showToast(title, {
        type: s.warning ? "warning" : "success",
        ...(s.warning ? { description: s.warning } : {}),
      })
      router.refresh()
    } else {
      showToast(s.message, { type: "error" })
    }
  }, [approveState, rejectState, router])

  const canDecide =
    props.detail &&
    props.detail.profile.verificationSubmittedAt != null &&
    props.detail.profile.verificationStatus === "PENDING_VERIFICATION"

  return (
    <Sheet
      open={props.open}
      onOpenChange={(open) => {
        if (!open) router.push(closeHref)
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-border bg-background p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-border shrink-0 border-b px-6 py-4 text-left">
          <SheetTitle className="text-foreground">Vendor detail</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Account, business, and verification documents.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 px-6 py-4">
            {props.detailNotFound && (
              <p className="text-muted-foreground text-sm">
                This vendor could not be found or was removed.
              </p>
            )}

            {props.detail && (
              <>
                <section className="space-y-2">
                  <h3 className="text-foreground text-sm font-medium">Business</h3>
                  <p className="text-foreground text-base font-semibold">
                    {props.detail.profile.businessName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        statusBadgeClass(props.detail.profile.verificationStatus)
                      )}
                    >
                      {props.detail.profile.verificationStatus.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {props.detail.vehicleCount} vehicle
                      {props.detail.vehicleCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </section>

                <Separator />

                <section className="space-y-2">
                  <h3 className="text-foreground text-sm font-medium">Account</h3>
                  <dl className="grid gap-1 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="text-foreground">{props.detail.user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Name</dt>
                      <dd className="text-foreground">{props.detail.user.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">WhatsApp</dt>
                      <dd className="text-foreground">{props.detail.profile.whatsappPhone}</dd>
                    </div>
                    {props.detail.user.phone && (
                      <div>
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="text-foreground">{props.detail.user.phone}</dd>
                      </div>
                    )}
                  </dl>
                </section>

                <Separator />

                <section className="space-y-3">
                  <h3 className="text-foreground text-sm font-medium">Verification</h3>
                  {!props.detail.profile.verificationSubmittedAt ? (
                    <p className="text-muted-foreground text-sm">
                      This vendor has not submitted verification documents yet.
                    </p>
                  ) : (
                    <>
                      <p className="text-muted-foreground text-xs">
                        Submitted{" "}
                        {format(
                          props.detail.profile.verificationSubmittedAt,
                          "MMM d, yyyy HH:mm"
                        )}
                      </p>
                      {props.detail.profile.cnicNumber && (
                        <div>
                          <p className="text-muted-foreground text-xs font-medium">CNIC</p>
                          <p className="text-foreground font-mono text-sm">
                            {props.detail.profile.cnicNumber}
                          </p>
                        </div>
                      )}
                      <div className="grid gap-4 sm:grid-cols-1">
                        {props.detail.profile.cnicFrontUrl && (
                          <VerificationImage
                            src={props.detail.profile.cnicFrontUrl}
                            label="CNIC front"
                          />
                        )}
                        {props.detail.profile.cnicBackUrl && (
                          <VerificationImage
                            src={props.detail.profile.cnicBackUrl}
                            label="CNIC back"
                          />
                        )}
                        {props.detail.profile.selfieUrl && (
                          <VerificationImage
                            src={props.detail.profile.selfieUrl}
                            label="Profile / selfie"
                          />
                        )}
                        {props.detail.profile.businessLogoUrl && (
                          <VerificationImage
                            src={props.detail.profile.businessLogoUrl}
                            label="Business logo"
                          />
                        )}
                      </div>
                      {props.detail.profile.statusNote && (
                        <div className="rounded-md border border-border bg-muted/40 p-3">
                          <p className="text-muted-foreground text-xs font-medium">
                            Admin note (rejection)
                          </p>
                          <p className="text-foreground mt-1 text-sm whitespace-pre-wrap">
                            {props.detail.profile.statusNote}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </section>

                {canDecide && (
                  <>
                    <Separator />
                    <section className="space-y-4">
                      <h3 className="text-foreground text-sm font-medium">Decision</h3>
                      <form action={approveAction} className="space-y-2">
                        <input type="hidden" name="vendorProfileId" value={props.detail.profile.id} />
                        {approveState?.ok === false && (
                          <p className="text-destructive text-sm">{approveState.message}</p>
                        )}
                        <Button
                          type="submit"
                          disabled={approvePending || rejectPending}
                          className="w-full sm:w-auto"
                        >
                          {approvePending ? "Approving…" : "Approve vendor"}
                        </Button>
                      </form>

                      <form action={rejectAction} className="space-y-3">
                        <input type="hidden" name="vendorProfileId" value={props.detail.profile.id} />
                        <Field>
                          <FieldLabel htmlFor="reject-note">Reject with reason</FieldLabel>
                          <Textarea
                            id="reject-note"
                            name="statusNote"
                            required
                            minLength={1}
                            rows={4}
                            placeholder="Short note for the vendor (shown in their dashboard)."
                            className="border-input bg-background text-foreground"
                            disabled={rejectPending || approvePending}
                          />
                          {rejectState?.ok === false && (
                            <FieldError>{rejectState.message}</FieldError>
                          )}
                        </Field>
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={approvePending || rejectPending}
                          className="w-full sm:w-auto"
                        >
                          {rejectPending ? "Rejecting…" : "Reject vendor"}
                        </Button>
                      </form>
                    </section>
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <div className="border-border shrink-0 border-t px-6 py-3">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={closeHref}>Close</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
