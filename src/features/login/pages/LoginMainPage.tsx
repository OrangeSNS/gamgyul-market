import { useState, ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants'
import Button from '@shared/components/Button'
import AlertModal from '@shared/components/AlertModal'

// ── 소셜 로그인 제공자 타입 선언 ──
interface SocialProvider {
  id: 'kakao' | 'google' | 'facebook'
  name: string
  borderColor: string
  icon: ReactElement
}

// ── 소셜 로그인 버튼 데이터 ──
const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    id: 'kakao',
    name: '카카오톡',
    borderColor: 'border-[#F2C94C]',
    icon: <img src="/icons/Vector-1.svg" alt="카카오톡" className="w-6 h-6 object-contain" />,
  },
  {
    id: 'google',
    name: '구글',
    borderColor: 'border-[#767676]',
    icon: <img src="/icons/Group.svg" alt="구글" className="w-6 h-6 object-contain" />,
  },
  {
    id: 'facebook',
    name: '페이스북',
    borderColor: 'border-[#2D9CDB]',
    icon: <img src="/icons/Vector.svg" alt="페이스북" className="w-6 h-6 object-contain" />,
  },
]

export default function LoginMainPage() {
  const navigate = useNavigate()

  // ── 모달 상태 ──
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [alertMsg, setAlertMsg] = useState<string>('')

  /**
   * 소셜 로그인 클릭 핸들러
   * - 현재 미구현 소셜 로그인은 모달 알림
   */
  const handleSocialLoginClick = (providerName: string) => {
    setAlertMsg(
      `현재 ${providerName} 로그인은 준비 중입니다.\n이메일 로그인을 이용해주세요.`
    )
    setIsAlertOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand">
      {/* 로고 영역 */}
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/icons/symbol-logo-W.svg" 
          alt="감귤마켓 로고" 
          className="w-[144px] h-[144px] object-contain" 
        />
      </div>

      {/* 로그인 버튼 영역 */}
      <div className="bg-white rounded-t-3xl px-[34px] pt-[50px] pb-[82px] flex flex-col">
        <div className="flex flex-col gap-[10px]">
          {SOCIAL_PROVIDERS.map((provider) => (
            <Button
              key={provider.id}
              variant="ghost"
              fullWidth
              className={`relative h-auto py-[13px] border ${provider.borderColor} font-normal text-sm !text-[#767676] rounded-[44px]`}
              onClick={() => handleSocialLoginClick(provider.name)}
            >
              {/* 아이콘 위치 */}
              <span className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                {provider.icon}
              </span>
              <span>{provider.name} 계정으로 로그인</span>
            </Button>
          ))}
        </div>

        {/* 이메일 로그인 / 회원가입 링크 */}
        <div className="flex items-center justify-center gap-3 mt-[20px] text-[12px] font-normal text-[#767676]">
          <button
            onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
            className="hover:text-gray-900 transition-colors"
          >
            이메일로 로그인
          </button>
          <span className="text-[#C4C4C4]">|</span>
          <button
            onClick={() => navigate(ROUTES.JOIN)}
            className="hover:text-gray-900 transition-colors"
          >
            회원가입
          </button>
        </div>
      </div>

      {/* 커스텀 모달 */}
      <AlertModal 
        isOpen={isAlertOpen} 
        message={alertMsg} 
        onClose={() => setIsAlertOpen(false)} 
      />
    </div>
  )
}