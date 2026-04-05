import { redirect } from 'next/navigation'

export default async function LegacyVendorBookingChatRedirect({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  redirect(`/vendor/chat/${bookingId}`)
}
