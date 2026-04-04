import { Suspense } from 'react'
import { getRequiredUser } from '@/lib/auth/session'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
      }
    >
      <CustomerLayoutInner>{children}</CustomerLayoutInner>
    </Suspense>
  )
}

async function CustomerLayoutInner({ children }: { children: React.ReactNode }) {
  const user = await getRequiredUser('CUSTOMER')

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">RentNowPk</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/customer" className="block px-3 py-2 rounded-md hover:bg-accent">
            Dashboard
          </a>
          <a href="/customer/bookings" className="block px-3 py-2 rounded-md hover:bg-accent">
            Bookings
          </a>
          <a href="/customer/settings" className="block px-3 py-2 rounded-md hover:bg-accent">
            Settings
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
