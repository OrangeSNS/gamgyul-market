import { useNavigate } from 'react-router-dom'
import Button from '@shared/components/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="mobile-container flex flex-col items-center justify-center min-h-screen px-8 text-center">
      {/* 404 Mandarin illustration */}
      <div className="relative mb-6">
        <div className="w-36 h-36 rounded-full bg-brand-50 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-28 h-28" fill="none">
            <circle cx="50" cy="54" r="32" fill="#F4A460" />
            <circle cx="50" cy="54" r="25" fill="#F26A2A" />
            <path
              d="M50 22 C50 22 42 14 34 18 C42 16 48 22 50 30 C52 22 58 16 66 18 C58 14 50 22 50 22Z"
              fill="#4CAF50"
            />
            <path d="M50 22 L50 30" stroke="#4CAF50" strokeWidth="2.5" />
            {/* Sad face */}
            <circle cx="42" cy="50" r="2.5" fill="white" />
            <circle cx="58" cy="50" r="2.5" fill="white" />
            <path
              d="M42 62 Q50 58 58 62"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* 404 text */}
            <text x="50" y="30" fontSize="14" fontWeight="bold" fill="#F26A2A" textAnchor="middle">
              404
            </text>
          </svg>
        </div>
      </div>

      <p className="text-base text-gray-600 mb-8">
        페이지를 찾을 수 없습니다. (´･ω･`)
      </p>

      <Button onClick={() => navigate(-1)} size="lg">
        이전 페이지
      </Button>
    </div>
  )
}
