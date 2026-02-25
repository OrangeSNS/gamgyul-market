import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import Spinner from '@shared/components/Spinner'
import { formatPrice } from '@shared/utils'
import { uploadImage } from '@shared/api/client'
import { getProductDetail, updateProduct } from '../api'

export default function ProductEditPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [itemName, setItemName] = useState('')
  const [priceInput, setPriceInput] = useState('')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  const price = Number(priceInput.replace(/[^0-9]/g, ''))
  const isValid = imageUrl !== '' && itemName.length >= 2 && itemName.length <= 15 && price >= 1 && link !== ''

  useEffect(() => {
    if (!productId) return
    getProductDetail(productId)
      .then(({ product }) => {
        setImagePreview(product.itemImage)
        setImageUrl(product.itemImage)
        setItemName(product.itemName)
        setPriceInput(String(product.price))
        setLink(product.link)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [productId])

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

  const handleSave = async () => {
    if (!productId || !isValid || saving) return
    setSaving(true)
    try {
      await updateProduct(productId, { itemName, price, link, itemImage: imageUrl })
      navigate(-1)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="상품 수정"
        showBack
        rightSlot={
          <Button size="sm" disabled={!isValid} loading={saving} onClick={handleSave}>
            저장
          </Button>
        }
      />
      <div className="px-4 py-6 flex flex-col gap-6">
        <div>
          <p className="text-xs text-gray-500 mb-2">이미지 등록</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:border-brand transition-colors"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="상품 이미지" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm text-gray-400">이미지를 선택해주세요</span>
            )}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
        <Input label="상품명" value={itemName} onChange={(e) => setItemName(e.target.value)} maxLength={15} underline />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">가격</label>
          <input
            type="text"
            inputMode="numeric"
            value={price > 0 ? price.toLocaleString('ko-KR') : priceInput}
            onChange={(e) => setPriceInput(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full pb-2 text-sm bg-transparent border-b border-gray-300 focus:border-brand outline-none transition-colors placeholder:text-gray-400"
          />
          {price > 0 && <p className="text-xs text-brand font-medium">{formatPrice(price)}</p>}
        </div>
        <Input label="판매 링크" type="url" value={link} onChange={(e) => setLink(e.target.value)} underline />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}
