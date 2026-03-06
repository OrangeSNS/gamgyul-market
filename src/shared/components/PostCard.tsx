import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL, ROUTES } from '@shared/constants'
import BottomSheet from '@shared/components/BottomSheet'
import Modal from '@shared/components/Modal'
import { deletePost, reportPost, postLike, deleteLike } from '@features/post/api'
import { Post } from '@shared/types'
import { resolveImageUrl, parsePostImages } from '@shared/utils'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'
import ImageCarousel from './ImageCarousel'

interface PostCardProps {
  post: Post
  isMyPost?: boolean
  onDelete?: (id: string) => void
}

const DEFAULT_AUTHOR_IMAGE = `${API_BASE_URL}/1687141187512.png`

export default function PostCard({ post, isMyPost = false, onDelete }: PostCardProps) {
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(post.hearted)
  const [heartCount, setHeartCount] = useState(post.heartCount)
  const sheet = useBottomSheet()
  const deleteModal = useModal()

  const author = post.author
  const imageList = parsePostImages(post.image)

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !isLiked
    setIsLiked(next)
    setHeartCount((c) => (next ? c + 1 : c - 1))
    try {
      if (next) {
        await postLike(post.id)
      } else {
        await deleteLike(post.id)
      }
    } catch {
      setIsLiked(!next)
      setHeartCount((c) => (next ? c - 1 : c + 1))
    }
  }

  const handleKebab = (e: React.MouseEvent) => {
    e.stopPropagation()
    sheet.open()
  }

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(post.id)
      onDelete?.(post.id)
    } catch (err) {
      console.error(err)
    } finally {
      deleteModal.close()
    }
  }

  const myItems = [
    {
      label: '수정',
      onClick: () => navigate(ROUTES.POST_EDIT(post.id)),
    },
    {
      label: '삭제',
      danger: true,
      onClick: deleteModal.open,
    },
  ]

  const otherItems = [
    {
      label: '신고하기',
      danger: true,
      onClick: () => reportPost(post.id).catch(console.error),
    },
  ]

  return (
    <>
      <article
        onClick={() => navigate(ROUTES.POST_DETAIL(post.id))}
        className="w-full py-4 flex gap-3 border-b border-[#DBDBDB] last:border-none cursor-pointer px-4"
      >
        {/* 프로필 이미지 */}
        <img
          onClick={(e) => {
            e.stopPropagation()
            navigate(ROUTES.PROFILE(author.accountname))
          }}
          src={resolveImageUrl(author.image) ?? DEFAULT_AUTHOR_IMAGE}
          alt={`${author.username}님의 프로필`}
          className="w-[42px] h-[42px] rounded-full object-cover bg-gray-100 flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AUTHOR_IMAGE }}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          {/* 유저 정보 및 케밥 버튼 */}
          <div className="flex justify-between items-start mb-3">
            <div
              onClick={(e) => {
                e.stopPropagation()
                navigate(ROUTES.PROFILE(author.accountname))
              }}
              className="flex flex-col"
            >
              <strong className="text-[14px] font-medium text-black leading-[18px]">
                {author.username}
              </strong>
              <span className="text-[12px] text-[#767676] leading-[14px]">
                @ {author.accountname}
              </span>
            </div>
            <button onClick={handleKebab} className="p-1 flex-shrink-0">
              <img src="/icons/icon-more-vertical.svg" alt="더보기" className="w-[24px] h-[24px]" />
            </button>
          </div>

          {/* 게시글 본문 */}
          <p className="text-[14px] text-[#333333] mb-4 leading-[18px] whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* 이미지 영역 */}
          {imageList.length > 0 && (
            <div className="w-full mb-3 overflow-hidden rounded-[10px] border border-[#DBDBDB]">
              <ImageCarousel
                images={imageList}
                className='w-full h-full object-cover'
                showDots={imageList.length > 1}
              />
            </div>
          )}

          {/* 좋아요 · 댓글 */}
          <div className="flex gap-4 items-center">
            <button onClick={handleLike} className="flex items-center gap-1.5">
              <img
                src={isLiked ? '/icons/icon-heart-fill.svg' : '/icons/icon-heart.svg'}
                alt="좋아요"
                className="w-5 h-5"
              />
              <span className={`text-[12px] ${isLiked ? 'text-[#EB5757]' : 'text-[#767676]'}`}>
                {heartCount}
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              <img src="/icons/icon-message-circle.svg" alt="댓글" className="w-5 h-5" />
              <span className="text-[12px] text-[#767676]">{post.commentCount}</span>
            </div>
          </div>

          {/* 날짜 */}
          <time className="text-[10px] text-[#767676] mt-4 h-[12px] leading-[12px] flex items-center">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''}
          </time>
        </div>
      </article>

      {/* 케밥 바텀시트 */}
      <BottomSheet
        open={sheet.isOpen}
        onClose={sheet.close}
        items={isMyPost ? myItems : otherItems}
      />

      {/* 삭제 확인 모달 */}
      <Modal
        open={deleteModal.isOpen}
        message="게시글을 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteModal.close}
        destructive
      />
    </>
  )
}
