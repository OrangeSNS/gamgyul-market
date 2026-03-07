import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@app/providers/AuthProvider'
import { useHasUnreadMessages } from '@features/chat/hooks/useHasUnreadMessages'

export default function TabBar() {
  const location = useLocation()
  const { user } = useAuth()
  const hasUnread = useHasUnreadMessages()

  const tabs = [
    {
      to: ROUTES.HOME,
      label: '홈',
      icon: (active: boolean) => (
        <img src={active ? '/icons/icon-home-fill.svg' : '/icons/icon-home.svg'} alt="" className="w-6 h-6" />
      ),
    },
    {
      to: ROUTES.CHAT,
      label: '채팅',
      icon: (active: boolean) => (
        <div className="relative w-6 h-6">
          <img src={active ? '/icons/icon-message-circle-fill.svg' : '/icons/icon-message-circle.svg'} alt="" className="w-6 h-6" />
          {hasUnread && (
            <>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
              <span className="sr-only">새 메시지 있음</span>
            </>
          )}
        </div>
      ),
    },
    {
      to: ROUTES.POST_NEW,
      label: '게시물 작성',
      icon: (active: boolean) => (
        <img src="/icons/icon-edit.svg" alt="" className="w-6 h-6" />
      ),
    },
    {
      to: user ? ROUTES.PROFILE(user.accountname) : ROUTES.LOGIN,
      label: '프로필',
      icon: (active: boolean) => (
        <img src={active ? '/icons/icon-user-fill.svg' : '/icons/icon-user.svg'} alt="" className="w-6 h-6" />
      ),
    },
  ]

  const myProfilePath = user ? ROUTES.PROFILE(user.accountname) : null
  const isOnMyProfile = myProfilePath
    ? location.pathname.startsWith(myProfilePath) ||
      location.pathname === ROUTES.PROFILE_EDIT
    : false
  const isOnOtherProfile =
    location.pathname.startsWith('/profile') && !isOnMyProfile

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-200 z-40 h-[60px]">
      <div className="flex h-full">
        {tabs.map((tab) => {
          const isActive =
            tab.to === ROUTES.HOME
              ? location.pathname === ROUTES.HOME || isOnOtherProfile
              : tab.to === ROUTES.POST_NEW
              ? location.pathname === ROUTES.POST_NEW
              : tab.to === ROUTES.CHAT
              ? location.pathname.startsWith('/chat')
              : isOnMyProfile

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
