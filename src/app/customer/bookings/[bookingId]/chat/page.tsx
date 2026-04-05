import { redirect } from 'next/navigation'

export default async function LegacyCustomerBookingChatRedirect({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  redirect(`/customer/chat/${bookingId}`)
}
