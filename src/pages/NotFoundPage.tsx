import { useNavigate } from 'react-router-dom'
import Button from '@shared/components/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="mobile-container flex flex-col items-center min-h-screen bg-white">
      {/* 1. 상단 여백: 200px */}
      <div className="pt-[200px] flex flex-col items-center">
        
        {/* 2. 404 이미지: 158x158 */}
        <img 
          src="/icons/icon-404.svg" 
          alt="404 페이지를 찾을 수 없습니다" 
          className="w-[158px] h-[158px] object-contain" 
        />

        {/* 3. 이미지와 글자 간격: 30px */}
        <p className="mt-[30px] text-[14px] leading-[14px] text-[#767676] font-normal text-center">
          페이지를 찾을 수 없습니다. :(
        </p>

        {/* 4. 글자와 버튼 간격: 20px */}
        <div className="mt-[20px]">
          <Button 
            onClick={() => navigate(-1)} 
            size="lg"
            // 너비 120px 유지하며 글자 짤림 방지 (px-0 추가)
            className="w-[120px] h-[44px] px-0 whitespace-nowrap text-[14px]"
          >
            이전 페이지
          </Button>
        </div>
        
      </div>
    </div>
  )
}