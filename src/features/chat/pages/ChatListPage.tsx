import { useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import UserMenuTopBar from '@shared/components/UserMenuTopBar'
import Spinner from '@shared/components/Spinner'
import { ROUTES } from '@shared/constants'
import { formatChatTime } from '@shared/utils/formatChatTime'
import { useChatList } from '../hooks/useChatList'
import { usePageTitle } from '@shared/hooks/usePageTitle'

export default function ChatListPage() {
  const navigate = useNavigate()
  const { items, isLoading, error } = useChatList()
  usePageTitle('채팅')

  return (
    <div className="flex flex-col">
      <UserMenuTopBar showBack />

      <div className="pt-6">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-center text-sm text-gray-500 py-10">{error}</p>
        )}

        {!isLoading && !error && items.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-10">
            아직 팔로잉한 사용자가 없습니다.
          </p>
        )}

        {!isLoading && !error && items.map((item) => (
          <button
            key={item.chatId}
            onClick={() => navigate(ROUTES.CHAT_ROOM(item.user.accountname))}
            className="w-full flex items-center gap-3 px-4 pb-5 hover:bg-gray-50 border-b border-gray-50"
          >
            <div className="relative shrink-0">
              <Avatar src={item.user.image} alt={item.user.username} size="md" />
              {item.isUnread && (
                <>
                  <span className="absolute top-0 left-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" aria-hidden="true" />
                  <span className="sr-only">읽지 않은 메시지 있음</span>
                </>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.user.username}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-normal leading-none tracking-normal text-[#767676] truncate flex-1">
                  {item.lastMessage ?? '대화를 시작해보세요'}
                </p>
                {item.lastMessageAt && (
                  <span className="text-[10px] font-normal text-[#DBDBDB] shrink-0">
                    {formatChatTime(item.lastMessageAt)}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
