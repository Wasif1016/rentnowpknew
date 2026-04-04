import Image from 'next/image'
import Link from 'next/link'
import { getRequiredUser } from '@/lib/auth/session'
import { listVendorVehiclesWithMeta } from '@/lib/db/vendor-vehicles'
import { getVendorProfileByUserId } from '@/lib/db/vendor-profile'
import { Button } from '@/components/ui/button'
import { VehicleCreatedToast } from '@/components/vendor/vehicle-created-toast'

export default async function VendorVehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>
}) {
  const sp = await searchParams
  const user = await getRequiredUser('VENDOR')
  const profile = await getVendorProfileByUserId(user.id)
  if (!profile) {
    return (
      <div>
        <p className="text-muted-foreground">Vendor profile not found.</p>
      </div>
    )
  }

  const rows = await listVendorVehiclesWithMeta(profile.id)
  const showCreated = sp.created === '1'

  return (
    <div className="space-y-6">
      <VehicleCreatedToast show={showCreated} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your fleet. Listings go live after your account is verified.
          </p>
        </div>
        <Button asChild>
          <Link href="/vendor/vehicles/add">Add vehicle</Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed bg-card/50 p-10 text-center">
          <p className="text-muted-foreground text-sm">You have no vehicles yet.</p>
          <Button asChild className="mt-4">
            <Link href="/vendor/vehicles/add">Add your first vehicle</Link>
          </Button>
        </div>
      ) : (
        <ul className="divide-border divide-y rounded-lg border border-border bg-card">
          {rows.map((v) => (
            <li key={v.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
              <div className="bg-muted relative size-24 shrink-0 overflow-hidden rounded-md border border-border">
                {v.coverUrl ? (
                  <Image
                    src={v.coverUrl}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground flex size-full items-center justify-center text-xs">
                    No photo
                  </div>
                )}
                {v.makeLogoUrl ? (
                  <div className="bg-card absolute right-1 bottom-1 size-7 overflow-hidden rounded-md ring-1 ring-border">
                    <Image
                      src={v.makeLogoUrl}
                      alt=""
                      width={28}
                      height={28}
                      className="size-full object-contain p-0.5"
                    />
                  </div>
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-medium">{v.name}</p>
                <p className="text-muted-foreground truncate text-sm">
                  {v.cities.length > 0 ? v.cities.join(', ') : 'No cities'}
                </p>
                {v.pickupFormattedAddress ? (
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                    Pickup: {v.pickupFormattedAddress}
                  </p>
                ) : null}
                <p className="text-muted-foreground mt-1 font-mono text-xs">{v.slug}</p>
              </div>
              <div className="shrink-0">
                <span
                  className={
                    v.isActive
                      ? 'bg-accent text-accent-foreground inline-flex rounded-md px-2 py-1 text-xs font-medium'
                      : 'bg-muted text-muted-foreground inline-flex rounded-md px-2 py-1 text-xs font-medium'
                  }
                >
                  {v.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
