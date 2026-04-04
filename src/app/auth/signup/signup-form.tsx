'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUpVendorAction, type VendorSignupState } from '@/lib/actions/vendor-auth'
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'

async function signupFormAction(
  _prev: VendorSignupState | null,
  formData: FormData
): Promise<VendorSignupState> {
  return signUpVendorAction(_prev, formData)
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupFormAction, null)

  if (state?.ok && state.needsEmailConfirmation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a confirmation link. After you verify your email, you will be redirected to add
            your first vehicle.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t pt-6 [.border-t]:pt-4">
          <p className="text-center text-sm text-muted-foreground w-full">
            Already confirmed?{' '}
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor registration</CardTitle>
        <CardDescription>
          List your fleet on RentNowPk. You will verify your email before accessing the dashboard.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            {state && !state.ok && (
              <div
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                {state.error}
              </div>
            )}
            <Field data-invalid={state && !state.ok ? true : undefined}>
              <FieldLabel htmlFor="businessName">Business name</FieldLabel>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                autoComplete="organization"
                required
                minLength={2}
                aria-invalid={state && !state.ok ? true : undefined}
              />
            </Field>
            <Field data-invalid={state && !state.ok ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={state && !state.ok ? true : undefined}
              />
            </Field>
            <Field data-invalid={state && !state.ok ? true : undefined}>
              <FieldLabel htmlFor="whatsappPhone">WhatsApp number</FieldLabel>
              <Input
                id="whatsappPhone"
                name="whatsappPhone"
                type="tel"
                autoComplete="tel"
                placeholder="03XXXXXXXXX or +92XXXXXXXXXX"
                required
                aria-invalid={state && !state.ok ? true : undefined}
              />
              <FieldDescription>Use a Pakistan mobile number (03… or +92…).</FieldDescription>
            </Field>
            <Field data-invalid={state && !state.ok ? true : undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                aria-invalid={state && !state.ok ? true : undefined}
              />
              <FieldDescription>At least 8 characters.</FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t pt-6 [.border-t]:pt-4">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating account…' : 'Create vendor account'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
