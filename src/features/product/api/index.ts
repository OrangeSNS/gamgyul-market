import { request } from '@shared/api/client'
import { Product } from '@shared/types'

export interface ProductInput {
  itemName: string
  price: number
  link: string
  itemImage: string
}

export async function createProduct(data: ProductInput): Promise<{ product: Product }> {
  return request<{ product: Product }>('/product', {
    method: 'POST',
    body: JSON.stringify({ product: data }),
  })
}

export async function getProductDetail(productId: string): Promise<{ product: Product }> {
  return request<{ product: Product }>(`/product/detail/${productId}`)
}

export async function updateProduct(
  productId: string,
  data: ProductInput,
): Promise<{ product: Product }> {
  return request<{ product: Product }>(`/product/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ product: data }),
  })
}
