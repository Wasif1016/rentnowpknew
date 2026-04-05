'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { useState } from 'react'
import { sendChatMessage } from '@/lib/actions/chat'
import { useBookingChat } from '@/hooks/use-booking-chat'
import type { ChatMessageDto, MessageCursor } from '@/lib/db/chat'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type Props = {
  bookingId: string
  threadId: string
  initialMessages: ChatMessageDto[]
  initialNextCursor: MessageCursor | null
  currentUserId: string
  title: string
  subtitle: string
  backHref: string
}

export function BookingChatPanel({
  bookingId,
  threadId,
  initialMessages,
  initialNextCursor,
  currentUserId,
  title,
  subtitle,
  backHref,
}: Props) {
  const {
    messages,
    nextCursor,
    loadingOlder,
    loadOlder,
    refetchLatest,
  } = useBookingChat({
    bookingId,
    threadId,
    initialMessages,
    initialNextCursor,
  })

  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend() {
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    setError(null)
    try {
      const res = await sendChatMessage(bookingId, text)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setDraft('')
      await refetchLatest()
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex min-h-[min(70vh,560px)] flex-col rounded-xl border border-border bg-card">
      <header className="border-b border-border px-4 py-3">
        <div className="flex flex-col gap-1">
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground text-xs font-medium"
          >
            ← Back to bookings
          </Link>
          <h1 className="text-foreground text-lg font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
      </header>

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
            />
          ))}
        </div>
      </ScrollArea>

      {error ? (
        <p className="text-destructive px-4 pb-1 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <footer className="border-t border-border p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            rows={2}
            className="min-h-0 flex-1"
            disabled={sending}
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
            disabled={sending || !draft.trim()}
            className="shrink-0"
          >
            {sending ? 'Sending…' : 'Send'}
          </Button>
        </div>
      </footer>
    </div>
  )
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: ChatMessageDto
  isOwn: boolean
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
            : 'bg-muted text-foreground'
        )}
      >
        {message.content}
      </div>
      <span className="text-muted-foreground px-1 text-[10px]">{time}</span>
    </div>
  )
}
