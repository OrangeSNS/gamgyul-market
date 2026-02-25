import { request } from '@shared/api/client'
import { LoginRequest, LoginResponse } from '@shared/types'

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/user/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ user: { email, password } } satisfies LoginRequest),
  })
}
