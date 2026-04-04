import { getRequiredUser } from '@/lib/auth/session'
import { getVendorProfileByUserId } from '@/lib/db/vendor-profile'
import { getVendorVerificationBannerMode } from '@/lib/vendor/verification-ui'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { VENDOR_NAV } from '@/components/dashboard/dashboard-nav'
import { VendorVerificationBanner } from '@/components/vendor/vendor-verification-banner'

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const user = await getRequiredUser('VENDOR')
  const vendorProfile = await getVendorProfileByUserId(user.id)
  const bannerMode = vendorProfile
    ? getVendorVerificationBannerMode(vendorProfile)
    : 'hidden'

  const displayName = vendorProfile?.businessName?.trim() || user.fullName

  return (
    <DashboardShell
      navItems={VENDOR_NAV}
      sidebarUserName={displayName}
      user={{
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      }}
    >
      <VendorVerificationBanner
        mode={bannerMode}
        statusNote={vendorProfile?.statusNote ?? null}
      />
      {children}
    </DashboardShell>
  )
}
