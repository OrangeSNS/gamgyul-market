import { useState, useEffect } from 'react'
import { useAuth } from '@app/providers/AuthProvider'
import { ensureFirebaseSession } from '@shared/firebase/auth'
import { getChatDoc } from '@shared/firebase/firestore'
import { getFollowing } from '@features/profile/api'
import { buildChatId } from '../utils/buildChatId'
import { mapFollowingToChatList } from '../utils/mapFollowingToChatList'
import type { ChatListItemVM } from '../types/chat.types'
import type { FirebaseError } from 'firebase/app'

interface UseChatListResult {
  items: ChatListItemVM[]
  isLoading: boolean
  error: string | null
}

export function useChatList(): UseChatListResult {
  const { user } = useAuth()
  const [items, setItems] = useState<ChatListItemVM[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        setError(null)

        await ensureFirebaseSession()

        const followingList = await getFollowing(user!.accountname)
        const chatIds = followingList.map((u) => buildChatId(user!.accountname, u.accountname))
        const chatDocs = await Promise.all(chatIds.map((id) => getChatDoc(id)))

        if (!cancelled) {
          setItems(mapFollowingToChatList(user!.accountname, followingList, chatDocs))
        }
      } catch (err) {
        console.error('[useChatList] failed:', err)

        const fe = err as FirebaseError
        if (fe?.code) {
          console.error('[useChatList] firebase code:', fe.code)
          console.error('[useChatList] firebase message:', fe.message)
        }

        if (!cancelled) {
          setError('채팅 목록을 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user])

  return { items, isLoading, error }
}