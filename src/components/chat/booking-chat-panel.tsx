'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  vendorAcceptBooking,
  vendorRejectBooking,
} from '@/lib/actions/booking-vendor-response'
import { sendChatMessage } from '@/lib/actions/chat'
import {
  useBookingChat,
  isOptimisticMessageId,
} from '@/hooks/use-booking-chat'
import type { bookings } from '@/lib/db/schema'
import type { ChatMessageDto, MessageCursor } from '@/lib/db/chat'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type BookingStatus = (typeof bookings.$inferSelect)['status']

type Props = {
  bookingId: string
  threadId: string
  initialMessages: ChatMessageDto[]
  initialNextCursor: MessageCursor | null
  currentUserId: string
  title: string
  subtitle: string
  /** Standalone page: full card chrome + back link. Embedded: fills chat column only. */
  layout?: 'standalone' | 'embedded'
  backHref?: string
  bookingStatus: BookingStatus
  isVendor: boolean
}

export function BookingChatPanel({
  bookingId,
  threadId,
  initialMessages,
  initialNextCursor,
  currentUserId,
  title,
  subtitle,
  layout = 'embedded',
  backHref,
  bookingStatus,
  isVendor,
}: Props) {
  const router = useRouter()
  const {
    messages,
    nextCursor,
    loadingOlder,
    loadOlder,
    addOptimisticMessage,
    replaceOptimisticMessage,
    removeOptimisticMessage,
  } = useBookingChat({
    bookingId,
    threadId,
    initialMessages,
    initialNextCursor,
  })

  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [vendorActionLoading, setVendorActionLoading] = useState<
    'accept' | 'reject' | null
  >(null)

  const showVendorPendingActions =
    isVendor && bookingStatus === 'PENDING'

  async function handleSend() {
    const text = draft.trim()
    if (!text) return
    setError(null)

    const tempId = `temp-${crypto.randomUUID()}`
    const optimistic: ChatMessageDto = {
      id: tempId,
      threadId,
      senderId: currentUserId,
      content: text,
      createdAt: new Date().toISOString(),
    }
    addOptimisticMessage(optimistic)
    setDraft('')

    const res = await sendChatMessage(bookingId, text)
    if (!res.ok) {
      removeOptimisticMessage(tempId)
      setError(res.error)
      return
    }
    replaceOptimisticMessage(tempId, res.message)
  }

  async function handleAccept() {
    setVendorActionLoading('accept')
    setError(null)
    try {
      const res = await vendorAcceptBooking(bookingId)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setRejectOpen(false)
      router.refresh()
    } finally {
      setVendorActionLoading(null)
    }
  }

  async function handleRejectSubmit() {
    setVendorActionLoading('reject')
    setError(null)
    try {
      const res = await vendorRejectBooking(bookingId, rejectReason)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setRejectOpen(false)
      setRejectReason('')
      router.refresh()
    } finally {
      setVendorActionLoading(null)
    }
  }

  const shellClass =
    layout === 'standalone'
      ? 'flex min-h-[min(70vh,560px)] flex-col rounded-xl border border-border bg-card'
      : 'flex min-h-0 flex-1 flex-col bg-background'

  return (
    <div className={shellClass}>
      <header className="border-border shrink-0 border-b px-4 py-3">
        <div className="flex flex-col gap-1">
          {layout === 'standalone' && backHref ? (
            <Link
              href={backHref}
              className="text-muted-foreground hover:text-foreground text-xs font-medium"
            >
              ← Back to bookings
            </Link>
          ) : null}
          <h1 className="text-foreground text-lg font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
      </header>

      {showVendorPendingActions ? (
        <div className="border-border bg-muted/20 flex shrink-0 flex-wrap gap-2 border-b px-4 py-2">
          <Button
            type="button"
            size="sm"
            disabled={vendorActionLoading !== null}
            onClick={() => void handleAccept()}
          >
            {vendorActionLoading === 'accept' ? 'Accepting…' : 'Accept'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={vendorActionLoading !== null}
            onClick={() => setRejectOpen(true)}
          >
            Reject
          </Button>
        </div>
      ) : null}

      <ScrollArea className="min-h-0 flex-1 px-3 py-3">
        <div className="flex flex-col gap-3 pb-2">
          {nextCursor ? (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                disabled={loadingOlder}
                onClick={() => void loadOlder()}
              >
                {loadingOlder ? 'Loading…' : 'Load earlier messages'}
              </Button>
            </div>
          ) : null}
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isOwn={m.senderId === currentUserId}
              pending={isOptimisticMessageId(m.id)}
            />
          ))}
        </div>
      </ScrollArea>

      {error ? (
        <p className="text-destructive shrink-0 px-4 pb-1 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <footer className="border-border shrink-0 border-t p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            rows={2}
            className="min-h-0 flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void handleSend()
              }
            }}
          />
          <Button
            type="button"
            onClick={() => void handleSend()}
            disabled={!draft.trim()}
            className="shrink-0"
          >
            Send
          </Button>
        </div>
      </footer>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Decline booking</DialogTitle>
            <DialogDescription>
              The customer will see this reason in the chat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Brief reason…"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={
                vendorActionLoading !== null || rejectReason.trim().length < 3
              }
              onClick={() => void handleRejectSubmit()}
            >
              {vendorActionLoading === 'reject' ? 'Declining…' : 'Decline'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MessageBubble({
  message,
  isOwn,
  pending,
}: {
  message: ChatMessageDto
  isOwn: boolean
  pending?: boolean
}) {
  const time = format(new Date(message.createdAt), 'MMM d, h:mm a')
  return (
    <div
      className={cn(
        'flex max-w-[min(100%,36rem)] flex-col gap-0.5',
        isOwn ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      <div
        className={cn(
          'rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap',
          isOwn
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
          pending && 'opacity-80'
        )}
      >
        {message.content}
      </div>
      <span className="text-muted-foreground px-1 text-[10px]">{time}</span>
    </div>
  )
}
