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
  /** accountname 이 팔로우 중인지 여부 */
  isFollowing: (accountname: string) => boolean
  /** 단일 팔로우 상태 동기화 (API 응답 후 호출) */
  syncFollowState: (accountname: string, isFollow: boolean) => void
  /** 유저 목록의 isfollow 필드를 한꺼번에 스토어에 반영 */
  syncFollowStates: (users: User[]) => void

  /**
   * 팔로우/언팔로우 버튼 클릭 시 호출.
   * - 내 followingCount 델타 ±1
   * - targetAccountname 의 followerCount 델타 ±1
   */
  recordFollowAction: (targetAccountname: string, isFollow: boolean) => void

  /**
   * 내 프로필을 API에서 새로 불러왔을 때 호출.
   * followingDelta → 0 으로 초기화
   */
  clearFollowingDelta: () => void

  /**
   * 특정 유저의 프로필을 API에서 새로 불러왔을 때 호출.
   * 해당 유저의 followerCountDelta → 0 으로 초기화
   */
  clearFollowerCountDelta: (accountname: string) => void

  /** 현재 세션에서 쌓인 내 팔로잉 카운트 변화량 */
  followingDelta: number

  /**
   * 특정 유저의 followerCount 변화량 반환.
   * ProfilePage에서 다른 유저 프로필의 follower 숫자를 보정할 때 사용.
   */
  getFollowerCountDelta: (accountname: string) => number
}

const FollowContext = createContext<FollowContextValue | null>(null)

function loadSet(): Set<string> {
  try {
    const raw = localStorage.getItem(FOLLOW_STORAGE_KEY)
    if (raw) return new Set<string>(JSON.parse(raw) as string[])
  } catch {
    // 파싱 실패 시 빈 Set
  }
  return new Set<string>()
}

function saveSet(set: Set<string>): void {
  localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify([...set]))
}

export function FollowProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  // 내가 팔로우 중인 계정 목록 (localStorage 영속화)
  const [followingSet, setFollowingSet] = useState<Set<string>>(loadSet)

  // 내 followingCount 변화량 (API 재fetch 전까지 UI 선반영)
  const [followingDelta, setFollowingDelta] = useState(0)

  // 상대방별 followerCount 변화량 맵 { accountname → delta }
  const [followerCountDeltas, setFollowerCountDeltas] = useState<Map<string, number>>(
    () => new Map(),
  )

  // 로그아웃 시 모든 상태 초기화
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

  /**
   * 팔로우/언팔로우 시 양방향 카운트 델타 업데이트:
   *   - 나의 followingCount ±1
   *   - 상대방(targetAccountname)의 followerCount ±1
   */
  const recordFollowAction = useCallback(
    (targetAccountname: string, isFollow: boolean) => {
      const delta = isFollow ? 1 : -1

      // 내 팔로잉 카운트
      setFollowingDelta((d) => d + delta)

      // 상대방 팔로워 카운트
      setFollowerCountDeltas((prev) => {
        const next = new Map(prev)
        next.set(targetAccountname, (prev.get(targetAccountname) ?? 0) + delta)
        return next
      })
    },
    [],
  )

  /** 내 프로필 API 재fetch 후 호출 → followingDelta 초기화 */
  const clearFollowingDelta = useCallback(() => {
    setFollowingDelta(0)
  }, [])

  /** 특정 유저 프로필 API 재fetch 후 호출 → 해당 유저 followerCountDelta 초기화 */
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
