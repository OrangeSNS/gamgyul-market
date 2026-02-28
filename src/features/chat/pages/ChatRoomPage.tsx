import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import BottomSheet from '@shared/components/BottomSheet'
import Modal from '@shared/components/Modal'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'
import TopBar from '@app/layouts/TopBar'

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatSheet = useBottomSheet()
  const leaveModal = useModal()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const chatName = '애플을 위니브 감귤농장'

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F2F2]">
      <TopBar
        showBack
        title={chatName}
        titleAlign="left"
        rightSlot={
          <button type="button" onClick={chatSheet.open} className="p-1 rounded-full hover:bg-gray-100" aria-label="채팅방 옵션">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        }
      />

      {/* Messages */}
      <div className="flex-1 px-4 py-4 pb-20 flex flex-col justify-end gap-[9px] bg-[#F2F2F2]">
        {MOCK_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.mine ? 'flex-row-reverse' : ''}`}
          >
            {!msg.mine && <Avatar className="w-[42px] h-[42px] shrink-0" />}
            <div className={`flex items-end gap-[6px] ${msg.mine ? 'flex-row-reverse' : ''}`}>
              <div className="flex flex-col max-w-[240px]">
                {msg.text && (
                  <div
                    className={[
                      'p-3 rounded-xl text-sm',
                      msg.mine
                        ? 'bg-brand text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-xl rounded-tl-none border border-[#C4C4C4]',
                    ].join(' ')}
                  >
                    {msg.text}
                  </div>
                )}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="채팅 이미지"
                    className="w-[273px] h-[240px] object-cover rounded-2xl"
                  />
                )}
              </div>
              <span className="text-[10px] text-[#767676] shrink-0">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-100 px-4 h-[60px] flex items-center">
        <button
          type="button"
          className="shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <img src="/icons/img-button.svg" alt="사진 첨부" className="w-9 h-9 object-contain" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
        <input
          type="text"
          placeholder="메시지 입력하기..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 ml-[18px] text-sm font-normal leading-none tracking-normal outline-none bg-transparent placeholder:text-[#C4C4C4]"
        />
        <button
          disabled={message.trim() === '' && imageFile === null}
          className="text-sm font-semibold text-brand disabled:text-[#C4C4C4]"
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
