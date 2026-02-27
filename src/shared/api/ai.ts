export type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const AI_API_URL = 'https://dev.wenivops.co.kr/services/openai-api'

export async function generateAIContent(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(AI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  })
  if (!res.ok) throw new Error('AI 응답에 실패했습니다.')
  const data = await res.json()
  return data?.content ?? data?.message ?? ''
}
