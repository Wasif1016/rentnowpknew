import { getRequiredUser } from '@/lib/auth/session'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Redirects if not logged in OR wrong role — never reaches children
  const user = await getRequiredUser('ADMIN')

  return (
    <div className="flex h-screen">
      {/* Sidebar navigation */}
      <aside className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Admin Portal</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/admin" className="block px-3 py-2 rounded-md hover:bg-accent">
            Dashboard
          </a>
          <a href="/admin/users" className="block px-3 py-2 rounded-md hover:bg-accent">
            Users
          </a>
          <a href="/admin/painters" className="block px-3 py-2 rounded-md hover:bg-accent">
            Painters
          </a>
          <a href="/admin/jobs" className="block px-3 py-2 rounded-md hover:bg-accent">
            Jobs
          </a>
          <a href="/admin/settings" className="block px-3 py-2 rounded-md hover:bg-accent">
            Settings
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
