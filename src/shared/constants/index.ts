export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export const TOKEN_KEY = 'gamgyul_token'
export const USER_KEY = 'gamgyul_user'

export const ROUTES = {
  SPLASH: '/splash',
  LOGIN: '/login',
  LOGIN_EMAIL: '/login/email',
  JOIN: '/join',
  JOIN_PROFILE: '/join/profile',
  HOME: '/home',
  SEARCH: '/search',
  PROFILE: (accountName: string) => `/profile/${accountName}`,
  PROFILE_FOLLOWERS: (accountName: string) => `/profile/${accountName}/followers`,
  PROFILE_FOLLOWING: (accountName: string) => `/profile/${accountName}/following`,
  PROFILE_EDIT: '/profile/edit',
  PRODUCT_NEW: '/product/new',
  PRODUCT_EDIT: (productId: string) => `/product/${productId}/edit`,
  POST_NEW: '/post/new',
  POST_DETAIL: (postId: string) => `/post/${postId}`,
  POST_EDIT: (postId: string) => `/post/${postId}/edit`,
  POST_COMMENTS: (postId: string) => `/post/${postId}/comments`,
  CHAT: '/chat',
  CHAT_ROOM: (chatId: string) => `/chat/${chatId}`,
  NOT_FOUND: '/404',
} as const

export const ACCOUNT_NAME_REGEX = /^[a-zA-Z0-9._]+$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 공통 상단바 높이 (48px = h-12) */
export const TOPBAR_HEIGHT = 'h-12'
