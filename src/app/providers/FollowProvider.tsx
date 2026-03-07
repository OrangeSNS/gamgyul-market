import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthProvider'
import type { User } from '@shared/types'

const FOLLOW_STORAGE_KEY = 'gamgyul_following'
interface FollowContextValue {
  isFollowing: (accountname: string) => boolean
  syncFollowState: (accountname: string, isFollow: boolean) => void
  syncFollowStates: (users: User[]) => void
  recordFollowAction: (targetAccountname: string, isFollow: boolean) => void
  clearFollowingDelta: () => void
  clearFollowerCountDelta: (accountname: string) => void
  followingDelta: number
  getFollowerCountDelta: (accountname: string) => number
}
const FollowContext = createContext<FollowContextValue | null>(null)
function loadSet(): Set<string> {
  try {
    const raw = localStorage.getItem(FOLLOW_STORAGE_KEY)
    if (raw) return new Set<string>(JSON.parse(raw) as string[])
  } catch {
  }
  return new Set<string>()
}
function saveSet(set: Set<string>): void {
  localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify([...set]))
}
export function FollowProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [followingSet, setFollowingSet] = useState<Set<string>>(loadSet)
  const [followingDelta, setFollowingDelta] = useState(0)
  const [followerCountDeltas, setFollowerCountDeltas] = useState<Map<string, number>>(
    () => new Map(),
  )
  useEffect(() => {
    if (!user) {
      setFollowingSet(new Set<string>())
      setFollowingDelta(0)
      setFollowerCountDeltas(new Map())
      localStorage.removeItem(FOLLOW_STORAGE_KEY)
    }
  }, [user])
  const isFollowing = useCallback(
    (accountname: string) => followingSet.has(accountname),
    [followingSet],
  )
  const syncFollowState = useCallback((accountname: string, isFollow: boolean) => {
    setFollowingSet((prev) => {
      const next = new Set(prev)
      if (isFollow) next.add(accountname)
      else next.delete(accountname)
      saveSet(next)
      return next
    })
  }, [])
  const syncFollowStates = useCallback((users: User[]) => {
    setFollowingSet((prev) => {
      const next = new Set(prev)
      let changed = false
      for (const u of users) {
        if (u.isfollow === true && !next.has(u.accountname)) {
          next.add(u.accountname)
          changed = true
        } else if (u.isfollow === false && next.has(u.accountname)) {
          next.delete(u.accountname)
          changed = true
        }
      }
      if (changed) saveSet(next)
      return changed ? next : prev
    })
  }, [])
  const recordFollowAction = useCallback(
    (targetAccountname: string, isFollow: boolean) => {
      const delta = isFollow ? 1 : -1
      setFollowingDelta((d) => d + delta)
      setFollowerCountDeltas((prev) => {
        const next = new Map(prev)
        next.set(targetAccountname, (prev.get(targetAccountname) ?? 0) + delta)
        return next
      })
    },
    [],
  )
  const clearFollowingDelta = useCallback(() => {
    setFollowingDelta(0)
  }, [])
  const clearFollowerCountDelta = useCallback((accountname: string) => {
    setFollowerCountDeltas((prev) => {
      if (!prev.has(accountname)) return prev
      const next = new Map(prev)
      next.delete(accountname)
      return next
    })
  }, [])
  const getFollowerCountDelta = useCallback(
    (accountname: string) => followerCountDeltas.get(accountname) ?? 0,
    [followerCountDeltas],
  )
  return (
    <FollowContext.Provider
      value={{
        isFollowing,
        syncFollowState,
        syncFollowStates,
        recordFollowAction,
        clearFollowingDelta,
        clearFollowerCountDelta,
        getFollowerCountDelta,
        followingDelta,
      }}
    >
      {children}
    </FollowContext.Provider>
  )
}
export function useFollow(): FollowContextValue {
  const ctx = useContext(FollowContext)
  if (!ctx) throw new Error('useFollow must be used within FollowProvider')
  return ctx
}
