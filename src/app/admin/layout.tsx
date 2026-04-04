import { getRequiredUser } from '@/lib/auth/session'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { ADMIN_NAV } from '@/components/dashboard/dashboard-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getRequiredUser('ADMIN')

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      sidebarUserName={user.fullName}
      user={{
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      }}
    >
      {children}
    </DashboardShell>
  )
}
