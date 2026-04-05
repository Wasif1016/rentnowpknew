'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { BookingListRow } from '@/lib/db/chat'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<BookingListRow['status'], string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
  COMPLETED: 'Completed',
}

export function ChatThreadSidebar({
  rows,
  basePath,
}: {
  rows: BookingListRow[]
  basePath: string
}) {
  const pathname = usePathname() ?? ''
  const normalizedBase = basePath.replace(/\/$/, '')

  return (
    <aside className="border-border bg-muted/30 flex w-full max-w-[min(100%,280px)] shrink-0 flex-col border-r">
      <div className="border-border border-b px-3 py-2">
        <p className="text-foreground text-xs font-semibold tracking-wide uppercase">
          Conversations
        </p>
        <p className="text-muted-foreground text-[11px]">
          {rows.length} booking{rows.length === 1 ? '' : 's'}
        </p>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <p className="text-muted-foreground px-3 py-4 text-xs">
            No conversations yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5 p-1.5">
            {rows.map((row) => {
              const href = `${normalizedBase}/${row.bookingId}`
              const active =
                pathname === href || pathname.startsWith(`${href}/`)
              return (
                <li key={row.bookingId}>
                  <Link
                    href={href}
                    className={cn(
                      'hover:bg-muted/80 flex flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                      active
                        ? 'bg-muted text-foreground ring-1 ring-border'
                        : 'text-muted-foreground'
                    )}
                  >
                    <span className="text-foreground line-clamp-1 text-sm font-medium">
                      {row.vehicleName}
                    </span>
                    <span className="text-[10px]">
                      {STATUS_LABEL[row.status]} ·{' '}
                      {format(row.pickupAt, 'd MMM')}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </nav>
    </aside>
  )
}
