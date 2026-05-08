import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/auth.slice'
import { ErrorBoundary } from '@/utils/ErrorBoundary'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { ProductsPage } from '@/pages/ProductsPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminPaymentsPage } from '@/pages/admin/AdminPaymentsPage'
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage'
import { OrderSuccessPage } from '@/pages/OrderSuccessPage'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userJson = localStorage.getItem('user')
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson)
        dispatch(loginSuccess({ user, token }))
      } catch (err) {
        console.error('Failed to restore auth state:', err)
      }
    }
  }, [dispatch])

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Checkout - yêu cầu đăng nhập */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/order-success" element={<OrderSuccessPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute requiredRole="ADMIN"><AdminProductsPage /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute requiredRole="ADMIN"><AdminCategoriesPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requiredRole="ADMIN"><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute requiredRole="ADMIN"><AdminPaymentsPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="ADMIN"><AdminReportsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
