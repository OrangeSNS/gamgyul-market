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
    }
  }

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
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
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          취소
        </button>
        <Button
          size="sm"
          disabled={!isValid}
          loading={submitting}
          onClick={handleSubmit}
        >
          업로드
        </Button>
      </header>

      <div className="flex gap-3 p-4 flex-1">
        {/* Avatar */}
        <Avatar src={user?.image} alt={user?.username} size="sm" />

        {/* Content area */}
        <div className="flex-1 flex flex-col gap-3">
          <textarea
            placeholder="게시글 입력하기..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full resize-none text-sm text-gray-900 placeholder:text-gray-400 outline-none leading-relaxed"
          />

          {/* Image previews */}
          {images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img
                    src={img.preview}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="sticky bottom-16 bg-white border-t border-gray-100 px-4 py-2 flex items-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= MAX_IMAGES || uploading}
          className="flex items-center gap-1.5 text-sm text-brand disabled:text-gray-300"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {uploading ? '업로드 중...' : `사진 추가 (${images.length}/${MAX_IMAGES})`}
        </button>
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
