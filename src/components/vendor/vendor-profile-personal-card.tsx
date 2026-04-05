'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateVendorPersonalName,
  type VendorPersonalNameResult,
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
  _prev: VendorPersonalNameResult | null,
  formData: FormData
): Promise<VendorPersonalNameResult> {
  return updateVendorPersonalName(_prev, formData)
}

export function VendorProfilePersonalCard({ initialFullName }: { initialFullName: string }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action, null)
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending && state?.ok) {
      showToast('Name updated', { type: 'success', duration: 4000 })
      router.refresh()
    }
    wasPending.current = pending
  }, [pending, state, router])

  useEffect(() => {
    if (!state || state.ok || !state.formError) return
    showToast('Could not update name', {
      description: state.formError,
      type: 'error',
      duration: 5000,
    })
  }, [state])

  const fe = (state && !state.ok ? state.fieldErrors : undefined) ?? {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal name</CardTitle>
        <CardDescription>
          Your name as shown in the dashboard. Business name is managed below.
        </CardDescription>
      </CardHeader>
      <form action={formAction} noValidate>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={fe.fullName ? true : undefined}>
              <FieldLabel htmlFor="profile-fullName">Full name</FieldLabel>
              <Input
                id="profile-fullName"
                name="fullName"
                type="text"
                key={initialFullName}
                defaultValue={initialFullName}
                autoComplete="name"
                aria-required
                aria-invalid={fe.fullName ? true : undefined}
                className={cn('bg-card', !fe.fullName && 'border-border')}
              />
              {fe.fullName && <FieldError>{fe.fullName}</FieldError>}
              <FieldDescription>Letters and spaces; used alongside your business profile.</FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t pt-6 [.border-t]:pt-4">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Save name'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
