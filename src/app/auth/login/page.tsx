import { Suspense } from 'react'
import { LoginPageInner } from './login-page-inner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function LoginFallback() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full max-w-sm animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-9 animate-pulse rounded-xl bg-muted" />
        <div className="h-9 animate-pulse rounded-xl bg-muted" />
      </CardContent>
    </Card>
  )
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageInner searchParams={searchParams} />
    </Suspense>
  )
}
