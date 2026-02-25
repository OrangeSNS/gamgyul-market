import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@app/providers/AuthProvider'
import Spinner from '@shared/components/Spinner'
import { ROUTES } from '@shared/constants'

export default function ProtectedRoute() {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
