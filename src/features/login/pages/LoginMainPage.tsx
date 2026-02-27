import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants'
import Button from '@shared/components/Button'

const SOCIAL_PROVIDERS = [
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

  return (
    <div className="flex flex-col min-h-screen bg-brand">
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/icons/symbol-logo-W.svg" 
          alt="감귤마켓 로고" 
          className="w-[144px] h-[144px] object-contain" 
        />
      </div>

      <div className="bg-white rounded-t-3xl px-[34px] pt-[50px] pb-[82px] flex flex-col">
        <div className="flex flex-col gap-[10px]">
          {SOCIAL_PROVIDERS.map((provider) => (
            <Button
              key={provider.id}
              variant="ghost"
              fullWidth
              // h-auto로 설정하고 py-[13px]을 주어 위아래 간격 13px을 맞춤
              // border 색상은 질문하신 피그마 색상값 적용
              className={`relative h-auto py-[13px] border ${provider.borderColor} font-normal text-sm !text-[#767676] rounded-[44px]`}
              onClick={() => console.log(`${provider.id} login`)}
            >
              {/* 아이콘 위치: 좌측 여백 14px 반영 */}
              <span className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                {provider.icon}
              </span>
              <span>{provider.name} 계정으로 로그인</span>
            </Button>
          ))}
        </div>

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
    </div>
  )
}