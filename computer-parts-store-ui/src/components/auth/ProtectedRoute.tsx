import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import type { User } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: keyof typeof User.role
}

export const ProtectedRoute = ({ children, requiredRole = 'ADMIN' }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.roleName?.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
