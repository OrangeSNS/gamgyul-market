import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Spinner from '@shared/components/Spinner'
import Modal from '@shared/components/Modal'
import BottomSheet from '@shared/components/BottomSheet'
import TopBar from '@app/layouts/TopBar'
import { useAuth } from '@app/providers/AuthProvider'
import { Post, Comment } from '@shared/types'
import { ROUTES } from '@shared/constants'
import { request } from '@shared/api/client'
import { formatRelativeTime, parsePostImages } from '@shared/utils'
import { getPostDetail, deletePost, reportPost, getComments } from '../api'

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user: me } = useAuth()

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [hearted, setHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(0)

  const [showPostSheet, setShowPostSheet] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const isMyPost = post?.author._id === me?._id

  useEffect(() => {
    if (!postId) return
    Promise.all([getPostDetail(postId), getComments(postId)])
      .then(([{ post }, { comment }]) => {
        setPost(post)
        setHearted(post.hearted)
        setHeartCount(post.heartCount)
        setComments(comment)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [postId])

  const handleHeart = async () => {
    if (!post) return
    const nextHearted = !hearted
    setHearted(nextHearted)
    setHeartCount((c) => (nextHearted ? c + 1 : c - 1))
    try {
      const method = nextHearted ? 'POST' : 'DELETE'
      const path = nextHearted ? `/post/${post.id}/heart` : `/post/${post.id}/unheart`
      await request(path, { method })
    } catch {
      setHearted(!nextHearted)
      setHeartCount((c) => (nextHearted ? c - 1 : c + 1))
    }
  }

  const handleDelete = async () => {
    if (!postId) return
    try {
      await deletePost(postId)
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

  const handleReport = async () => {
    if (!postId) return
    try {
      await reportPost(postId)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!post) return <div className="flex justify-center py-20 text-sm text-gray-500">게시글을 찾을 수 없습니다.</div>

  const images = parsePostImages(post.image)

  return (
    <div className="flex flex-col">
<TopBar
  title=""
  showBack
  rightSlot={
    <button
      onClick={() => setShowPostSheet(true)}
      className="flex h-8 w-8 items-center justify-center"
      aria-label="더보기"
      type="button"
    >
      <img
        src="/icons/icon-more-vertical.svg"
        alt=""
        className="h-6 w-6 object-contain"
      />
    </button>
  }
/>

      <article className="px-4 py-4">
        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate(ROUTES.PROFILE(post.author.accountname))}>
            <Avatar src={post.author.image} alt={post.author.username} size="sm" />
          </button>
          <div>
            <p className="text-sm font-semibold">{post.author.username}</p>
            <p className="text-xs text-gray-400">@{post.author.accountname}</p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line mb-3">{post.content}</p>

        {/* Images */}
        {images.length > 0 && (
          <div className={`mb-3 rounded-xl overflow-hidden ${images.length > 1 ? 'grid grid-cols-2 gap-1' : ''}`}>
            {images.map((url, idx) => (
              <img key={idx} src={url} alt="" className={`w-full object-cover bg-gray-100 ${images.length === 1 ? 'max-h-72 rounded-xl' : 'h-36'}`} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 py-2 border-b border-gray-100">
          <button onClick={handleHeart} className="flex items-center gap-1">
            {hearted ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
            <span className="text-xs text-gray-500">{heartCount}</span>
          </button>

          <button
            onClick={() => navigate(ROUTES.POST_COMMENTS(post.id))}
            className="flex items-center gap-1"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs text-gray-500">{post.commentCount}</span>
          </button>

          <span className="text-xs text-gray-400 ml-auto">{formatRelativeTime(post.createdAt)}</span>
        </div>

        {/* Comments preview */}
        <div className="mt-3">
          {comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className="flex gap-2 mb-3">
              <Avatar src={comment.author.image} size="xs" />
              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-900 mr-1.5">
                  {comment.author.username}
                </span>
                <span className="text-xs text-gray-700">{comment.content}</span>
              </div>
            </div>
          ))}
          {comments.length > 3 && (
            <button
              onClick={() => navigate(ROUTES.POST_COMMENTS(post.id))}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              댓글 {comments.length}개 모두 보기
            </button>
          )}
        </div>
      </article>

      {/* Post bottom sheet */}
      <BottomSheet
        open={showPostSheet}
        onClose={() => setShowPostSheet(false)}
        items={
          isMyPost
            ? [
                {
                  label: '삭제',
                  danger: true,
                  onClick: () => setShowDeleteModal(true),
                },
                {
                  label: '수정',
                  onClick: () => navigate(ROUTES.POST_NEW),
                },
              ]
            : [{ label: '신고', danger: true, onClick: () => setShowReportModal(true) }]
        }
      />

      <Modal
        open={showDeleteModal}
        message="게시글을 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        destructive
      />

      <Modal
        open={showReportModal}
        message="이 게시글을 신고하시겠어요?"
        confirmLabel="신고"
        onConfirm={() => {
          handleReport()
          setShowReportModal(false)
        }}
        onCancel={() => setShowReportModal(false)}
        destructive
      />
    </div>
  )
}
