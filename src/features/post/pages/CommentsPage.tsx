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
  }

  const handleReport = async () => {
    if (!postId || !selectedComment) return
    try {
      await reportComment(postId, selectedComment.id)
    } catch (err) {
      console.error(err)
    }
    setShowReportModal(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="댓글" showBack />

      {/* Comments list */}
      <div className="flex-1 px-4 py-3 pb-24">
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : comments.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">첫 댓글을 작성해보세요!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 mb-4">
              <Avatar src={comment.author.image} alt={comment.author.username} size="xs" />
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-gray-900">
                    {comment.author.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
         <button
  onClick={() => {
    setSelectedComment(comment)
    setShowSheet(true)
  }}
  className="self-start flex h-6 w-6 items-center justify-center"
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
          ))
        )}
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2">
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
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || submitting}
          className="text-sm font-semibold text-brand disabled:text-gray-300"
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
                  onClick: () => setShowDeleteModal(true),
                },
              ]
            : [
                {
                  label: '신고',
                  danger: true,
                  onClick: () => setShowReportModal(true),
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
