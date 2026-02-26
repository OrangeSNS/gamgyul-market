import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import BottomSheet from '@shared/components/BottomSheet'
import Modal from '@shared/components/Modal'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'

// 채팅방 - 마크업 전용 (서버 기능 없음)
const MOCK_MESSAGES = [
  {
    id: '1',
    text: '옷을 인생을 그림으로 읽었으면 좋은 이 삶은 곧로 무리의 뿌리이다. 인성의 청준의 예 따뜻한 그들의 그와 약동 하다. 네고, 모질 넘는 풍부하게 뛰노는 인생의 힘입니다.',
    mine: false,
    time: '12:39',
    image: null,
  },
  {
    id: '2',
    text: '안녕하세요. 감귤 사고싶어요요요요요',
    mine: false,
    time: '12:41',
    image: null,
  },
  {
    id: '3',
    text: '네 말씀하시죠.',
    mine: true,
    time: '12:50',
    image: null,
  },
  {
    id: '4',
    text: null,
    mine: true,
    time: '12:51',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300',
  },
]

export default function ChatRoomPage() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const chatSheet = useBottomSheet()
  const leaveModal = useModal()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const chatName = '애플을 위니브 감귤농장'

  return (
    <div className="flex flex-col min-h-screen">
     {/* TopBar */}
<header className="sticky top-0 z-30 flex h-14 items-center border-b border-gray-100 bg-white px-4">
  {/* 왼쪽 뒤로가기 */}
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="flex h-8 w-8 items-center justify-center"
    aria-label="뒤로가기"
  >
    <img
      src="/icons/icon-arrow-left.svg"
      alt=""
      className="h-5 w-5 object-contain"
    />
  </button>

  {/* 가운데 비우기 */}
  <div className="flex-1" />

  {/* 오른쪽 더보기 */}
  <button
    type="button"
    onClick={chatSheet.open}
    className="flex h-8 w-8 items-center justify-center"
    aria-label="채팅방 옵션"
  >
    <img
      src="/icons/icon-more-vertical.svg"
      alt=""
      className="h-5 w-5 object-contain"
    />
  </button>
</header>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 pb-20 flex flex-col gap-4">
        {MOCK_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.mine ? 'flex-row-reverse' : ''}`}
          >
            {!msg.mine && <Avatar size="xs" />}
            <div className="flex flex-col gap-1 max-w-[70%]">
              {msg.text && (
                <div
                  className={[
                    'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.mine
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm',
                  ].join(' ')}
                >
                  {msg.text}
                </div>
              )}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="채팅 이미지"
                  className="w-48 h-48 object-cover rounded-2xl"
                />
              )}
              <span className={`text-[10px] text-gray-400 ${msg.mine ? 'text-right' : ''}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-100 px-4 py-2 flex items-center gap-2">
        <button className="p-1.5 rounded-full hover:bg-gray-100">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="메시지 입력하기..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
        />
        <button
          disabled={!message.trim()}
          className="text-sm font-semibold text-brand disabled:text-gray-300 px-1"
        >
          전송
        </button>
      </div>

      <BottomSheet
        open={chatSheet.isOpen}
        onClose={chatSheet.close}
        items={[
          {
            label: '채팅방 나가기',
            danger: true,
            onClick: leaveModal.open,
          },
        ]}
      />

      <Modal
        open={leaveModal.isOpen}
        message="채팅방을 나가시겠어요?"
        confirmLabel="나가기"
        onConfirm={() => navigate(-1)}
        onCancel={leaveModal.close}
        destructive
      />
    </div>
  )
}
