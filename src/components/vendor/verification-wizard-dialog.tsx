'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition, type ChangeEvent } from 'react'
import { submitVendorVerification } from '@/lib/actions/vendor-verification'
import { cnicInputSchema, formatCnicForDisplay } from '@/lib/validation/cnic'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { showToast } from '@/components/ui/toast'

const MAX_BYTES = 8 * 1024 * 1024
const ACCEPT = 'image/jpeg,image/png,image/webp'

function revoke(url: string | null) {
  if (url) URL.revokeObjectURL(url)
}

function validateFile(f: File | null): string | null {
  if (!f) return 'Choose a file.'
  if (f.size > MAX_BYTES) return 'Image must be 8 MB or smaller.'
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
    return 'Use JPEG, PNG, or WebP.'
  }
  return null
}

type VerificationWizardDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VerificationWizardDialog({
  open,
  onOpenChange,
}: VerificationWizardDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [cnicInput, setCnicInput] = useState('')
  const [cnicFront, setCnicFront] = useState<File | null>(null)
  const [cnicBack, setCnicBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [logo, setLogo] = useState<File | null>(null)
  const [previewFront, setPreviewFront] = useState<string | null>(null)
  const [previewBack, setPreviewBack] = useState<string | null>(null)
  const [previewSelfie, setPreviewSelfie] = useState<string | null>(null)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const resetForm = useCallback(() => {
    setStep(1)
    setCnicInput('')
    setCnicFront(null)
    setCnicBack(null)
    setSelfie(null)
    setLogo(null)
    setPreviewFront((u) => {
      if (u) URL.revokeObjectURL(u)
      return null
    })
    setPreviewBack((u) => {
      if (u) URL.revokeObjectURL(u)
      return null
    })
    setPreviewSelfie((u) => {
      if (u) URL.revokeObjectURL(u)
      return null
    })
    setPreviewLogo((u) => {
      if (u) URL.revokeObjectURL(u)
      return null
    })
    setFieldErrors({})
    setFormError(null)
  }, [])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        resetForm()
      }
      onOpenChange(next)
    },
    [onOpenChange, resetForm]
  )

  const onCnicChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 13)
    setCnicInput(formatCnicForDisplay(digits))
  }

  const bindFile = (
    file: File | null,
    setFile: (f: File | null) => void,
    prevUrl: string | null,
    setPrevUrl: (u: string | null) => void
  ) => {
    revoke(prevUrl)
    setFile(file)
    if (file) setPrevUrl(URL.createObjectURL(file))
    else setPrevUrl(null)
  }

  const onPickFile =
    (
      setFile: (f: File | null) => void,
      prevUrl: string | null,
      setPrevUrl: (u: string | null) => void,
      key: string
    ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null
      const err = validateFile(f)
      setFieldErrors((prev) => ({ ...prev, [key]: err ?? '' }))
      if (!err) bindFile(f, setFile, prevUrl, setPrevUrl)
      else bindFile(null, setFile, prevUrl, setPrevUrl)
    }

  const cnicDigits = cnicInput.replace(/\D/g, '')

  const validateStep1 = (): boolean => {
    const next: Record<string, string> = {}
    const cnic = cnicInputSchema.safeParse(cnicInput)
    if (!cnic.success) {
      next.cnic = cnic.error.flatten().formErrors[0] ?? 'Invalid CNIC.'
    }
    const e1 = validateFile(cnicFront)
    if (e1) next.cnic_front = e1
    const e2 = validateFile(cnicBack)
    if (e2) next.cnic_back = e2
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const validateStep2 = (): boolean => {
    const next: Record<string, string> = {}
    const e1 = validateFile(selfie)
    if (e1) next.selfie = e1
    const e2 = validateFile(logo)
    if (e2) next.logo = e2
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const handleFinalSubmit = () => {
    setFormError(null)
    if (!validateStep1() || !validateStep2()) {
      setStep(1)
      return
    }

    const fd = new FormData()
    fd.append('cnicNumber', cnicDigits)
    if (cnicFront) fd.append('cnic_front', cnicFront)
    if (cnicBack) fd.append('cnic_back', cnicBack)
    if (selfie) fd.append('selfie', selfie)
    if (logo) fd.append('logo', logo)

    startTransition(async () => {
      const result = await submitVendorVerification(null, fd)
      if (result.ok) {
        showToast('Verification submitted', {
          description:
            'We will review your documents and notify you within 24 hours.',
          type: 'success',
        })
        handleOpenChange(false)
        router.refresh()
      } else {
        setFormError(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        showCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Business verification</DialogTitle>
          <DialogDescription>
            Step {step} of 3 — provide your CNIC and photos. We only upload images
            when you submit at the end.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <FieldGroup className="gap-4">
            <Field data-invalid={!!fieldErrors.cnic}>
              <FieldLabel htmlFor="v-cnic">National ID (CNIC)</FieldLabel>
              <Input
                id="v-cnic"
                inputMode="numeric"
                autoComplete="off"
                placeholder="12345-1234567-1"
                value={cnicInput}
                onChange={(e) => onCnicChange(e.target.value)}
                aria-invalid={!!fieldErrors.cnic}
              />
              {fieldErrors.cnic ? (
                <FieldError>{fieldErrors.cnic}</FieldError>
              ) : (
                <FieldDescription>13 digits, Pakistani CNIC.</FieldDescription>
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!fieldErrors.cnic_front}>
                <FieldLabel htmlFor="v-cnic-front">CNIC — front</FieldLabel>
                <Input
                  id="v-cnic-front"
                  type="file"
                  accept={ACCEPT}
                  className="text-muted-foreground"
                  onChange={onPickFile(
                    setCnicFront,
                    previewFront,
                    setPreviewFront,
                    'cnic_front'
                  )}
                />
                {fieldErrors.cnic_front ? (
                  <FieldError>{fieldErrors.cnic_front}</FieldError>
                ) : null}
                {previewFront ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewFront}
                    alt=""
                    className="mt-2 max-h-32 rounded-lg border border-border object-contain"
                  />
                ) : null}
              </Field>
              <Field data-invalid={!!fieldErrors.cnic_back}>
                <FieldLabel htmlFor="v-cnic-back">CNIC — back</FieldLabel>
                <Input
                  id="v-cnic-back"
                  type="file"
                  accept={ACCEPT}
                  className="text-muted-foreground"
                  onChange={onPickFile(
                    setCnicBack,
                    previewBack,
                    setPreviewBack,
                    'cnic_back'
                  )}
                />
                {fieldErrors.cnic_back ? (
                  <FieldError>{fieldErrors.cnic_back}</FieldError>
                ) : null}
                {previewBack ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewBack}
                    alt=""
                    className="mt-2 max-h-32 rounded-lg border border-border object-contain"
                  />
                ) : null}
              </Field>
            </div>
          </FieldGroup>
        )}

        {step === 2 && (
          <FieldGroup className="gap-4">
            <Field data-invalid={!!fieldErrors.selfie}>
              <FieldLabel htmlFor="v-selfie">Profile photo (selfie)</FieldLabel>
              <Input
                id="v-selfie"
                type="file"
                accept={ACCEPT}
                className="text-muted-foreground"
                onChange={onPickFile(
                  setSelfie,
                  previewSelfie,
                  setPreviewSelfie,
                  'selfie'
                )}
              />
              {fieldErrors.selfie ? (
                <FieldError>{fieldErrors.selfie}</FieldError>
              ) : (
                <FieldDescription>
                  Clear face, good lighting. This becomes your account avatar.
                </FieldDescription>
              )}
              {previewSelfie ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewSelfie}
                  alt=""
                  className="mt-2 max-h-40 rounded-lg border border-border object-contain"
                />
              ) : null}
            </Field>

            <Field data-invalid={!!fieldErrors.logo}>
              <FieldLabel htmlFor="v-logo">Business logo</FieldLabel>
              <Input
                id="v-logo"
                type="file"
                accept={ACCEPT}
                className="text-muted-foreground"
                onChange={onPickFile(setLogo, previewLogo, setPreviewLogo, 'logo')}
              />
              {fieldErrors.logo ? (
                <FieldError>{fieldErrors.logo}</FieldError>
              ) : (
                <FieldDescription>Square logo works best.</FieldDescription>
              )}
              {previewLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewLogo}
                  alt=""
                  className="mt-2 max-h-32 rounded-lg border border-border object-contain"
                />
              ) : null}
            </Field>
          </FieldGroup>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Review and submit. Your images will be uploaded securely once.
            </p>
            <ul className="list-inside list-disc space-y-1 text-foreground">
              <li>CNIC: {formatCnicForDisplay(cnicDigits) || '—'}</li>
              <li>CNIC photos: attached</li>
              <li>Selfie and logo: attached</li>
            </ul>
            {formError ? (
              <p className="text-destructive text-sm" role="alert">
                {formError}
              </p>
            ) : null}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <div className="flex gap-2">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => {
                  setFormError(null)
                  setStep((s) => s - 1)
                }}
              >
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 3 ? (
              <Button
                type="button"
                disabled={pending}
                onClick={() => {
                  setFormError(null)
                  if (step === 1) {
                    if (validateStep1()) setStep(2)
                  } else if (step === 2) {
                    if (validateStep2()) setStep(3)
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="button" disabled={pending} onClick={handleFinalSubmit}>
                {pending ? 'Submitting…' : 'Submit for review'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
