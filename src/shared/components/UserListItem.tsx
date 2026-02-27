import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import Button from './Button'
import { User } from '@shared/types'
import { ROUTES } from '@shared/constants'
import { followUser, unfollowUser } from '@features/profile/api'
import { useFollow } from '@app/providers/FollowProvider'

interface UserListItemProps {
  user: User
  onFollowToggle?: (accountname: string, following: boolean) => void
}

export default function UserListItem({ user, onFollowToggle }: UserListItemProps) {
  const navigate = useNavigate()
  const { isFollowing, syncFollowState, recordFollowAction } = useFollow()

  // 전역 스토어에서 팔로우 상태를 읽음
  const following = isFollowing(user.accountname)

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !following
    try {
      if (next) {
        await followUser(user.accountname)
      } else {
        await unfollowUser(user.accountname)
      }
      syncFollowState(user.accountname, next)
      // 내 followingCount ±1, 상대방 followerCount ±1 동시 반영
      recordFollowAction(user.accountname, next)
      onFollowToggle?.(user.accountname, next)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
      onClick={() => navigate(ROUTES.PROFILE(user.accountname))}
    >
      <Avatar src={user.image} alt={user.username} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
        <p className="text-xs text-gray-400 truncate">@{user.accountname}</p>
      </div>
      <Button
        variant={following ? 'outline' : 'primary'}
        size="sm"
        onClick={handleFollow}
      >
        {following ? '취소' : '팔로우'}
      </Button>
    </div>
  )
}
