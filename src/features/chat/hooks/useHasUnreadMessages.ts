import { useState, useEffect } from 'react'
import { useAuth } from '@app/providers/AuthProvider'
import { ensureFirebaseSession } from '@shared/firebase/auth'
import { subscribeUnreadChats } from '@shared/firebase/firestore'

export function useHasUnreadMessages(): boolean {
  const { user } = useAuth()
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    if (!user) return

    let unsubscribe: (() => void) | null = null
    let cancelled = false

    async function init() {
      await ensureFirebaseSession()
      if (cancelled) return
      unsubscribe = subscribeUnreadChats(user!.accountname, (value) => {
        if (!cancelled) setHasUnread(value)
      })
    }

    init()

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [user])

  return hasUnread
}
