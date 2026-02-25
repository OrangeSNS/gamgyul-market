import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import Button from './Button'
import { User } from '@shared/types'
import { ROUTES } from '@shared/constants'

interface UserListItemProps {
  user: User
  onFollowToggle?: (accountname: string, following: boolean) => void
}

export default function UserListItem({ user, onFollowToggle }: UserListItemProps) {
  const navigate = useNavigate()
  const [isFollowing, setIsFollowing] = useState(user.isfollow ?? false)

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFollowing((prev) => !prev)
    onFollowToggle?.(user.accountname, !isFollowing)
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
        variant={isFollowing ? 'outline' : 'primary'}
        size="sm"
        onClick={handleFollow}
      >
        {isFollowing ? '취소' : '팔로우'}
      </Button>
    </div>
  )
}
