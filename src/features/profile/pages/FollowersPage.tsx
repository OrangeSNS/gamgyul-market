import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import UserListItem from '@shared/components/UserListItem'
import Spinner from '@shared/components/Spinner'
import { User } from '@shared/types'
import { useFollow } from '@app/providers/FollowProvider'
import { getFollowers } from '../api'

export default function FollowersPage() {
  const { accountName } = useParams<{ accountName: string }>()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { syncFollowStates } = useFollow()

  useEffect(() => {
    if (!accountName) return
    getFollowers(accountName)
      .then((data) => {
        setUsers(data)
        // 로드된 유저들의 isfollow 상태를 전역 스토어에 반영
        syncFollowStates(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [accountName])

  return (
    <div className="flex flex-col">
      <TopBar title="팔로워" showBack />
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">팔로워가 없습니다.</p>
      ) : (
        users.map((user) => (
          // onFollowToggle 없음: 언팔로우해도 목록에서 즉시 삭제하지 않음
          // 다시 진입 시 API 재fetch로 최신 상태 반영
          <UserListItem key={user._id} user={user} />
        ))
      )}
    </div>
  )
}
