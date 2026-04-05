import { getRequiredUser } from '@/lib/auth/session'
import { getVendorProfileByUserId } from '@/lib/db/vendor-profile'
import {
  DEFAULT_PHONE_COUNTRY,
  e164ToCountryAndNational,
} from '@/lib/phone/vendor-countries'
import { VendorProfilePersonalCard } from '@/components/vendor/vendor-profile-personal-card'
import { VendorProfileBusinessCard } from '@/components/vendor/vendor-profile-business-card'
import { VendorProfileEmailCard } from '@/components/vendor/vendor-profile-email-card'
import { VendorProfilePasswordCard } from '@/components/vendor/vendor-profile-password-card'

export default async function VendorProfilePage() {
  const user = await getRequiredUser('VENDOR')
  const profile = await getVendorProfileByUserId(user.id)

  if (!profile) {
    return (
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2 text-sm">Vendor profile not found.</p>
      </div>
    )
  }

  const parsed = e164ToCountryAndNational(profile.whatsappPhone)
  const initialCountryCode = parsed?.countryCode ?? DEFAULT_PHONE_COUNTRY
  const initialPhoneLocal = parsed?.nationalNumber ?? ''

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account name, business details, email, and password.
        </p>
      </div>

      <VendorProfilePersonalCard initialFullName={user.fullName} />

      <VendorProfileBusinessCard
        key={`${profile.businessName}-${profile.whatsappPhone}`}
        initialBusinessName={profile.businessName}
        initialCountryCode={initialCountryCode}
        initialPhoneLocal={initialPhoneLocal}
      />

      <VendorProfileEmailCard currentEmail={user.email} />

      <VendorProfilePasswordCard />
    </div>
  )
}
