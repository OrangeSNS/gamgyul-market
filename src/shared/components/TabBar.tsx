import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@app/providers/AuthProvider'

export default function TabBar() {
  const location = useLocation()
  const { user } = useAuth()

  const tabs = [
    {
      to: ROUTES.HOME,
      label: '홈',
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-brand' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: ROUTES.CHAT,
      label: '채팅',
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-brand' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      to: ROUTES.POST_NEW,
      label: '게시물',
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-brand' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path strokeLinecap="round" d="M12 8v8M8 12h8" />
        </svg>
      ),
    },
    {
      to: user ? ROUTES.PROFILE(user.accountname) : ROUTES.LOGIN,
      label: '프로필',
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${active ? 'text-brand' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive =
            tab.to === ROUTES.HOME
              ? location.pathname === ROUTES.HOME
              : tab.to === ROUTES.POST_NEW
              ? location.pathname === ROUTES.POST_NEW
              : tab.to === ROUTES.CHAT
              ? location.pathname.startsWith('/chat')
              : location.pathname.startsWith('/profile')

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="flex-1 flex flex-col items-center py-2.5 gap-0.5"
            >
              {tab.icon(isActive)}
              <span
                className={`text-[10px] ${isActive ? 'text-brand font-medium' : 'text-gray-400'}`}
              >
                {tab.label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
