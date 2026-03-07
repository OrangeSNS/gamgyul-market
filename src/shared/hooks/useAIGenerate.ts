import { useState } from 'react'
import { generateAIContent, type ChatMessage } from '@shared/api/ai'

interface UseAIGenerateOptions {
  /** 호출 시점에 AI에게 전달할 메시지 배열을 반환하는 함수 */
  buildMessages: () => ChatMessage[]
  /** AI 결과 문자열을 가공하는 선택적 변환 함수 */
  transform?: (result: string) => string
  /** 현재 필드 값 — 비어있지 않으면 덮어쓰기 확인 모달을 표시 */
  currentValue: string
  /** 생성된(또는 덮어쓰기 확인된) 결과를 필드에 적용하는 콜백 */
  onApply: (result: string) => void
  /** 생성 실패 시 에러 메시지를 전달하는 선택적 콜백 */
  onError?: (message: string) => void
}

interface UseAIGenerateResult {
  generate: () => Promise<void>
  isLoading: boolean
  isGenerated: boolean
  showOverwriteModal: boolean
  confirmOverwrite: () => void
  cancelOverwrite: () => void
}

/**
 * AI 콘텐츠 생성 커스텀 훅
 * @param buildMessages - 호출 시점에 메시지 배열을 반환하는 함수
 * @param transform - AI 결과를 가공하는 선택적 변환 함수
 * @param currentValue - 현재 필드 값 (비어있지 않으면 덮어쓰기 확인 모달 표시)
 * @param onApply - 생성 결과를 필드에 적용하는 콜백
 * @param onError - 생성 실패 시 에러 메시지를 전달하는 선택적 콜백
 * @returns { generate, isLoading, isGenerated, showOverwriteModal, confirmOverwrite, cancelOverwrite }
 */
export function useAIGenerate({
  buildMessages,
  transform,
  currentValue,
  onApply,
  onError,
}: UseAIGenerateOptions): UseAIGenerateResult {
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [showOverwriteModal, setShowOverwriteModal] = useState(false)
  const [pendingResult, setPendingResult] = useState('')

  const generate = async () => {
    setIsLoading(true)
    try {
      const raw = await generateAIContent(buildMessages())
      const result = transform ? transform(raw) : raw

      if (currentValue.trim() !== '') {
        setPendingResult(result)
        setShowOverwriteModal(true)
      } else {
        onApply(result)
        setIsGenerated(true)
      }
    } catch (err: unknown) {
      onError?.(err instanceof Error ? err.message : 'AI 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const confirmOverwrite = () => {
    onApply(pendingResult)
    setIsGenerated(true)
    setPendingResult('')
    setShowOverwriteModal(false)
  }

  const cancelOverwrite = () => {
    setPendingResult('')
    setShowOverwriteModal(false)
  }

  return { generate, isLoading, isGenerated, showOverwriteModal, confirmOverwrite, cancelOverwrite }
}
