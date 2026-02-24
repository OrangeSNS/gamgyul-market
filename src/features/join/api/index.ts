import { request } from '@shared/api/client'
import { SignupRequest, SignupResponse } from '@shared/types'

export async function checkEmail(email: string): Promise<{ message: string }> {
  return request('/user/emailvalid', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ user: { email } }),
  })
}

export async function checkAccountName(accountname: string): Promise<{ message: string }> {
  return request('/user/accountnamevalid', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ user: { accountname } }),
  })
}

export async function signup(data: SignupRequest['user']): Promise<SignupResponse> {
  return request<SignupResponse>('/user', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ user: data } satisfies SignupRequest),
  })
}
