import { request } from '@shared/api/client'
import { Post, Comment } from '@shared/types'

export async function getPostDetail(postId: string): Promise<{ post: Post }> {
  return request<{ post: Post }>(`/post/${postId}`)
}

export async function deletePost(postId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/post/${postId}`, { method: 'DELETE' })
}

export async function reportPost(postId: string): Promise<unknown> {
  return request(`/post/${postId}/report`, { method: 'POST' })
}

export async function getComments(postId: string, limit = 100, skip = 0): Promise<{ comments: Comment[] }> {
  return request<{ comments: Comment[] }>(`/post/${postId}/comments?limit=${limit}&skip=${skip}`)
}

export async function createComment(postId: string, content: string): Promise<{ comment: Comment }> {
  return request<{ comment: Comment }>(`/post/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ comment: { content } }),
  })
}

export async function deleteComment(postId: string, commentId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/post/${postId}/comments/${commentId}`, { method: 'DELETE' })
}

export async function reportComment(postId: string, commentId: string): Promise<unknown> {
  return request(`/post/${postId}/comments/${commentId}/report`, { method: 'POST' })
}

export async function postLike(postId: string): Promise<{ post: Post }> {
  return request<{ post: Post }>(`/post/${postId}/heart`, {
    method: 'POST',
  });
}

export async function deleteLike(postId: string): Promise<{ post: Post }> {
  return request<{ post: Post }>(`/post/${postId}/unheart`, {
    method: 'DELETE',
  });
}