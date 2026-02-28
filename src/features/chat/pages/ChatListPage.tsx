import { useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import { ROUTES } from '@shared/constants'
import TopBar from '@app/layouts/TopBar'

// 채팅 목록 - 마크업 전용 (서버 기능 없음)
const MOCK_CHATS = [
  {
    id: '1',
    name: '애플을 위니브 감귤농장',
    preview: '이번 정기 전국마촌마?',
    time: '2020.10.25',
    image: '',
    unread: 0,
  },
  {
    id: '2',
    name: '제주감귤마을',
    preview: '같은 어동의 주제같. 퐁스로이스는 뇨 탈배 예약...',
    time: '2020.10.25',
    image: '',
    unread: 1,
  },
  {
    id: '3',
    name: '누구네 농장 진환경 환마병',
    preview: '내 타는 내가 정리한다. 요즘 사변에서 정의 이...',
    time: '2020.10.25',
    image: '',
    unread: 0,
  },
]

export default function ChatListPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      <TopBar
        showBack
        rightSlot={
          <button type="button" className="p-1 rounded-full hover:bg-gray-100" aria-label="더보기">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        }
      />

      {MOCK_CHATS.map((chat) => (
        <button
          key={chat.id}
          onClick={() => navigate(ROUTES.CHAT_ROOM(chat.id))}
          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50"
        >
          <div className="relative">
            <Avatar src={chat.image} alt={chat.name} size="md" />
            {chat.unread > 0 && (
              <span className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-brand text-white text-[10px] flex items-center justify-center">
                {chat.unread}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-gray-900 truncate">{chat.name}</p>
            <p className="text-xs text-[#767676] truncate">{chat.preview}</p>
          </div>
          <span className="text-xs text-[#767676] flex-shrink-0 self-end">{chat.time}</span>
        </button>
      ))}
    </div>
  )
}
