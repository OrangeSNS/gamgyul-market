import { useState } from 'react'
import { useAuth } from '@app/providers/AuthProvider'
import { sendTextMessage, sendImageMessage } from '@shared/firebase/firestore'
import type { ChatParticipantProfile } from '../types/chat.types'

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

    const senderProfile: ChatParticipantProfile = {
      accountName: user.accountname,
      username: user.username,
      image: user.image,
    }

    setIsSending(true)
    try {
      await sendTextMessage(chatId, senderProfile, text)
    } finally {
      setIsSending(false)
    }
  }

  async function sendImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !user || !chatId) return

    const senderProfile: ChatParticipantProfile = {
      accountName: user.accountname,
      username: user.username,
      image: user.image,
    }

    setIsSending(true)
    try {
      await sendImageMessage(chatId, senderProfile, imageUrl)
    } finally {
      setIsSending(false)
    }
  }

  return { sendMessage, sendImage, isSending }
}
