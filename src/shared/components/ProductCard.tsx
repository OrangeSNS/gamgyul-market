import { useState } from 'react'
import { Product } from '@shared/types'
import { formatPrice, resolveImageUrl } from '@shared/utils'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      onClick={onClick}
      className="flex flex-col text-left w-full"
    >
      <div className="w-full h-[90px] rounded-xl overflow-hidden bg-gray-100 mb-2">
        {imgError ? (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <span className="text-[10px] text-gray-400 text-center px-1">상품 이미지를 불러올 수 없습니다</span>
          </div>
        ) : (
          <img
            src={resolveImageUrl(product.itemImage)}
            alt={product.itemName}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <p className="text-xs text-gray-900 font-medium line-clamp-1">{product.itemName}</p>
      <p className="text-xs font-bold text-brand mt-0.5">{formatPrice(product.price)}</p>
    </button>
  )
}
