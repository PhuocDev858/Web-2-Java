import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string  // 'ADMIN' | 'CUSTOMER' | undefined (chỉ cần login)
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Nếu có yêu cầu role cụ thể, kiểm tra
  if (requiredRole && user?.roleName?.toUpperCase() !== requiredRole.toUpperCase()) {
    // ADMIN vẫn có thể vào trang CUSTOMER
    if (requiredRole === 'CUSTOMER' && user?.roleName?.toUpperCase() === 'ADMIN') {
      return <>{children}</>
    }
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}