import { notFound } from 'next/navigation'
import { getRequiredUser } from '@/lib/auth/session'
import { BookingChatPanel } from '@/components/chat/booking-chat-panel'
import { getChatContextForBooking, loadMessagesPage } from '@/lib/db/chat'

export default async function VendorBookingChatPage({
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

  const { messages, nextCursor } = await loadMessagesPage(ctx.threadId)

  return (
    <BookingChatPanel
      bookingId={ctx.bookingId}
      threadId={ctx.threadId}
      initialMessages={messages}
      initialNextCursor={nextCursor}
      currentUserId={user.id}
      title={ctx.vehicleName}
      subtitle={`${ctx.otherPartyName} · ${ctx.status.replace(/_/g, ' ')}`}
      backHref="/vendor/bookings"
    />
  )
}
