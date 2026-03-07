import type { ChatMessage } from '@shared/api/ai'

/**
 * SNS 게시글 AI 생성 프롬프트 빌더
 * @param imageUrls - 업로드된 이미지 URL 배열
 * @returns OpenAI 호환 메시지 배열 (system + user role)
 */
export function buildPostPrompt(imageUrls: string[]): ChatMessage[] {
  return [
    {
      role: 'system',
      content:
        '당신은 SNS 게시글 작성을 도와주는 AI입니다. 이미지를 보고 자연스러운 한국어 게시글 내용을 2~3문장으로 작성해주세요.',
    },
    {
      role: 'user',
      content: `이 이미지들을 보고 게시글 내용을 작성해주세요: ${imageUrls.join(', ')}`,
    },
  ]
}
