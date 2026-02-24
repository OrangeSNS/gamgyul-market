import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}

export default function Modal({
  open,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  destructive = false,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl w-[280px] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 text-center">
          <p className="text-sm font-medium text-gray-800 whitespace-pre-line">{message}</p>
        </div>
        <div className="flex border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <div className="w-px bg-gray-200" />
          <button
            onClick={onConfirm}
            className={[
              'flex-1 py-3 text-sm font-semibold transition-colors',
              destructive
                ? 'text-red-500 hover:bg-red-50'
                : 'text-brand hover:bg-brand-50',
            ].join(' ')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
