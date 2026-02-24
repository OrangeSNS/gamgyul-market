import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface TopBarProps {
  title?: string
  showBack?: boolean
  rightSlot?: ReactNode
  transparent?: boolean
}

export default function TopBar({
  title,
  showBack = false,
  rightSlot,
  transparent = false,
}: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className={[
        'sticky top-0 z-30 flex items-center h-14 px-4',
        transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200',
      ].join(' ')}
    >
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="mr-2 p-1 -ml-1 rounded-full hover:bg-gray-100"
          aria-label="뒤로가기"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <h1 className="flex-1 text-base font-semibold text-gray-900 truncate">
        {title}
      </h1>

      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </header>
  )
}
