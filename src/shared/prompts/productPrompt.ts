import type { ChatMessage } from '@shared/api/ai'

/**
 * 중고거래 상품명 AI 생성 프롬프트 빌더
 * @param imageUrl - 업로드된 상품 이미지 URL
 * @returns OpenAI 호환 메시지 배열 (system + user role)
 */
export function buildProductPrompt(imageUrl: string): ChatMessage[] {
  return [
    {
      role: 'system',
      content:
        '당신은 중고거래 플랫폼의 상품 등록을 도와주는 AI입니다. 이미지 URL을 보고 상품명을 한국어로 2~15자 이내로 생성해주세요.',
    },
    {
      role: 'user',
      content: `이 이미지의 상품명을 생성해주세요: ${imageUrl}`,
    },
  ]
}
