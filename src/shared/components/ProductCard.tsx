import { Product } from '@shared/types'
import { formatPrice } from '@shared/utils'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col text-left w-full"
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
        <img
          src={product.itemImage}
          alt={product.itemName}
          className="w-full h-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>
      <p className="text-xs text-gray-900 font-medium line-clamp-1">{product.itemName}</p>
      <p className="text-xs font-bold text-brand mt-0.5">{formatPrice(product.price)}</p>
    </button>
  )
}
