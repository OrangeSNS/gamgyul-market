import { useState } from 'react'
import { useAuth } from '@app/providers/AuthProvider'
import { sendTextMessage, sendImageMessage } from '@shared/firebase/firestore'
import type { ChatParticipantProfile } from '../types/chat.types'
import type { User } from '@shared/types'

function buildSenderProfile(user: User): ChatParticipantProfile {
  return {
    accountName: user.accountname,
    username: user.username,
    image: user.image,
  }
}

interface UseSendMessageResult {
  sendMessage: (text: string) => Promise<void>
  sendImage: (imageUrl: string) => Promise<void>
  isSending: boolean
}

export function useSendMessage(chatId: string): UseSendMessageResult {
  const { user } = useAuth()
  const [isSending, setIsSending] = useState(false)

  async function sendMessage(text: string): Promise<void> {
    if (!text.trim() || !user || !chatId) return
    setIsSending(true)
    try {
      await sendTextMessage(chatId, buildSenderProfile(user), text)
    } finally {
      setIsSending(false)
    }
  }

  async function sendImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !user || !chatId) return
    setIsSending(true)
    try {
      await sendImageMessage(chatId, buildSenderProfile(user), imageUrl)
    } finally {
      setIsSending(false)
    }
  }

  return { sendMessage, sendImage, isSending }
}
