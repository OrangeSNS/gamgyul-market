import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import BottomSheet from './BottomSheet'
import Modal from './Modal'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'
import { Post } from '@shared/types'
import { formatRelativeTime, parsePostImages } from '@shared/utils'
import { ROUTES } from '@shared/constants'
import { request } from '@shared/api/client'
import { deletePost, reportPost } from '@features/post/api'

interface PostCardProps {
  post: Post
  onDelete?: (postId: string) => void
  onEdit?: (postId: string) => void
  isMyPost?: boolean
}

export default function PostCard({ post, onDelete, onEdit, isMyPost = false }: PostCardProps) {
  const navigate = useNavigate()
  const [hearted, setHearted] = useState(post.hearted)
  const [heartCount, setHeartCount] = useState(post.heartCount)
  const menuSheet = useBottomSheet()
  const deleteModal = useModal()

  const images = parsePostImages(post.image)

  const handleHeart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextHearted = !hearted
    setHearted(nextHearted)
    setHeartCount((c) => (nextHearted ? c + 1 : c - 1))
    try {
      if (nextHearted) {
        await request(`/post/${post.id}/heart`, { method: 'POST' })
      } else {
        await request(`/post/${post.id}/unheart`, { method: 'DELETE' })
      }
    } catch {
      setHearted(!nextHearted)
      setHeartCount((c) => (nextHearted ? c - 1 : c + 1))
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost(post.id)
      onDelete?.(post.id)
    } catch (err) {
      console.error(err)
    }
    deleteModal.close()
  }

  const handleReport = async () => {
    try {
      await reportPost(post.id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <article className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
      {/* Author */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => navigate(ROUTES.PROFILE(post.author.accountname))}
          className="flex items-center gap-2"
        >
          <Avatar src={post.author.image} alt={post.author.username} size="sm" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {post.author.username}
            </p>
            <p className="text-xs text-gray-400">@ {post.author.accountname}</p>
          </div>
        </button>
        <button
          onClick={menuSheet.open}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="더보기"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <button
        className="w-full text-left"
        onClick={() => navigate(ROUTES.POST_DETAIL(post.id))}
      >
        <p className="text-sm text-gray-800 leading-relaxed mb-3 whitespace-pre-line">
          {post.content}
        </p>

        {/* Images */}
        {images.length > 0 && (
          <div
            className={`mb-3 rounded-xl overflow-hidden ${
              images.length > 1 ? 'grid grid-cols-2 gap-1' : ''
            }`}
          >
            {images.slice(0, 3).map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`게시글 이미지 ${idx + 1}`}
                className={`w-full object-cover bg-gray-100 ${
                  images.length === 1 ? 'max-h-60 rounded-xl' : 'h-32'
                }`}
              />
            ))}
          </div>
        )}
      </button>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleHeart}
          className="flex items-center gap-1 text-gray-500"
        >
          {hearted ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          <span className="text-xs">{heartCount}</span>
        </button>

        <button
          onClick={() => navigate(ROUTES.POST_COMMENTS(post.id))}
          className="flex items-center gap-1 text-gray-500"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs">{post.commentCount}</span>
        </button>
      </div>

      {/* Date */}
      <p className="text-xs text-gray-400 mt-2">
        {formatRelativeTime(post.createdAt)}
      </p>

      {/* Post menu bottom sheet */}
      <BottomSheet
        open={menuSheet.isOpen}
        onClose={menuSheet.close}
        items={
          isMyPost
            ? [
                { label: '삭제', onClick: deleteModal.open },
                { label: '수정', onClick: () => onEdit?.(post.id) },
              ]
            : [{ label: '신고하기', danger: true, onClick: handleReport }]
        }
      />

      {/* Delete confirm modal */}
      <Modal
        open={deleteModal.isOpen}
        message="게시글을 삭제할까요?"
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={deleteModal.close}
      />
    </article>
  )
}
