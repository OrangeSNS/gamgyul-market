import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@app/providers/AuthProvider'
import { ROUTES } from '@shared/constants'
import { usePageTitle } from '@shared/hooks/usePageTitle'

export default function SplashPage() {
  const navigate = useNavigate()
  const { token, isLoading } = useAuth()
  usePageTitle('')

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
    <div className="mobile-container flex items-center justify-center min-h-screen bg-white">
      <img src="/icons/full-logo.svg" alt="감귤마켓" className="w-40 h-40" />
    </div>
  )
}
