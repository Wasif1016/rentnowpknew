import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painters - Find the Best Local Painters',
  description: 'Connect with professional painters in your area',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Marketing header can go here */}
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold">Painters</a>
          <div className="flex gap-4">
            <a href="/for-painters" className="text-sm font-medium">For Painters</a>
            <a href="/login" className="text-sm font-medium">Login</a>
            <a href="/join" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Get Started
            </a>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 Painters. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
