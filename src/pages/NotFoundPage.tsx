import { useNavigate } from 'react-router-dom'
import Button from '@shared/components/Button'
import { usePageTitle } from '@shared/hooks/usePageTitle'

export default function NotFoundPage() {
  const navigate = useNavigate()
  usePageTitle('페이지를 찾을 수 없습니다')

  return (
    <main className="mobile-container flex flex-col items-center min-h-screen bg-white">
      {/* 고정된 상단 여백을 위해 justify-center 대신 pt 사용 */}
      <div className="flex flex-col items-center pt-[200px] px-4">
        
        <img
          src="/icons/icon-404.svg"
          alt="404 에러 아이콘"
          className="w-[158px] h-[158px] object-contain"
        />

        <p className="mt-[30px] text-sm text-[#767676] text-center leading-relaxed">
          페이지를 찾을 수 없습니다. :(
        </p>

        <div className="mt-5">
          <Button
            size="lg"
            className="w-[120px] h-[44px] px-0 whitespace-nowrap text-sm"
            onClick={() => navigate(-1)}
          >
            이전 페이지
          </Button>
        </div>
      </div>
    </main>
  )
}