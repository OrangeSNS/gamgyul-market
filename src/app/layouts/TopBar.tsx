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
  type="button"
  onClick={() => navigate(-1)}
  className="flex h-10 w-10 items-center justify-center"
  aria-label="뒤로가기"
>
  <img
    src="/icons/icon-arrow-left.svg"
    alt=""
    className="h-6 w-6 object-contain"
  />
</button>
      )}

      <h1 className="flex-1 text-base font-semibold text-gray-900 truncate">
        {title}
      </h1>

     {rightSlot && <div>{rightSlot}</div>}
    </header>
  )
}
