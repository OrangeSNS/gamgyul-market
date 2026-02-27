import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import UserListItem from '@shared/components/UserListItem'
import Spinner from '@shared/components/Spinner'
import { User } from '@shared/types'
import { useFollow } from '@app/providers/FollowProvider'
import { getFollowing } from '../api'

export default function FollowingPage() {
  const { accountName } = useParams<{ accountName: string }>()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { syncFollowStates } = useFollow()

  useEffect(() => {
    if (!accountName) return
    getFollowing(accountName)
      .then((data) => {
        setUsers(data)
        // 로드된 유저들의 isfollow 상태를 전역 스토어에 반영
        syncFollowStates(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [accountName])

  const handleFollowToggle = (targetAccountname: string, following: boolean) => {
    if (!following) {
      // 언팔로우 시 팔로잉 목록에서 즉시 제거
      setUsers((prev) => prev.filter((u) => u.accountname !== targetAccountname))
    }
  }

  return (
    <div className="flex flex-col">
      <TopBar title="팔로잉" showBack />
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">팔로잉이 없습니다.</p>
      ) : (
        users.map((user) => (
          <UserListItem key={user._id} user={user} onFollowToggle={handleFollowToggle} />
        ))
      )}
    </div>
  )
}
