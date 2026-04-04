import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ForVendorsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">List your fleet on RentNowPk</h1>
      <p className="text-muted-foreground mt-4">
        Create a vendor account to list vehicles, manage bookings, and complete verification from your
        dashboard.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/auth/signup">Register as a vendor</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth/login">Vendor login</Link>
        </Button>
      </div>
    </div>
  )
}
