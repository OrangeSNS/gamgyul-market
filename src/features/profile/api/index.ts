import { request, ApiError } from '@shared/api/client'
import { User, Post, Product } from '@shared/types'

export async function getProfile(accountname: string): Promise<{ profile: User }> {
  return request<{ profile: User }>(`/profile/${accountname}`)
}

export async function followUser(accountname: string): Promise<{ profile: User }> {
  return request<{ profile: User }>(`/profile/${accountname}/follow`, { method: 'POST' })
}

export async function unfollowUser(accountname: string): Promise<{ profile: User }> {
  return request<{ profile: User }>(`/profile/${accountname}/unfollow`, { method: 'DELETE' })
}

export async function getFollowers(accountname: string): Promise<User[]> {
  try {
    return await request<User[]>(`/profile/${accountname}/follower`)
  } catch (err) {
    // 팔로워가 없을 때 서버가 404를 반환 → 빈 배열로 처리
    if (err instanceof ApiError && err.status === 404) return []
    throw err
  }
}

export async function getFollowing(accountname: string): Promise<User[]> {
  try {
    return await request<User[]>(`/profile/${accountname}/following`)
  } catch (err) {
    // 팔로잉이 없을 때 서버가 404를 반환 → 빈 배열로 처리
    if (err instanceof ApiError && err.status === 404) return []
    throw err
  }
}

export async function getUserPosts(accountname: string, limit = 10, skip = 0): Promise<{ post: Post[] }> {
  return request<{ post: Post[] }>(`/post/${accountname}/userpost/?limit=${limit}&skip=${skip}`)
}

export async function getProducts(accountname: string): Promise<{ product: Product[] }> {
  return request<{ product: Product[] }>(`/product/${accountname}`)
}

export async function deleteProduct(productId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/product/${productId}`, { method: 'DELETE' })
}

export async function updateMyProfile(data: {
  username: string
  accountname: string
  intro: string
  image: string
}): Promise<{ user: User }> {
  return request<{ user: User }>('/user', {
    method: 'PUT',
    body: JSON.stringify({ user: data }),
  })
}

export async function checkAccountName(accountname: string): Promise<{ message: string }> {
  return request('/user/accountnamevalid', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ user: { accountname } }),
  })
}
