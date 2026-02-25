import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@shared/components/Avatar'
import Button from '@shared/components/Button'
import { useAuth } from '@app/providers/AuthProvider'
import { uploadImage } from '@shared/api/client'
import { createPost } from '../api'

const MAX_IMAGES = 3

export default function PostNewPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState('')
  const [images, setImages] = useState<{ file: File; preview: string; url: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isValid = content.trim() !== '' || images.length > 0

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
          const url = await uploadImage(file)
          return { file, preview: URL.createObjectURL(file), url }
        }),
      )
      setImages((prev) => [...prev, ...newImages])
    } catch {
      setError('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      // 같은 파일 다시 선택 가능하도록 초기화
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (!isValid || submitting) return

    setSubmitting(true)
    setError('')

    try {
      const imageString = images.map((img) => img.url).join(',')
      await createPost(content, imageString)
      navigate(-1)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '게시글 작성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      {/* Top Bar (피그마 1번 화면 스타일) */}
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#EAEAEA] bg-[#F5F5F5] px-4">
        {/* 뒤로가기 아이콘 버튼 */}
<button
  onClick={() => navigate(-1)}
  className="flex items-center justify-center w-10 h-10"
  aria-label="뒤로가기"
  type="button"
>
  <img
    src="/icons/icon-arrow-left.svg"
    alt="뒤로가기"
    className="w-6 h-6 object-contain"
  />
</button>

        {/* 피그마 느낌 업로드 버튼 (Button 컴포넌트 대신 직접 스타일) */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={[
            'h-11 min-w-[116px] rounded-full px-6 text-[16px] font-semibold transition',
            'flex items-center justify-center',
            !isValid || submitting
              ? 'bg-[#F3C8AE] text-white/90'
              : 'bg-[#F28C45] text-white active:scale-[0.98]',
          ].join(' ')}
        >
          {submitting ? '업로드 중...' : '업로드'}
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 px-4 pt-6">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="pt-1">
            <Avatar src={user?.image} alt={user?.username} size="sm" />
          </div>

          {/* Text + previews */}
          <div className="flex min-w-0 flex-1 flex-col">
            <textarea
              placeholder="게시글 입력하기..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="min-h-[120px] w-full resize-none bg-transparent text-[17px] leading-7 text-[#111827] placeholder:text-[#B7BDC7] outline-none"
            />

            {/* Image previews (선택했을 때만) */}
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div
                    key={`${img.preview}-${idx}`}
                    className="relative h-[92px] w-[92px] overflow-hidden rounded-xl bg-white"
                  >
                    <img
                      src={img.preview}
                      alt={`preview-${idx}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      aria-label={`이미지 ${idx + 1} 삭제`}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="mt-3 text-xs text-red-500">
                {error}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* 하단 사진 추가 바 (이미지 있을 때만 표시해도 되고, 항상 표시도 가능) */}
      <div className="sticky bottom-0 z-20 border-t border-[#EAEAEA] bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES || uploading}
            className="flex items-center gap-2 text-[15px] font-medium text-[#F28C45] disabled:text-gray-300"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <span>
              {uploading ? '업로드 중...' : `사진 추가 (${images.length}/${MAX_IMAGES})`}
            </span>
          </button>

          {/* 첫 번째 화면의 주황 플로팅 아이콘 느낌 보조 버튼 (선택사항) */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES || uploading}
            aria-label="사진 추가"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F97316] text-white shadow-sm disabled:bg-gray-300"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
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
    </div>
  )
}