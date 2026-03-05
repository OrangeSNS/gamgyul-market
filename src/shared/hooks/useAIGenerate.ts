import { useState } from 'react'
import { generateAIContent, type ChatMessage } from '@shared/api/ai'

interface UseAIGenerateOptions {
  buildMessages: () => ChatMessage[]
  transform?: (result: string) => string
  currentValue: string
  onApply: (result: string) => void
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
