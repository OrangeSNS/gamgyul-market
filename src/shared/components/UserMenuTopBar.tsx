import { useNavigate } from 'react-router-dom'
import TopBar from '@app/layouts/TopBar'
import BottomSheet from '@shared/components/BottomSheet'
import Modal from '@shared/components/Modal'
import { useBottomSheet } from '@shared/hooks/useBottomSheet'
import { useModal } from '@shared/hooks/useModal'
import { useAuth } from '@app/providers/AuthProvider'
import { ROUTES } from '@shared/constants'

interface UserMenuTopBarProps {
  title?: string
  showBack?: boolean
}

export default function UserMenuTopBar({ title, showBack }: UserMenuTopBarProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const menuSheet = useBottomSheet()
  const settingsModal = useModal()
  const logoutModal = useModal()

  return (
    <>
      <TopBar
        title={title}
        showBack={showBack}
        rightSlot={
          <button
            type="button"
            onClick={menuSheet.open}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="더보기"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        }
      />

      <BottomSheet
        open={menuSheet.isOpen}
        onClose={menuSheet.close}
        items={[
          {
            label: '설정 및 개인정보',
            onClick: settingsModal.open,
          },
          {
            label: '로그아웃',
            onClick: logoutModal.open,
            danger: true,
          },
        ]}
      />

      <Modal
        open={settingsModal.isOpen}
        message="향후 개발 준비중입니다."
        confirmLabel="확인"
        cancelLabel="취소"
        onConfirm={settingsModal.close}
        onCancel={settingsModal.close}
      />

      <Modal
        open={logoutModal.isOpen}
        message="로그아웃 하시겠어요?"
        confirmLabel="로그아웃"
        onConfirm={() => {
          logout()
          navigate(ROUTES.LOGIN, { replace: true })
        }}
        onCancel={logoutModal.close}
        destructive
      />
    </>
  )
}
