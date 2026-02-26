// ─── Auth ──────────────────────────────────────────────────
export interface LoginRequest {
  user: { email: string; password: string }
}

export interface LoginResponse {
  // 성공 시 데이터 (성공할 때만 있으므로 ?를 붙여줍니다)
  _id?: string
  username?: string
  email?: string
  accountname?: string
  intro?: string
  image?: string
  refreshToken?: string
  token?: string

  // 실패 시 데이터 (명세서 2.2 반영)
  message?: string 
  status?: number
}

export interface SignupRequest {
  user: {
    username: string
    email: string
    password: string
    accountname: string
    intro?: string
    image?: string
  }
}

export interface SignupResponse {
  message: string
  user: Pick<User, '_id' | 'accountname' | 'email' | 'image' | 'intro' | 'username'>
}

// ─── User / Profile ────────────────────────────────────────
export interface User {
  _id: string
  username: string
  accountname: string
  email?: string
  intro: string
  image: string
  isfollow?: boolean
  following?: User[]
  follower?: User[]
  followerCount: number
  followingCount: number
}

// ─── Post ──────────────────────────────────────────────────
export interface Post {
  id: string
  content: string
  image: string
  createdAt: string
  updatedAt: string
  hearted: boolean
  heartCount: number
  comments?: Comment[]
  commentCount: number
  author: Pick<User, '_id' | 'username' | 'accountname' | 'intro' | 'image'>
}

// ─── Comment ───────────────────────────────────────────────
export interface Comment {
  id: string
  content: string
  createdAt: string
  author: Pick<User, '_id' | 'username' | 'accountname' | 'intro' | 'image'> & { isfollow?: boolean }
}

// ─── Product ───────────────────────────────────────────────
export interface Product {
  id: string
  itemName: string
  price: number
  link: string
  itemImage: string
  createdAt: string
  updatedAt: string
  author: Pick<User, '_id' | 'username' | 'accountname' | 'intro' | 'image'>
}

// ─── Image Upload ──────────────────────────────────────────
export interface ImageUploadResponse {
  message: string
  info: {
    filename: string
    path: string
    originalname: string
    size: number
  }
}

// ─── API Error ─────────────────────────────────────────────
export interface ApiError {
  message: string
  status?: number
  error?: string
  statusCode?: number
}
