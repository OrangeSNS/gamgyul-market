import { useState, useEffect, useRef } from 'react'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'
import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Spinner from '@shared/components/Spinner'
import Modal from '@shared/components/Modal'
import BottomSheet from '@shared/components/BottomSheet'
import TopBar from '@app/layouts/TopBar'
import ImageCarousel from '@shared/components/ImageCarousel'
import { useAuth } from '@app/providers/AuthProvider'
import { Post, Comment } from '@shared/types'
import { ROUTES } from '@shared/constants'
import { request } from '@shared/api/client'
import { formatRelativeTime, parsePostImages } from '@shared/utils'
import {
  getPostDetail,
  deletePost,
  reportPost,
  getComments,
  createComment,
  deleteComment,
  reportComment,
} from '../api'

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [hearted, setHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(0)

  // 댓글 입력
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 게시글 바텀시트 / 모달
  const postSheet = useBottomSheet()
  const deletePostModal = useModal()
  const reportPostModal = useModal()

  // 댓글 바텀시트 / 모달
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const commentSheet = useBottomSheet()
  const deleteCommentModal = useModal()
  const reportCommentModal = useModal()

  const isMyPost = post?.author._id === me?._id

  useEffect(() => {
    if (!postId) return
    setLoading(true)
    Promise.all([getPostDetail(postId), getComments(postId)])
      .then(([{ post }, { comments }]) => {
        setPost(post)
        setHearted(post.hearted)
        setHeartCount(post.heartCount)
        setComments(comments ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [postId])

  /* ── 게시글 액션 ── */
  const handleHeart = async () => {
    if (!post) return
    const next = !hearted
    setHearted(next)
    setHeartCount((c) => (next ? c + 1 : c - 1))
    try {
      const method = next ? 'POST' : 'DELETE'
      const path = next ? `/post/${post.id}/heart` : `/post/${post.id}/unheart`
      await request(path, { method })
    } catch {
      setHearted(!next)
      setHeartCount((c) => (next ? c - 1 : c + 1))
    }
  }

  const handleDeletePost = async () => {
    if (!postId) return
    try {
      await deletePost(postId)
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

  const handleReportPost = async () => {
    if (!postId) return
    try {
      await reportPost(postId)
    } catch (err) {
      console.error(err)
    }
    reportPostModal.close()
    postSheet.close()
  }

  /* ── 댓글 액션 ── */
  const handleSubmitComment = async () => {
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

  const handleDeleteComment = async () => {
    if (!postId || !selectedComment) return
    try {
      await deleteComment(postId, selectedComment.id)
      setComments((prev) => prev.filter((c) => c.id !== selectedComment.id))
    } catch (err) {
      console.error(err)
    }
    setSelectedComment(null)
    deleteCommentModal.close()
  }

  const handleReportComment = async () => {
    if (!postId || !selectedComment) return
    try {
      await reportComment(postId, selectedComment.id)
    } catch (err) {
      console.error(err)
    }
    reportCommentModal.close()
    commentSheet.close()
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  if (!post)
    return (
      <div className="flex justify-center py-20 text-sm text-gray-500">
        게시글을 찾을 수 없습니다.
      </div>
    )

  const images = parsePostImages(post.image)

  return (
    <div className="flex flex-col bg-white">
      {/* 상단 바 */}
      <TopBar
        title=""
        showBack
        rightSlot={
          <button
            onClick={postSheet.open}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="더보기"
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-gray-700"
              fill="currentColor"
            >
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        }
      />

      {/* 스크롤 영역: AppLayout의 pb-16(TabBar) + 댓글입력창 높이(56px) 확보 */}
      <div className="pb-32">
        {/* ── 게시글 ── */}
        <article className="px-4 py-4">
          {/* 작성자 */}
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => navigate(ROUTES.PROFILE(post.author.accountname))}>
              <Avatar src={post.author.image} alt={post.author.username} size="sm" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{post.author.username}</p>
              <p className="text-xs text-gray-400 truncate">@{post.author.accountname}</p>
            </div>
          </div>

          {/* 본문 */}
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line mb-3">
            {post.content}
          </p>

          {/* 이미지 캐러셀 */}
          {images.length > 0 && (
            <div className="mb-3">
              <ImageCarousel images={images} showDots={images.length > 1} />
            </div>
          )}

          {/* 좋아요 · 댓글 수 */}
          <div className="flex items-center gap-4 py-2">
            <button onClick={handleHeart} className="flex items-center gap-1.5">
              {hearted ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
              <span className="text-xs text-gray-500">{heartCount}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-xs text-gray-500">{comments.length}</span>
            </div>

            <span className="text-xs text-gray-400 ml-auto">
              {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </article>

        {/* 구분선 */}
        <div className="h-px bg-gray-100" />

        {/* ── 댓글 목록 ── */}
        <div className="px-4 py-3">
          {comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">첫 댓글을 작성해보세요!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="mb-5 flex gap-3">
                <button
                  onClick={() => navigate(ROUTES.PROFILE(comment.author.accountname))}
                  className="shrink-0"
                >
                  <Avatar src={comment.author.image} alt={comment.author.username} size="xs" />
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
      </div>

      {/* ── 댓글 입력창: TabBar(z-40, ~60px) 바로 위에 위치 ── */}
      <div className="fixed bottom-[60px] left-1/2 z-50 flex w-full max-w-mobile -translate-x-1/2 items-center gap-3 border-t border-[#EAEAEA] bg-white px-4 py-3">
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
              handleSubmitComment()
            }
          }}
          className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-300"
        />
        <button
          onClick={handleSubmitComment}
          disabled={!content.trim() || submitting}
          className="shrink-0 text-[14px] font-semibold text-[#F28C45] disabled:text-[#D9D9D9]"
        >
          게시
        </button>
      </div>

      {/* ── 게시글 바텀시트 / 모달 ── */}
      <BottomSheet
        open={postSheet.isOpen}
        onClose={postSheet.close}
        items={
          isMyPost
            ? [
                { label: '삭제', danger: true, onClick: deletePostModal.open },
                { label: '수정', onClick: () => navigate(ROUTES.POST_NEW) },
              ]
            : [{ label: '신고', danger: true, onClick: reportPostModal.open }]
        }
      />
      <Modal
        open={deletePostModal.isOpen}
        message="게시글을 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={handleDeletePost}
        onCancel={deletePostModal.close}
        destructive
      />
      <Modal
        open={reportPostModal.isOpen}
        message="이 게시글을 신고하시겠어요?"
        confirmLabel="신고"
        onConfirm={handleReportPost}
        onCancel={reportPostModal.close}
        destructive
      />

      {/* ── 댓글 바텀시트 / 모달 ── */}
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
                    deleteCommentModal.open()
                  },
                },
              ]
            : [
                {
                  label: '신고',
                  danger: true,
                  onClick: () => {
                    commentSheet.close()
                    reportCommentModal.open()
                  },
                },
              ]
        }
      />
      <Modal
        open={deleteCommentModal.isOpen}
        message="댓글을 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={handleDeleteComment}
        onCancel={deleteCommentModal.close}
        destructive
      />
      <Modal
        open={reportCommentModal.isOpen}
        message="이 댓글을 신고하시겠어요?"
        confirmLabel="신고"
        onConfirm={handleReportComment}
        onCancel={reportCommentModal.close}
        destructive
      />
    </div>
  )
}
