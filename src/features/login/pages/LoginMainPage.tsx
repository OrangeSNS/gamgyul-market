import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants'
import Button from '@shared/components/Button'

const SOCIAL_PROVIDERS = [
  {
    id: 'kakao',
    name: '카카오톡',
    borderColor: 'border-[#FEE500]',
    icon: <img src="/icons/Vector-1.svg" alt="카카오톡" className="w-6 h-6 object-contain" />,
  },
  {
    id: 'google',
    name: '구글',
    borderColor: 'border-gray-300',
    icon: <img src="/icons/Group.svg" alt="구글" className="w-6 h-6 object-contain" />,
  },
  {
    id: 'facebook',
    name: '페이스북',
    borderColor: 'border-[#1877F2]',
    icon: <img src="/icons/Vector.svg" alt="페이스북" className="w-6 h-6 object-contain" />,
  },
]

export default function LoginMainPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-brand">
      {/* 상단: 주황색 배경 및 로고 영역 */}
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/icons/symbol-logo-W.svg" 
          alt="감귤마켓 로고" 
          className="w-[144px] h-[144px] object-contain" 
        />
      </div>

      {/* 하단: 흰색 박스 (피그마 간격 반영) */}
      <div className="bg-white rounded-t-3xl px-[34px] pt-[50px] pb-[82px] flex flex-col">
        
        {/* 버튼들 사이 간격 10px 반영 */}
        <div className="flex flex-col gap-[10px]">
          {SOCIAL_PROVIDERS.map((provider) => (
            <Button
              key={provider.id}
              variant="ghost"
              fullWidth
              // h-[44px]와 font-normal(Regular 400), text-sm(14px) 반영
              className={`relative h-[44px] border ${provider.borderColor} font-normal text-sm !text-[#767676]`}
              onClick={() => console.log(`${provider.id} login`)}
            >
              {/* 아이콘 위치: 좌측 여백 반영 */}
              <span className="absolute left-[14px] top-1/2 -translate-y-1/2">
                {provider.icon}
              </span>
              <span>{provider.name} 계정으로 로그인</span>
            </Button>
          ))}
        </div>

        {/* 하단 링크 영역: 버튼 박스 하단으로부터 20px 여백 및 글자 12px 반영 */}
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