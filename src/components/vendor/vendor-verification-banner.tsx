'use client'

import { useState } from 'react'
import type { VendorVerificationBannerMode } from '@/lib/vendor/verification-ui'
import { Button } from '@/components/ui/button'
import { VerificationWizardDialog } from '@/components/vendor/verification-wizard-dialog'
import { cn } from '@/lib/utils'

type VendorVerificationBannerProps = {
  mode: VendorVerificationBannerMode
  statusNote: string | null
}

export function VendorVerificationBanner({
  mode,
  statusNote,
}: VendorVerificationBannerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  if (mode === 'hidden') {
    return null
  }

  if (mode === 'under_review') {
    return (
      <div
        className={cn(
          'mb-6 flex flex-col gap-2 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm',
          'sm:flex-row sm:items-center sm:justify-between'
        )}
        role="status"
      >
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Verification in progress.</span>{' '}
          We received your documents and will notify you within 24 hours.
        </p>
      </div>
    )
  }

  if (mode === 'needs_verification') {
    return (
      <>
        <div
          className={cn(
            'mb-6 flex flex-col gap-3 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm',
            'sm:flex-row sm:items-center sm:justify-between'
          )}
        >
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Verify your business</span> to go live
            on RentNowPk. Submit your CNIC and photos — it only takes a few minutes.
          </p>
          <Button
            type="button"
            size="sm"
            className="shrink-0"
            onClick={() => setDialogOpen(true)}
          >
            Start verification
          </Button>
        </div>
        <VerificationWizardDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </>
    )
  }

  // rejected
  return (
    <>
      <div
        className={cn(
          'mb-6 flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm',
          'sm:flex-row sm:items-start sm:justify-between'
        )}
        role="alert"
      >
        <div className="space-y-1">
          <p className="font-medium text-foreground">Verification needs attention</p>
          {statusNote ? (
            <p className="text-muted-foreground">{statusNote}</p>
          ) : (
            <p className="text-muted-foreground">
              Please submit your documents again so we can review your business.
            </p>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={() => setDialogOpen(true)}
        >
          Resubmit documents
        </Button>
      </div>
      <VerificationWizardDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
