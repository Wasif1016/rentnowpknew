import { getRequiredUser } from '@/lib/auth/session'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { CUSTOMER_NAV } from '@/components/dashboard/dashboard-nav'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await getRequiredUser('CUSTOMER')

  return (
    <DashboardShell
      navItems={CUSTOMER_NAV}
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
