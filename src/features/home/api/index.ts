import { request } from '@shared/api/client'
import { Post } from '@shared/types'

export async function getFeed(limit = 10, skip = 0): Promise<{ posts: Post[] }> {
  return request<{ posts: Post[] }>(`/post/feed/?limit=${limit}&skip=${skip}`)
}
