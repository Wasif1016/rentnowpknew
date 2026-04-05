import { z } from 'zod'

export const CHAT_MESSAGE_MAX = 8000

export const ChatMessageContentSchema = z
  .string()
  .trim()
  .min(1, 'Message cannot be empty.')
  .max(CHAT_MESSAGE_MAX, 'Message is too long.')

export type ChatMessageContent = z.infer<typeof ChatMessageContentSchema>
