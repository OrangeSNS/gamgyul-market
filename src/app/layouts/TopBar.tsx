import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { TOPBAR_HEIGHT } from '@shared/constants'

interface TopBarProps {
  title?: string
  titleAlign?: 'center' | 'left'
  showBack?: boolean
  rightSlot?: ReactNode
  transparent?: boolean
}

export default function TopBar({
  title,
  titleAlign = 'center',
  showBack = false,
  rightSlot,
  transparent = false,
}: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className={[
        `sticky top-0 z-30 flex items-center ${TOPBAR_HEIGHT} px-4`,
        transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200',
      ].join(' ')}
    >
      <div className="flex w-10 items-center justify-start">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center -ml-2"
            aria-label="뒤로가기"
          >
            <img
              src="/icons/icon-arrow-left.svg"
              alt=""
              className="h-6 w-6 object-contain"
            />
          </button>
        )}
      </div>
      {titleAlign === 'left' ? (
        <h1 className="ml-0.5 flex-1 truncate text-base font-semibold text-gray-900 text-left">
          {title}
        </h1>
      ) : (
        <div className="flex-1 text-center">
          {title ? (
            <h1 className="truncate text-base font-semibold text-gray-900">
              {title}
            </h1>
          ) : null}
        </div>
      )}
      <div className="flex items-center justify-end">
        {rightSlot}
      </div>
    </header>
  )
}