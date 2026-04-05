'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  requestVendorEmailChange,
  type VendorEmailResult,
} from '@/lib/actions/vendor-profile'
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

async function action(
  _prev: VendorEmailResult | null,
  formData: FormData
): Promise<VendorEmailResult> {
  return requestVendorEmailChange(_prev, formData)
}

export function VendorProfileEmailCard({ currentEmail }: { currentEmail: string }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action, null)
  const wasPending = useRef(false)
  const showSuccess = Boolean(state && state.ok && state.pendingConfirmation)

  useEffect(() => {
    if (wasPending.current && !pending && state) {
      if (state.ok && state.pendingConfirmation) {
        showToast('Confirm your new email', {
          description: 'We sent a link to your new address. Click it to finish the change.',
          type: 'success',
          duration: 8000,
        })
        router.refresh()
      } else if (!state.ok && state.formError) {
        showToast('Could not start email change', {
          description: state.formError,
          type: 'error',
          duration: 6000,
        })
      }
    }
    wasPending.current = pending
  }, [pending, state, router])

  const fe = (state && !state.ok ? state.fieldErrors : undefined) ?? {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          Current sign-in email:{' '}
          <span className="text-foreground font-medium">{currentEmail}</span>
        </CardDescription>
      </CardHeader>
      <form action={formAction} noValidate>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={fe.email ? true : undefined}>
              <FieldLabel htmlFor="profile-new-email">New email address</FieldLabel>
              <Input
                id="profile-new-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-required
                aria-invalid={fe.email ? true : undefined}
                className={cn('bg-card', !fe.email && 'border-border')}
                disabled={showSuccess}
              />
              {fe.email && <FieldError>{fe.email}</FieldError>}
              <FieldDescription>
                We will send a confirmation link to the new address. Your account email updates after
                you confirm.
              </FieldDescription>
            </Field>
          </FieldGroup>
          {showSuccess ? (
            <p className="text-muted-foreground mt-4 text-sm">
              Check the inbox of the address you entered and click the confirmation link. You can close
              this page.
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="border-t pt-6 [.border-t]:pt-4">
          <Button type="submit" disabled={pending || showSuccess}>
            {pending ? 'Sending…' : showSuccess ? 'Confirmation sent' : 'Change email'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
