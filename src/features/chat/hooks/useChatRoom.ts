import { useState, useEffect } from 'react'
import { useAuth } from '@app/providers/AuthProvider'
import { ensureFirebaseSession } from '@shared/firebase/auth'
import { subscribeMessages, getOrCreateDirectChat, markChatAsRead } from '@shared/firebase/firestore'
import { getProfile } from '@features/profile/api'
import { buildChatId } from '../utils/buildChatId'
import type { ChatMessage } from '../types/chat.types'
import type { User } from '@shared/types'

interface UseChatRoomResult {
  messages: ChatMessage[]
  targetProfile: User | null
  chatId: string
  isLoading: boolean
  error: string | null
}

export function useChatRoom(targetAccountName: string): UseChatRoomResult {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [targetProfile, setTargetProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const chatId = user ? buildChatId(user.accountname, targetAccountName) : ''

  useEffect(() => {
    if (!user || !targetAccountName) return

    let unsubscribe: (() => void) | null = null
    let cancelled = false

    async function init() {
      try {
        setIsLoading(true)
        setError(null)

        await ensureFirebaseSession()

        const { profile } = await getProfile(targetAccountName)
        if (cancelled) return
        setTargetProfile(profile)

        const myProfile = {
          accountName: user!.accountname,
          username: user!.username,
          image: user!.image,
        }
        const targetChatProfile = {
          accountName: profile.accountname,
          username: profile.username,
          image: profile.image,
        }

        await getOrCreateDirectChat(myProfile, targetChatProfile)
        if (cancelled) return

        const currentChatId = buildChatId(user!.accountname, targetAccountName)

        await markChatAsRead(currentChatId, user!.accountname)

        unsubscribe = subscribeMessages(currentChatId, (msgs) => {
          if (!cancelled) setMessages(msgs)
        })
      } catch (err) {
        if (!cancelled) {
          setError('채팅방을 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    init()

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [user, targetAccountName])

  return { messages, targetProfile, chatId, isLoading, error }
}
