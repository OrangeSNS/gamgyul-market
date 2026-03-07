import { ACCOUNT_NAME_REGEX, API_BASE_URL, EMAIL_REGEX } from '@shared/constants'

/** 가격을 한국 원 단위로 포맷 */
export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원'
}

/** 날짜를 상대 시간으로 포맷 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** 이메일 유효성 검사 */
export function validateEmail(email: string): string {
  if (!email) return '이메일을 입력해주세요.'
  if (!EMAIL_REGEX.test(email)) return '잘못된 이메일 형식입니다.'
  return ''
}

/** 비밀번호 유효성 검사 */
export function validatePassword(password: string): string {
  if (!password) return '비밀번호를 입력해주세요.'
  if (password.length < 6) return '비밀번호는 6자 이상이어야 합니다.'
  return ''
}

/** 계정ID 유효성 검사 */
export function validateAccountName(accountname: string): string {
  if (!accountname) return '계정 ID를 입력해주세요.'
  if (!ACCOUNT_NAME_REGEX.test(accountname))
    return '영문, 숫자, 밑줄(_), 마침표(.)만 사용할 수 있습니다.'
  return ''
}

/** 사용자이름 유효성 검사 */
export function validateUsername(username: string): string {
  if (!username) return '사용자 이름을 입력해주세요.'
  if (username.length < 2 || username.length > 10)
    return '사용자 이름은 2~10자 사이여야 합니다.'
  return ''
}

/** 이미지 URL이 유효한지 확인 */
export function isValidImageUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

/**
 * 서버가 프로필 미설정 시 내려주는 기본 이미지 파일명 목록
 * 이 파일명이 감지되면 로컬 기본 아바타를 즉시 사용한다.
 */
const SERVER_DEFAULT_IMAGE_FILENAMES = ['1687141187512.png']

/**
 * Weniv API 이미지 URL 정규화
 * - "https://..." → 그대로 반환 (단, 서버 기본 이미지 URL이면 undefined)
 * - "filename.jpg" (파일명만) → API_BASE_URL + "/" + filename (단, 서버 기본 파일명이면 undefined)
 * - "/path" (루트 상대경로) → undefined (기본 아바타 사용)
 * - null/undefined/"undefined"/"null"/"" → undefined (기본 아바타 사용)
 */
export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url || url.trim() === '' || url === 'undefined' || url === 'null') return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (SERVER_DEFAULT_IMAGE_FILENAMES.some((name) => url.endsWith(name))) return undefined
    return url
  }
  if (url.startsWith('/')) return undefined
  if (SERVER_DEFAULT_IMAGE_FILENAMES.includes(url)) return undefined
  return `${API_BASE_URL}/${url}`
}

/** 네트워크 에러 여부 판단 */
export function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  return (
    err.message.includes('Failed to fetch') ||
    err.message.includes('Network') ||
    err.message.includes('ERR_INTERNET_DISCONNECTED')
  )
}

/** post 이미지 배열로 파싱 (콤마 구분 + URL 정규화 + 잘못된 값 필터링) */
export function parsePostImages(image: string): string[] {
  if (!image) return []
  return image
    .split(',')
    .map((url) => url.trim())
    .filter((url): boolean => {
      if (!url || url === 'undefined' || url === 'null') return false
      if (url === API_BASE_URL || url === `${API_BASE_URL}/`) return false
      if (!url.includes('.')) return false
      return true
    })
    .map((url) => resolveImageUrl(url))
    .filter((url): url is string => !!url)
}
