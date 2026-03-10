import {
  API_BASE_URL,
  TOKEN_KEY,
  CONTENT_TYPE_JSON,
  AUTH_HEADER_PREFIX,
  API_PATHS,
  ROUTES,
} from '@shared/constants'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function buildHeaders(options?: {
  auth?: boolean
  isFormData?: boolean
}): HeadersInit {
  const headers: Record<string, string> = {}

  if (!options?.isFormData) {
    headers['Content-type'] = CONTENT_TYPE_JSON
  }

  if (options?.auth !== false) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `${AUTH_HEADER_PREFIX} ${token}`
    }
  }

  return headers
}

export async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean; isFormData?: boolean } = {},
): Promise<T> {
  const { auth, isFormData, ...fetchOptions } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...buildHeaders({ auth, isFormData }),
      ...fetchOptions.headers,
    },
  })

  if (response.status === 401 && path !== API_PATHS.LOGIN) {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = ROUTES.LOGIN
    throw new ApiError(401, '인증이 만료되었습니다. 다시 로그인해주세요.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message ?? `오류가 발생했습니다. (${response.status})`,
    )
  }

  return data as T
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${API_BASE_URL}${API_PATHS.IMAGE_UPLOAD}`, {
    method: 'POST',
    headers: buildHeaders({ isFormData: true }),
    body: formData,
  })

  if (!res.ok) {
    throw new ApiError(res.status, '이미지 업로드에 실패했습니다.')
  }

  const data = await res.json()
  // 서버가 반환하는 filename으로 전체 URL 구성
  return `${API_BASE_URL}/${data.info.filename}`
}
