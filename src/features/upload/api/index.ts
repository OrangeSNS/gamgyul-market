import { request } from '@shared/api/client'
import { Post } from '@shared/types'

export async function createPost(content: string, image = ''): Promise<{ post: Post[] }> {
  return request<{ post: Post[] }>('/post', {
    method: 'POST',
    body: JSON.stringify({ post: { content, image } }),
  })
}

export async function updatePost(
  postId: string,
  content: string,
  image = '',
): Promise<{ post: Post }> {
  return request<{ post: Post }>(`/post/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({ post: { content, image } }),
  })
}
