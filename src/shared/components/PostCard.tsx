import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { Post } from '@shared/types'
import { formatRelativeTime, parsePostImages } from '@shared/utils'
import { ROUTES } from '@shared/constants'
import { request } from '@shared/api/client'

interface PostCardProps {
  post: Post
  onDelete?: (postId: string) => void
  isMyPost?: boolean
}

export default function PostCard({ post, onDelete, isMyPost = false }: PostCardProps) {
  const navigate = useNavigate()
  const [hearted, setHearted] = useState(post.hearted)
  const [heartCount, setHeartCount] = useState(post.heartCount)

  const images = parsePostImages(post.image)

  const handleHeart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // UI 토글만 (낙관적 업데이트)
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
      // 롤백
      setHearted(!nextHearted)
      setHeartCount((c) => (nextHearted ? c - 1 : c + 1))
    }
  }

  return (
    <article className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
      {/* Author */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => navigate(ROUTES.PROFILE(post.author.accountname))}
          className="flex items-center gap-2"
        >
          <Avatar src={post.author.image} alt={post.author.username} size="sm" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {post.author.username}
            </p>
            <p className="text-xs text-gray-400">@{post.author.accountname}</p>
          </div>
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

        <span className="text-xs text-gray-400 ml-auto">
          {formatRelativeTime(post.createdAt)}
        </span>
      </div>
    </article>
  )
}
