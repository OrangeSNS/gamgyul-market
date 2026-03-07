export type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const AI_API_URL = import.meta.env.VITE_AI_API_URL as string

/**
 * OpenAI 호환 API로 AI 콘텐츠 생성 요청
 * @param messages - system/user role 메시지 배열
 * @returns AI가 생성한 텍스트 문자열
 */
export async function generateAIContent(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(AI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  })
  if (!res.ok) throw new Error('AI 응답에 실패했습니다.')
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}
