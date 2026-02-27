import { useEffect } from 'react'

export interface BottomSheetItem {
  label: string
  onClick: () => void
  danger?: boolean
}

interface BottomSheetProps {
  open: boolean
  items: BottomSheetItem[]
  onClose: () => void
}

export default function BottomSheet({ open, items, onClose }: BottomSheetProps) {
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
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-t-2xl w-full max-w-mobile overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 rounded-full bg-gray-300" />
        </div>

        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              item.onClick()
              onClose()
            }}
            className={[
              'w-full py-4 text-sm font-medium text-center border-b border-gray-100 last:border-0 transition-colors',
              item.danger
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-800 hover:bg-gray-50',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
