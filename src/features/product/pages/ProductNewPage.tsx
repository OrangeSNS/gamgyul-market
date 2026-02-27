import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import Modal from '@shared/components/Modal'
import { ROUTES } from '@shared/constants'
import { uploadImage } from '@shared/api/client'
import { generateAIContent, type ChatMessage } from '@shared/api/ai'
import { createProduct } from '../api'

export default function ProductNewPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [itemName, setItemName] = useState('')
  const [priceInput, setPriceInput] = useState('')
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiGenerated, setAiGenerated] = useState(false)
  const [showOverwriteModal, setShowOverwriteModal] = useState(false)
  const [pendingAiResult, setPendingAiResult] = useState<{ name: string } | null>(null)

  const price = Number(priceInput.replace(/[^0-9]/g, ''))

  const isValid =
    imageUrl !== '' &&
    itemName.length >= 2 &&
    itemName.length <= 15 &&
    price >= 1 &&
    link !== ''

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    try {
      const url = await uploadImage(file)
      setImageUrl(url)
    } catch {
      setError('이미지 업로드에 실패했습니다.')
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setPriceInput(raw)
  }

  const handleAIGenerate = async () => {
    if (!imageUrl) {
      setError('이미지를 먼저 업로드해 주세요.')
      return
    }
    setAiLoading(true)
    setError('')
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: '당신은 중고거래 플랫폼의 상품 등록을 도와주는 AI입니다. 이미지 URL을 보고 상품명을 한국어로 2~15자 이내로 생성해주세요.',
        },
        {
          role: 'user',
          content: `이 이미지의 상품명을 생성해주세요: ${imageUrl}`,
        },
      ]
      const result = await generateAIContent(messages)
      const trimmed = result.trim().slice(0, 15)
      if (itemName !== '') {
        setPendingAiResult({ name: trimmed })
        setShowOverwriteModal(true)
      } else {
        setItemName(trimmed)
        setAiGenerated(true)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'AI 생성에 실패했습니다.')
    } finally {
      setAiLoading(false)
    }
  }

  const applyAIResult = () => {
    if (pendingAiResult) {
      setItemName(pendingAiResult.name)
      setAiGenerated(true)
    }
    setPendingAiResult(null)
    setShowOverwriteModal(false)
  }

  const handleSubmit = async () => {
    if (!isValid || loading) return
    setLoading(true)
    try {
      await createProduct({ itemName, price, link, itemImage: imageUrl })
      navigate(-1)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '상품 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="상품 등록"
        showBack
        rightSlot={
          <Button size="sm" disabled={!isValid} loading={loading} onClick={handleSubmit}>
            저장
          </Button>
        }
      />

      <div className="px-4 py-6 flex flex-col gap-6">
        {/* Image upload */}
        <div>
          <p className="text-xs text-gray-500 mb-2">이미지 등록</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-48 rounded-xl bg-gray-100 overflow-hidden"
          >
            {imagePreview && (
              <img src={imagePreview} alt="상품 이미지" className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gray-400/70 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {imageUrl && (
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={aiLoading}
              className="mt-2 w-full rounded-lg border border-brand py-2 text-sm font-medium text-brand disabled:opacity-50"
            >
              {aiLoading ? '생성 중...' : aiGenerated ? '다시 생성' : 'AI 상품 설명 생성'}
            </button>
          )}
        </div>

        {/* Fields */}
        <Input
          label="상품명"
          placeholder="2~15자 이내여야 합니다."
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          maxLength={15}
          underline
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">가격</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="숫자만 입력 가능합니다."
            value={price > 0 ? price.toLocaleString('ko-KR') : priceInput}
            onChange={handlePriceChange}
            className="w-full pb-2 text-sm bg-transparent border-b border-gray-300 focus:border-brand outline-none transition-colors placeholder:text-gray-400"
          />
        </div>

        <Input
          label="판매 링크"
          type="url"
          placeholder="URL을 입력해 주세요."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          underline
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <Modal
        open={showOverwriteModal}
        message="기존 입력 내용이 있습니다. 덮어쓰시겠습니까?"
        confirmLabel="덮어쓰기"
        onConfirm={applyAIResult}
        onCancel={() => setShowOverwriteModal(false)}
      />
    </div>
  )
}
