export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export const TOKEN_KEY = 'gamgyul_token'
export const USER_KEY = 'gamgyul_user'

// API 요청 헤더 관련 상수
export const CONTENT_TYPE_JSON = 'application/json'
export const AUTH_HEADER_PREFIX = 'Bearer'

// API 엔드포인트 경로 상수
export const API_PATHS = {
  LOGIN: '/user/login',
  IMAGE_UPLOAD: '/image/uploadfile',
} as const

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

export const TOPBAR_HEIGHT = 'h-12'
