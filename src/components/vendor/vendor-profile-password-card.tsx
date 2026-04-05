'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  changeVendorPassword,
  type VendorPasswordResult,
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
  _prev: VendorPasswordResult | null,
  formData: FormData
): Promise<VendorPasswordResult> {
  return changeVendorPassword(_prev, formData)
}

export function VendorProfilePasswordCard() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && state?.ok) {
      showToast('Password updated', {
        description: 'Use your new password next time you sign in.',
        type: 'success',
        duration: 5000,
      })
      router.refresh()
      formRef.current?.reset()
    }
    wasPending.current = pending
  }, [pending, state, router])

  useEffect(() => {
    if (!state || state.ok || !state.formError) return
    showToast('Could not update password', {
      description: state.formError,
      type: 'error',
      duration: 6000,
    })
  }, [state])

  const fe = (state && !state.ok ? state.fieldErrors : undefined) ?? {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>We verify your current password before applying a new one.</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction} noValidate>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={fe.currentPassword ? true : undefined}>
              <FieldLabel htmlFor="profile-current-password">Current password</FieldLabel>
              <Input
                id="profile-current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                aria-required
                aria-invalid={fe.currentPassword ? true : undefined}
                className={cn('bg-card', !fe.currentPassword && 'border-border')}
              />
              {fe.currentPassword && <FieldError>{fe.currentPassword}</FieldError>}
            </Field>
            <Field data-invalid={fe.newPassword ? true : undefined}>
              <FieldLabel htmlFor="profile-new-password">New password</FieldLabel>
              <Input
                id="profile-new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                aria-required
                aria-invalid={fe.newPassword ? true : undefined}
                className={cn('bg-card', !fe.newPassword && 'border-border')}
              />
              {fe.newPassword && <FieldError>{fe.newPassword}</FieldError>}
              <FieldDescription>At least 8 characters.</FieldDescription>
            </Field>
            <Field data-invalid={fe.confirmNewPassword ? true : undefined}>
              <FieldLabel htmlFor="profile-confirm-password">Confirm new password</FieldLabel>
              <Input
                id="profile-confirm-password"
                name="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                aria-required
                aria-invalid={fe.confirmNewPassword ? true : undefined}
                className={cn('bg-card', !fe.confirmNewPassword && 'border-border')}
              />
              {fe.confirmNewPassword && <FieldError>{fe.confirmNewPassword}</FieldError>}
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t pt-6 [.border-t]:pt-4">
          <Button type="submit" disabled={pending}>
            {pending ? 'Updating…' : 'Update password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
