import { format } from 'date-fns'
import Link from 'next/link'
import { getRequiredUser } from '@/lib/auth/session'
import { listBookingChatsForVendor } from '@/lib/db/chat'
import type { BookingListRow } from '@/lib/db/chat'

const STATUS_LABEL: Record<BookingListRow['status'], string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
  COMPLETED: 'Completed',
}

export default async function VendorBookingsPage() {
  const user = await getRequiredUser('VENDOR')
  const rows = await listBookingChatsForVendor(user.id)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Bookings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Open a booking to chat with the customer.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground border-border bg-card rounded-xl border px-4 py-8 text-center text-sm">
          No booking requests yet. When customers request your vehicles, they will
          appear here.
        </p>
      ) : (
        <ul className="border-border divide-border divide-y rounded-xl border bg-card">
          {rows.map((row) => (
            <li key={row.bookingId}>
              <Link
                href={`/vendor/bookings/${row.bookingId}/chat`}
                className="hover:bg-muted/50 flex flex-col gap-1 px-4 py-3 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-foreground font-medium">
                    {row.vehicleName}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {STATUS_LABEL[row.status]}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs">
                  Pickup {format(row.pickupAt, 'MMM d, yyyy · h:mm a')}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
