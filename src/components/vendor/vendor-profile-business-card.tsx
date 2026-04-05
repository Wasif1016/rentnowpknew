'use client'

import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateVendorBusinessProfile,
  type VendorBusinessResult,
} from '@/lib/actions/vendor-profile'
import { PhoneCountryCombobox } from '@/components/auth/phone-country-combobox'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { showToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import {
  DEFAULT_PHONE_COUNTRY,
  getPhoneCountryOptions,
} from '@/lib/phone/vendor-countries'

async function action(
  _prev: VendorBusinessResult | null,
  formData: FormData
): Promise<VendorBusinessResult> {
  return updateVendorBusinessProfile(_prev, formData)
}

export function VendorProfileBusinessCard({
  initialBusinessName,
  initialCountryCode,
  initialPhoneLocal,
}: {
  initialBusinessName: string
  initialCountryCode: string
  initialPhoneLocal: string
}) {
  const router = useRouter()
  const [countryCode, setCountryCode] = useState(initialCountryCode)
  const [state, formAction, pending] = useActionState(action, null)
  const wasPending = useRef(false)

  const countryMeta = useMemo(() => {
    const opts = getPhoneCountryOptions()
    return (
      opts.find((c) => c.code === countryCode) ??
      opts.find((c) => c.code === DEFAULT_PHONE_COUNTRY) ??
      opts[0]
    )
  }, [countryCode])

  useEffect(() => {
    if (wasPending.current && !pending && state?.ok) {
      showToast('Business profile updated', { type: 'success', duration: 4000 })
      router.refresh()
    }
    wasPending.current = pending
  }, [pending, state, router])

  useEffect(() => {
    if (!state || state.ok || !state.formError) return
    showToast('Could not update business profile', {
      description: state.formError,
      type: 'error',
      duration: 5000,
    })
  }, [state])

  const fe = (state && !state.ok ? state.fieldErrors : undefined) ?? {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business</CardTitle>
        <CardDescription>Business name and WhatsApp contact for customers and verification.</CardDescription>
      </CardHeader>
      <form action={formAction} noValidate>
        <input type="hidden" name="countryCode" value={countryCode} />
        <CardContent>
          <FieldGroup>
            <Field data-invalid={fe.businessName ? true : undefined}>
              <FieldLabel htmlFor="profile-businessName">Business name</FieldLabel>
              <Input
                id="profile-businessName"
                name="businessName"
                type="text"
                key={initialBusinessName}
                defaultValue={initialBusinessName}
                autoComplete="organization"
                aria-required
                aria-invalid={fe.businessName ? true : undefined}
                className={cn('bg-card', !fe.businessName && 'border-border')}
              />
              {fe.businessName && <FieldError>{fe.businessName}</FieldError>}
            </Field>
            <Field data-invalid={fe.countryCode || fe.phoneLocal ? true : undefined}>
              <FieldLabel>WhatsApp number</FieldLabel>
              <div className="flex min-w-0 w-full gap-2">
                <PhoneCountryCombobox
                  value={countryCode}
                  onValueChange={setCountryCode}
                  disabled={pending}
                  aria-invalid={fe.countryCode ? true : undefined}
                />
                <Input
                  id="profile-phoneLocal"
                  name="phoneLocal"
                  type="tel"
                  inputMode="tel"
                  key={`${initialCountryCode}-${initialPhoneLocal}`}
                  defaultValue={initialPhoneLocal}
                  autoComplete="tel-national"
                  placeholder={
                    countryCode === DEFAULT_PHONE_COUNTRY
                      ? 'e.g. 3147651112'
                      : 'National number only'
                  }
                  aria-required
                  aria-invalid={fe.phoneLocal ? true : undefined}
                  className={cn(
                    'min-w-0 flex-1 bg-card',
                    !fe.phoneLocal && 'border-border'
                  )}
                />
              </div>
              {fe.countryCode && <FieldError>{fe.countryCode}</FieldError>}
              {fe.phoneLocal && <FieldError>{fe.phoneLocal}</FieldError>}
              <FieldDescription>
                Choose your country, then enter your number without the country code — we use{' '}
                {countryMeta.label} for validation.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t pt-6 [.border-t]:pt-4">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Save business profile'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
