import { getRequiredUser } from '@/lib/auth/session'
import { BookingChatShell } from '@/components/chat/booking-chat-shell'
import { listBookingChatsForCustomer } from '@/lib/db/chat'

export default async function CustomerChatHubPage() {
  const user = await getRequiredUser('CUSTOMER')
  const rows = await listBookingChatsForCustomer(user.id)

  return (
    <BookingChatShell rows={rows} basePath="/customer/chat">
      <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-sm">
        <p className="text-foreground font-medium">Select a conversation</p>
        <p>Choose a booking from the list to open chat with the vendor.</p>
      </div>
    </BookingChatShell>
  )
}
