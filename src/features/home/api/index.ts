import { request } from '@shared/api/client'
import { Post } from '@shared/types'

// 최신 서버 주소
const BASE_URL = 'https://dev.wenivops.co.kr/services/mandarin';

// 1. 팀원들의 기존 코드
export async function getFeed(limit = 10, skip = 0): Promise<{ posts: Post[] }> {
  return request<{ posts: Post[] }>(`/post/feed/?limit=${limit}&skip=${skip}`)
}

// 2. 우리가 만든 로그인/검색 코드
export const getTestToken = async () => {
  try {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ user: { email: "sample@sample.com", password: "123456" } })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token); // 금고에 저장
      return data.token;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const searchUser = async (keyword: string, token: string) => {
  if (!keyword.trim()) return [];
  const res = await fetch(`${BASE_URL}/user/searchuser/?keyword=${keyword}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-type": "application/json"
    }
  });
  return await res.json();
};