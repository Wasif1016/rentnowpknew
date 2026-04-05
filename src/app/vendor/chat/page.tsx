import { getRequiredUser } from '@/lib/auth/session'
import { BookingChatShell } from '@/components/chat/booking-chat-shell'
import { listBookingChatsForVendor } from '@/lib/db/chat'

export default async function VendorChatHubPage() {
  const user = await getRequiredUser('VENDOR')
  const rows = await listBookingChatsForVendor(user.id)

  return (
    <BookingChatShell rows={rows} basePath="/vendor/chat">
      <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-sm">
        <p className="text-foreground font-medium">Select a conversation</p>
        <p>Choose a booking from the list to chat with the customer.</p>
      </div>
    </BookingChatShell>
  )
}
