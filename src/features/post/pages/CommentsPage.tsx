import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Spinner from '@shared/components/Spinner'
import Modal from '@shared/components/Modal'
import BottomSheet from '@shared/components/BottomSheet'
import TopBar from '@app/layouts/TopBar'
import { useAuth } from '@app/providers/AuthProvider'
import { Comment } from '@shared/types'
import { formatRelativeTime } from '@shared/utils'
import { getComments, createComment, deleteComment, reportComment } from '../api'

export default function CommentsPage() {
  const { postId } = useParams<{ postId: string }>()
  const { user: me } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)

  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Bottom sheet
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => {
    if (!postId) return

    setLoading(true)
    getComments(postId)
      .then(({ comment }) => setComments(comment))
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
    setShowDeleteModal(false)
    setShowSheet(false)
  }

  const handleReport = async () => {
    if (!postId || !selectedComment) return

    try {
      await reportComment(postId, selectedComment.id)
    } catch (err) {
      console.error(err)
    }

    setShowReportModal(false)
    setShowSheet(false)
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
      <div className="flex-1 px-4 py-3 pb-24">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            첫 댓글을 작성해보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="mb-5 flex gap-3">
              <Avatar
                src={comment.author.image}
                alt={comment.author.username}
                size="xs"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline gap-1.5">
                      <span className="truncate text-[14px] font-semibold text-gray-900">
                        {comment.author.username}
                      </span>
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
                      setShowSheet(true)
                    }}
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center"
                    aria-label="댓글 옵션"
                    type="button"
                  >
                    <img
                      src="/icons/icon-more-vertical.svg"
                      alt=""
                      className="h-5 w-5 object-contain opacity-80"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-mobile -translate-x-1/2 items-center gap-2 border-t border-[#EAEAEA] bg-white px-4 py-3">
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
          className="px-1 text-[14px] font-semibold text-[#C7C7C7] disabled:text-[#D9D9D9]"
        >
          게시
        </button>
      </div>

      {/* Comment bottom sheet */}
      <BottomSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        items={
          selectedComment?.author._id === me?._id
            ? [
                {
                  label: '삭제',
                  danger: true,
                  onClick: () => {
                    setShowSheet(false)
                    setShowDeleteModal(true)
                  },
                },
              ]
            : [
                {
                  label: '신고',
                  danger: true,
                  onClick: () => {
                    setShowSheet(false)
                    setShowReportModal(true)
                  },
                },
              ]
        }
      />

      <Modal
        open={showDeleteModal}
        message="댓글을 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        destructive
      />

      <Modal
        open={showReportModal}
        message="이 댓글을 신고하시겠어요?"
        confirmLabel="신고"
        onConfirm={handleReport}
        onCancel={() => setShowReportModal(false)}
        destructive
      />
    </div>
  )
}