import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'RentNowPk — Car rental marketplace',
  description: 'Find and book rental vehicles from verified vendors across Pakistan.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            RentNowPk
          </Link>
          <div className="flex gap-4">
            <Link href="/for-vendors" className="text-sm font-medium">
              For vendors
            </Link>
            <Link href="/auth/login" className="text-sm font-medium">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 RentNowPk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
