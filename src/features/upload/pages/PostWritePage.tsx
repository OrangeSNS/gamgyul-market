import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Modal from '@shared/components/Modal'
import { useAuth } from '@app/providers/AuthProvider'
import { uploadImage } from '@shared/api/client'
import { useAIGenerate } from '@shared/hooks/useAIGenerate'
import { useKeyboardHeight } from '@shared/hooks/useKeyboardHeight'
import { createPost, updatePost, getPostDetail } from '../api'
import { parsePostImages } from '@shared/utils'
import ImageCarousel from '@shared/components/ImageCarousel'
import TopBar from '@app/layouts/TopBar'

const MAX_IMAGES = 3

// 이미지 객체 타입 정의
interface ImageItem {
  preview: string; // 화면에 보여줄 url (blob 혹은 서버 url)
  url: string;     // 서버에 저장할 실제 url
  file?: File;     // 새로 추가한 이미지일 경우에만 존재
}

export default function PostWritePage() {
  const { postId } = useParams<{ postId: string }>()
  const isEditMode = !!postId
  const navigate = useNavigate()
  const { user } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [content, setContent] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(isEditMode) // 수정 모드일 때만 로딩 시작
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { keyboardOffset, bottomBarH, bottomBarRef } = useKeyboardHeight()

  const {
    generate: handleAIGenerate,
    isLoading: aiLoading,
    isGenerated: aiGenerated,
    showOverwriteModal,
    confirmOverwrite,
    cancelOverwrite,
  } = useAIGenerate({
    buildMessages: () => [
      {
        role: 'system',
        content:
          '당신은 SNS 게시글 작성을 도와주는 AI입니다. 이미지를 보고 자연스러운 한국어 게시글 내용을 2~3문장으로 작성해주세요.',
      },
      {
        role: 'user',
        content: `이 이미지들을 보고 게시글 내용을 작성해주세요: ${images.map((img) => img.url).join(', ')}`,
      },
    ],
    currentValue: content,
    onApply: (result) => {
      setContent(result)
      requestAnimationFrame(() => textareaRef.current?.focus())
    },
    onError: (msg) => setError(msg),
  })

  const isValid = content.trim() !== '' || images.length > 0

  // 1. [수정 모드] 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (!isEditMode || !postId) return

    getPostDetail(postId)
      .then(({ post }) => {
        setContent(post.content)
        // 기존 이미지 문자열을 객체 배열로 변환
        const existingImages = parsePostImages(post.image).map((url) => ({
          preview: url,
          url: url,
        }))
        setImages(existingImages)
      })
      .catch(() => setError('게시글을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [postId, isEditMode])

  // 2. 이미지 추가 로직
  const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_IMAGES - images.length
    const toAdd = files.slice(0, remaining)
    if (toAdd.length === 0) return

    setUploading(true)
    setError('')

    try {
      const newImages = await Promise.all(
        toAdd.map(async (file) => {
          const url = await uploadImage(file) // 서버 업로드 후 url 획득
          return { 
            file, 
            preview: URL.createObjectURL(file), 
            url // 전송용 url
          }
        }),
      )
      setImages((prev) => [...prev, ...newImages])
    } catch {
      setError('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // 3. 이미지 삭제 로직
  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  // 4. 최종 제출 (작성 vs 수정 분기)
  const handleSubmit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    setError('')

    try {
      const imageString = images.map((img) => img.url).join(',')
      
      if (isEditMode && postId) {
        // 수정 요청 (PUT)
        await updatePost(postId, content, imageString)
      } else {
        // 새 글 작성 (POST)
        await createPost(content, imageString)
      }
      navigate(-1)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '요청에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center">로딩 중...</div>

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopBar
        title={isEditMode ? "게시물 수정" : ""}
        showBack
        rightSlot={
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className={`h-9 min-w-[92px] rounded-full px-5 text-[14px] font-semibold transition flex items-center justify-center ${
              !isValid || submitting ? 'bg-[#F3C8AE] text-white/90' : 'bg-[#F28C45] text-white'
            }`}
          >
            {submitting ? '업로드 중...' : '업로드'}
          </button>
        }
      />

      <main
        className="flex-1 px-4 pt-6"
        style={{ paddingBottom: bottomBarH + keyboardOffset + 16 }}
      >
        <div className="flex gap-3">
          <Avatar src={user?.image} alt={user?.username} size="md" />
          <div className="flex min-w-0 flex-1 flex-col">
            <textarea
              ref={textareaRef}
              placeholder="게시글 입력하기..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="min-h-[120px] w-full resize-none bg-transparent text-[17px] leading-7 text-[#111827] outline-none"
            />

            {/* ImageCarousel: 삭제 기능(onRemove)이 연결되어 있어야 함 */}
            {images.length > 0 && (
              <div className="mt-3">
                <ImageCarousel
                  images={images.map((img) => img.preview)}
                  aspectClassName="aspect-[343/228]"
                  showDots
                  onRemove={handleRemoveImage} // 삭제 함수 연결
                />
              </div>
            )}
            {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
          </div>
        </div>
      </main>

      {/* 하단 바 (사진 추가 버튼) */}
      <div
        ref={bottomBarRef}
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-mobile border-t border-[#EAEAEA] bg-white"
        style={{
          transform: `translateX(-50%) translateY(-${keyboardOffset}px)`,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-between px-4 h-[60px]">
          <div className="flex items-center gap-2 text-[15px] font-medium text-[#F28C45]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{uploading ? '업로드 중...' : `사진 추가 (${images.length}/${MAX_IMAGES})`}</span>
          </div>

          {images.length > 0 && (
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={aiLoading}
              className="text-[15px] font-medium text-brand disabled:opacity-50"
            >
              {aiLoading ? 'AI 생성 중...' : aiGenerated ? '다시 생성' : 'AI 내용 생성'}
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES || uploading}
            aria-label="사진 추가"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F97316] text-white shadow-sm disabled:bg-gray-300"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageAdd}
        />
      </div>
      <Modal
        open={showOverwriteModal}
        message="기존 입력 내용이 있습니다. 덮어쓰시겠습니까?"
        confirmLabel="덮어쓰기"
        onConfirm={confirmOverwrite}
        onCancel={cancelOverwrite}
      />
    </div>
  )
}