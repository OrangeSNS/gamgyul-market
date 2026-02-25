// src/features/login/pages/LoginMainPage.tsx
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants'
import Button from '@shared/components/Button'

const SOCIAL_PROVIDERS = [
  {
    id: 'kakao',
    name: '카카오톡',
    borderColor: 'border-[#FEE500]',
    icon: <img src="/icons/Vector-1.svg" alt="카카오톡" className="w-5 h-5 object-contain" />,
  },
  {
    id: 'google',
    name: '구글',
    borderColor: 'border-gray-300',
    icon: <img src="/icons/Group.svg" alt="구글" className="w-5 h-5 object-contain" />,
  },
  {
    id: 'facebook',
    name: '페이스북',
    borderColor: 'border-[#1877F2]',
    icon: <img src="/icons/Vector.svg" alt="페이스북" className="w-5 h-5 object-contain" />,
  },
]

export default function LoginMainPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-brand">
      {/* 상단: 주황색 배경 및 로고 영역 (텍스트 없이 깔끔하게!) */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <img 
          src="/icons/symbol-logo-W.svg" 
          alt="감귤마켓 로고" 
          className="w-[144px] h-[144px] object-contain" 
        />
      </div>

      {/* 하단: 흰색 박스 (위쪽 모서리 둥글게 처리) */}
      <div className="bg-white rounded-t-3xl px-8 pt-10 pb-12 flex flex-col gap-4">
        
        {/* 배열을 순회하며 소셜 로그인 버튼 렌더링 */}
        {SOCIAL_PROVIDERS.map((provider) => (
          <Button
            key={provider.id}
            variant="ghost"
            fullWidth
            // [수정된 부분] flex gap-2를 지우고, 높이(44px)와 relative를 줬습니다.
            className={`relative h-[44px] border ${provider.borderColor} font-medium text-sm !text-gray-700`}
            onClick={() => console.log(`${provider.id} login`)}
          >
            {/* [수정된 부분] 아이콘을 버튼의 왼쪽(left-5)에 딱 고정시킵니다. */}
            <span className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {provider.icon}
            </span>
            
            {/* 글자는 버튼의 정중앙에 위치하게 됩니다. */}
            <span>{provider.name} 계정으로 로그인</span>
          </Button>
        ))}

        {/* 이메일 로그인 / 회원가입 텍스트 링크 */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm font-medium text-gray-500">
          <button
            onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
            className="hover:text-gray-800 transition-colors"
          >
            이메일로 로그인
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => navigate(ROUTES.JOIN)}
            className="hover:text-gray-800 transition-colors"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}