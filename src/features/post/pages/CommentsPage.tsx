import { useState, useEffect, useRef } from 'react'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'
import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Spinner from '@shared/components/Spinner'
import Modal from '@shared/components/Modal'
import BottomSheet from '@shared/components/BottomSheet'
import TopBar from '@app/layouts/TopBar'
import { useAuth } from '@app/providers/AuthProvider'
import { Comment } from '@shared/types'
import { formatRelativeTime } from '@shared/utils'
import { ROUTES } from '@shared/constants'
import { getComments, createComment, deleteComment, reportComment } from '../api'

export default function CommentsPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)

  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Bottom sheet
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const commentSheet = useBottomSheet()
  const deleteModal = useModal()
  const reportModal = useModal()

  useEffect(() => {
    if (!postId) return

    setLoading(true)
    getComments(postId)
      .then(({ comments }) => setComments(comments ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [postId])

  const handleSubmit = async () => {
    if (!postId || !content.trim() || submitting) return

    setSubmitting(true)
    try {
      const { comment } = await createComment(postId, content.trim())
      setComments((prev) => [...prev, comment])
      setContent('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!postId || !selectedComment) return

    try {
      await deleteComment(postId, selectedComment.id)
      setComments((prev) => prev.filter((c) => c.id !== selectedComment.id))
    } catch (err) {
      console.error(err)
    }

    setSelectedComment(null)
    deleteModal.close()
    commentSheet.close()
  }

  const handleReport = async () => {
    if (!postId || !selectedComment) return

    try {
      await reportComment(postId, selectedComment.id)
    } catch (err) {
      console.error(err)
    }

    reportModal.close()
    commentSheet.close()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      {/* Top Bar - 피그마 스타일(뒤로가기 + 세로 더보기) */}
    <TopBar
  title=""
  showBack
  rightSlot={
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center"
      aria-label="게시글 옵션"
    >
      <img
        src="/icons/icon-more-vertical.svg"
        alt=""
        className="h-5 w-5 object-contain"
      />
    </button>
  }
/>

      {/* Comments list */}
      {/* pb-32: TabBar(60px) + 댓글입력창(56px) + 여유 */}
      <div className="flex-1 px-4 py-3 pb-32">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (comments?.length ?? 0) === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            첫 댓글을 작성해보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="mb-5 flex gap-3">
              <button
                onClick={() => navigate(ROUTES.PROFILE(comment.author.accountname))}
                className="shrink-0"
              >
                <Avatar
                  src={comment.author.image}
                  alt={comment.author.username}
                  size="xs"
                />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline gap-1.5">
                      <button
                        onClick={() => navigate(ROUTES.PROFILE(comment.author.accountname))}
                        className="truncate text-[14px] font-semibold text-gray-900 hover:underline"
                      >
                        {comment.author.username}
                      </button>
                      <span className="shrink-0 text-[12px] text-gray-400">
                        · {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>


                    <p className="break-words text-[14px] leading-6 text-gray-700">
                      {comment.content}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedComment(comment)
                      commentSheet.open()
                    }}
                   className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center"
                    aria-label="댓글 옵션"
                    type="button"
                  >
                    <img
                      src="/icons/icon-more-vertical.svg"
                      alt=""
                     className="h-6 w-6 object-contain"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

     {/* Input area: TabBar(60px) 바로 위 / 높이 61px */}
<div className="fixed bottom-[60px] left-1/2 z-50 flex h-[61px] w-full max-w-mobile -translate-x-1/2 items-center gap-3 border-t border-[#EAEAEA] bg-white px-4">
  <Avatar src={me?.image} alt={me?.username} size="xs" />

  <input
    ref={inputRef}
    type="text"
    placeholder="댓글 입력하기..."
    value={content}
    onChange={(e) => setContent(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    }}
    className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-300"
  />

  <button
    onClick={handleSubmit}
    disabled={!content.trim() || submitting}
    className="shrink-0 text-[14px] font-semibold text-[#F28C45] disabled:text-[#D9D9D9]"
  >
    게시
  </button>
</div>

      {/* Comment bottom sheet */}
      <BottomSheet
        open={commentSheet.isOpen}
        onClose={commentSheet.close}
        items={
          selectedComment?.author._id === me?._id
            ? [
                {
                  label: '삭제',
                  danger: true,
                  onClick: () => {
                    commentSheet.close()
                    deleteModal.open()
                  },
                },
              ]
            : [
                {
                  label: '신고',
                  danger: true,
                  onClick: () => {
                    commentSheet.close()
                    reportModal.open()
                  },
                },
              ]
        }
      />

      <Modal
        open={deleteModal.isOpen}
        message="댓글을 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={deleteModal.close}
        destructive
      />

      <Modal
        open={reportModal.isOpen}
        message="이 댓글을 신고하시겠어요?"
        confirmLabel="신고하기"
        onConfirm={handleReport}
        onCancel={reportModal.close}
        destructive
      />
    </div>
  )
}