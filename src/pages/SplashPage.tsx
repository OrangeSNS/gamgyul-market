import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@app/providers/AuthProvider'
import { ROUTES } from '@shared/constants'

export default function SplashPage() {
  const navigate = useNavigate()
  const { token, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    const timer = setTimeout(() => {
      if (token) {
        navigate(ROUTES.HOME, { replace: true })
      } else {
        navigate(ROUTES.LOGIN, { replace: true })
      }
    }, 1800)

    return () => clearTimeout(timer)
  }, [token, isLoading, navigate])

  return (
    <div className="mobile-container flex flex-col items-center justify-center min-h-screen bg-brand">
      {/* Mandarin Logo */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Mandarin circle */}
          <div className="w-28 h-28 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
              {/* Mandarin fruit */}
              <circle cx="40" cy="44" r="28" fill="#F4A460" />
              <circle cx="40" cy="44" r="22" fill="#F26A2A" />
              {/* Leaf */}
              <path
                d="M40 16 C40 16 32 8 24 12 C32 10 38 16 40 24 C42 16 48 10 56 12 C48 8 40 16 40 16Z"
                fill="#4CAF50"
              />
              <path d="M40 16 L40 24" stroke="#4CAF50" strokeWidth="2" />
              {/* Face */}
              <circle cx="33" cy="42" r="2.5" fill="white" />
              <circle cx="47" cy="42" r="2.5" fill="white" />
              <path
                d="M34 50 Q40 55 46 50"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Chat bubble */}
              <path
                d="M50 30 L62 30 Q66 30 66 34 L66 44 Q66 48 62 48 L56 48 L52 52 L52 48 L50 48 Q46 48 46 44 L46 34 Q46 30 50 30Z"
                fill="white"
                opacity="0.9"
              />
              <circle cx="53" cy="39" r="1.5" fill="#F26A2A" />
              <circle cx="58" cy="39" r="1.5" fill="#F26A2A" />
              <circle cx="63" cy="39" r="1.5" fill="#F26A2A" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white tracking-tight">감귤마켓</h1>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-20 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
