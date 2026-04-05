/** Realtime channel topic prefix; must match DB trigger `thread:` || chat_threads.id. */
export const CHAT_THREAD_TOPIC_PREFIX = 'thread:' as const

export function chatThreadChannelName(threadId: string) {
  return `${CHAT_THREAD_TOPIC_PREFIX}${threadId}`
}
