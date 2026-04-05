import { notFound } from 'next/navigation'
import { getRequiredUser } from '@/lib/auth/session'
import { BookingChatPanel } from '@/components/chat/booking-chat-panel'
import { BookingChatShell } from '@/components/chat/booking-chat-shell'
import {
  getChatContextForBooking,
  listBookingChatsForVendor,
  loadMessagesPage,
} from '@/lib/db/chat'

export default async function VendorChatThreadPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const user = await getRequiredUser('VENDOR')
  const ctx = await getChatContextForBooking({ bookingId, userId: user.id })
  if (!ctx) {
    notFound()
  }

  const rows = await listBookingChatsForVendor(user.id)
  const { messages, nextCursor } = await loadMessagesPage(ctx.threadId)

  return (
    <BookingChatShell rows={rows} basePath="/vendor/chat">
      <BookingChatPanel
        bookingId={ctx.bookingId}
        threadId={ctx.threadId}
        initialMessages={messages}
        initialNextCursor={nextCursor}
        currentUserId={user.id}
        title={ctx.vehicleName}
        subtitle={`${ctx.otherPartyName} · ${ctx.status.replace(/_/g, ' ')}`}
        layout="embedded"
        bookingStatus={ctx.status}
        isVendor
      />
    </BookingChatShell>
  )
}
