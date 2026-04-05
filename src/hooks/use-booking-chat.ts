'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { chatThreadChannelName } from '@/lib/chat/constants'
import { fetchChatMessages } from '@/lib/actions/chat'
import type { ChatMessageDto, MessageCursor } from '@/lib/db/chat'

function parseBroadcastRecord(payload: unknown): ChatMessageDto | null {
  if (!payload || typeof payload !== 'object') return null
  const p = payload as Record<string, unknown>
  const inner = p.payload
  let rec: Record<string, unknown> | null = null
  if (inner && typeof inner === 'object') {
    const pl = inner as Record<string, unknown>
    if (pl.record && typeof pl.record === 'object') {
      rec = pl.record as Record<string, unknown>
    }
  }
  if (!rec && p.record && typeof p.record === 'object') {
    rec = p.record as Record<string, unknown>
  }
  if (!rec) return null
  const id = rec.id
  const threadId = rec.thread_id
  const senderId = rec.sender_id
  const content = rec.content
  const createdAt = rec.created_at
  if (
    typeof id !== 'string' ||
    typeof threadId !== 'string' ||
    typeof senderId !== 'string' ||
    typeof content !== 'string'
  ) {
    return null
  }
  const created =
    typeof createdAt === 'string'
      ? createdAt
      : createdAt instanceof Date
        ? createdAt.toISOString()
        : null
  if (!created) return null
  return {
    id,
    threadId,
    senderId,
    content,
    createdAt: created,
  }
}

export function useBookingChat(options: {
  bookingId: string
  threadId: string
  initialMessages: ChatMessageDto[]
  initialNextCursor: MessageCursor | null
}) {
  const { bookingId, threadId, initialMessages, initialNextCursor } = options

  const [messages, setMessages] = useState<ChatMessageDto[]>(initialMessages)
  const [nextCursor, setNextCursor] = useState<MessageCursor | null>(
    initialNextCursor
  )
  const [loadingOlder, setLoadingOlder] = useState(false)
  const idsRef = useRef<Set<string>>(new Set(initialMessages.map((m) => m.id)))

  useEffect(() => {
    idsRef.current = new Set(initialMessages.map((m) => m.id))
    setMessages(initialMessages)
    setNextCursor(initialNextCursor)
  }, [bookingId, initialMessages, initialNextCursor])

  const refetchLatest = useCallback(async () => {
    const res = await fetchChatMessages(bookingId)
    if (!res.ok) return
    const incoming = res.messages
    setMessages(incoming)
    setNextCursor(res.nextCursor)
    idsRef.current = new Set(incoming.map((m) => m.id))
  }, [bookingId])

  const loadOlder = useCallback(async () => {
    if (!nextCursor || loadingOlder) return
    setLoadingOlder(true)
    try {
      const res = await fetchChatMessages(bookingId, nextCursor)
      if (!res.ok) return
      const older = res.messages
      setMessages((prev) => {
        const merged = [...older, ...prev]
        const seen = new Set<string>()
        const out: ChatMessageDto[] = []
        for (const m of merged) {
          if (seen.has(m.id)) continue
          seen.add(m.id)
          out.push(m)
        }
        out.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        return out
      })
      for (const m of older) {
        idsRef.current.add(m.id)
      }
      setNextCursor(res.nextCursor)
    } finally {
      setLoadingOlder(false)
    }
  }, [bookingId, nextCursor, loadingOlder])

  useEffect(() => {
    const supabase = createClient()
    const channelName = chatThreadChannelName(threadId)
    const channelRef: { current: RealtimeChannel | null } = { current: null }
    let cancelled = false

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      await supabase.realtime.setAuth(session?.access_token ?? '')
      if (cancelled) return

      const ch = supabase.channel(channelName, {
        config: { private: true },
      })
      channelRef.current = ch

      ch.on('broadcast', { event: 'INSERT' }, (payload) => {
        const dto = parseBroadcastRecord(payload)
        if (!dto || dto.threadId !== threadId) return
        setMessages((prev) => {
          if (idsRef.current.has(dto.id)) return prev
          idsRef.current.add(dto.id)
          return [...prev, dto].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
          )
        })
      }).subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          void refetchLatest()
        }
      })
    })()

    return () => {
      cancelled = true
      const ch = channelRef.current
      channelRef.current = null
      if (ch) {
        void supabase.removeChannel(ch)
      }
    }
  }, [threadId, bookingId, refetchLatest])

  return {
    messages,
    setMessages,
    nextCursor,
    loadingOlder,
    loadOlder,
    refetchLatest,
  }
}
