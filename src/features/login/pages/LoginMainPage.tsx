import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants'

export default function LoginMainPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top half - orange background with logo */}
      <div className="flex-1 bg-brand flex flex-col items-center justify-center min-h-[55vh]">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
            <svg viewBox="0 0 80 80" className="w-18 h-18" fill="none">
              <circle cx="40" cy="44" r="28" fill="#F4A460" />
              <circle cx="40" cy="44" r="22" fill="#F26A2A" />
              <path
                d="M40 16 C40 16 32 8 24 12 C32 10 38 16 40 24 C42 16 48 10 56 12 C48 8 40 16 40 16Z"
                fill="#4CAF50"
              />
              <path d="M40 16 L40 24" stroke="#4CAF50" strokeWidth="2" />
              <circle cx="33" cy="42" r="2.5" fill="white" />
              <circle cx="47" cy="42" r="2.5" fill="white" />
              <path d="M34 50 Q40 55 46 50" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M50 30 L62 30 Q66 30 66 34 L66 44 Q66 48 62 48 L56 48 L52 52 L52 48 L50 48 Q46 48 46 44 L46 34 Q46 30 50 30Z" fill="white" opacity="0.9" />
              <circle cx="53" cy="39" r="1.5" fill="#F26A2A" />
              <circle cx="58" cy="39" r="1.5" fill="#F26A2A" />
              <circle cx="63" cy="39" r="1.5" fill="#F26A2A" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">감귤마켓</h1>
        </div>
      </div>

      {/* Bottom half - white, login buttons */}
      <div className="bg-white px-8 pt-8 pb-12 flex flex-col gap-3">
        {/* Email login button */}
        <button
          onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
          className="w-full py-3.5 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          이메일로 로그인하기
        </button>

        {/* Google */}
        <button className="w-full py-3.5 rounded-full border border-gray-300 text-sm text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          구글 계정으로 로그인
        </button>

        {/* Facebook */}
        <button className="w-full py-3.5 rounded-full border border-gray-300 text-sm text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          페이스북 계정으로 로그인
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-500 mt-2">
          아직 계정이 없으신가요?{' '}
          <button
            onClick={() => navigate(ROUTES.JOIN)}
            className="text-brand font-semibold underline underline-offset-2"
          >
            이메일로 회원가입
          </button>
        </p>
      </div>
    </div>
  )
}
