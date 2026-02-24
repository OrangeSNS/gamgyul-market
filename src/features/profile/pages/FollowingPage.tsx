import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import UserListItem from '@shared/components/UserListItem'
import Spinner from '@shared/components/Spinner'
import { User } from '@shared/types'
import { getFollowing } from '../api'

export default function FollowingPage() {
  const { accountName } = useParams<{ accountName: string }>()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountName) return
    getFollowing(accountName)
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [accountName])

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
        users.map((user) => <UserListItem key={user._id} user={user} />)
      )}
    </div>
  )
}
