import { getRequiredUser } from '@/lib/auth/session'

export default async function PainterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Redirects if not logged in OR wrong role — never reaches children
  const user = await getRequiredUser('PAINTER')

  return (
    <div className="flex h-screen">
      {/* Sidebar navigation */}
      <aside className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Painter Portal</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/painter/dashboard" className="block px-3 py-2 rounded-md hover:bg-accent">
            Dashboard
          </a>
          <a href="/painter/leads" className="block px-3 py-2 rounded-md hover:bg-accent">
            Leads
          </a>
          <a href="/painter/jobs" className="block px-3 py-2 rounded-md hover:bg-accent">
            Jobs
          </a>
          <a href="/painter/profile" className="block px-3 py-2 rounded-md hover:bg-accent">
            Profile
          </a>
          <a href="/painter/settings" className="block px-3 py-2 rounded-md hover:bg-accent">
            Settings
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
