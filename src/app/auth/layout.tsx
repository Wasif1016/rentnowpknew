import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in — RentNowPk',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
