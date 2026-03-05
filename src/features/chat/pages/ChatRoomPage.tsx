import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@app/providers/AuthProvider'
import { uploadImage } from '@shared/api/client'
import Avatar from '@shared/components/Avatar'
import BottomSheet from '@shared/components/BottomSheet'
import Modal from '@shared/components/Modal'
import Spinner from '@shared/components/Spinner'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'
import TopBar from '@app/layouts/TopBar'
import { formatChatTime } from '@shared/utils/formatChatTime'
import { useChatRoom } from '../hooks/useChatRoom'
import { useSendMessage } from '../hooks/useSendMessage'

export default function ChatRoomPage() {
  const { targetAccountName = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null)
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null)
  const chatSheet = useBottomSheet()
  const leaveModal = useModal()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, targetProfile, chatId, isLoading, error } = useChatRoom(targetAccountName)
  const { sendMessage, sendImage, isSending } = useSendMessage(chatId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    try {
      const preview = URL.createObjectURL(file)
      const url = await uploadImage(file)
      setPendingImagePreview(preview)
      setPendingImageUrl(url)
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleCancelImage() {
    setPendingImageUrl(null)
    setPendingImagePreview(null)
  }

  async function handleSend() {
    if (isSending) return
    if (pendingImageUrl) {
      const url = pendingImageUrl
      setPendingImageUrl(null)
      setPendingImagePreview(null)
      await sendImage(url)
      return
    }
    const text = message.trim()
    if (!text) return
    setMessage('')
    await sendMessage(text)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F2F2]">
      <TopBar
        showBack
        title={targetProfile?.username ?? targetAccountName}
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
        {isLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-brand font-semibold"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !error && messages.map((msg) => {
          const isMine = msg.senderAccountName === user?.accountname
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isMine ? 'flex-row-reverse' : ''}`}
            >
              {!isMine && (
                <Avatar
                  src={targetProfile?.image}
                  alt={targetProfile?.username ?? ''}
                  className="w-[42px] h-[42px] shrink-0"
                />
              )}
              <div className={`flex items-end gap-[6px] ${isMine ? 'flex-row-reverse' : ''}`}>
                <div className="flex flex-col max-w-[240px]">
                  {msg.type === 'image' && msg.imageUrl ? (
                    <img
                      src={msg.imageUrl}
                      alt="채팅 이미지"
                      className={`w-48 h-48 object-cover ${isMine ? 'rounded-xl rounded-tr-none' : 'rounded-xl rounded-tl-none'}`}
                    />
                  ) : (
                    <div
                      className={[
                        'p-3 rounded-xl text-sm',
                        isMine
                          ? 'bg-brand text-white rounded-tr-none'
                          : 'bg-white text-gray-800 rounded-xl rounded-tl-none border border-[#C4C4C4]',
                      ].join(' ')}
                    >
                      {msg.text}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#767676] shrink-0">
                  {formatChatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-100">
        {pendingImagePreview && (
          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
            <div className="relative w-16 h-16 shrink-0">
              <img src={pendingImagePreview} alt="미리보기" className="w-16 h-16 object-cover rounded-lg" />
              <button
                type="button"
                onClick={handleCancelImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center"
                aria-label="이미지 취소"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className="pl-4 pr-4 h-[60px] flex items-center gap-[18px]">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUploading || isSending}
          className="shrink-0 p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40"
          aria-label="이미지 전송"
        >
          <img src="/icons/img-button.svg" alt="" className="w-9 h-9" />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="메시지 입력하기..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm font-normal leading-none tracking-normal outline-none bg-transparent placeholder:text-[#C4C4C4]"
        />
        <button
          onClick={handleSend}
          disabled={(message.trim() === '' && !pendingImageUrl) || isSending}
          className="text-sm font-semibold text-brand disabled:text-[#C4C4C4] ml-2"
        >
          전송
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        </div>
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
