import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess, setError, setLoading } from '@/store/auth.slice'
import { authService } from '@/services/auth.service'
import { useState } from 'react'

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (userName: string, userPassword: string) => {
    try {
      setIsLoading(true)
      dispatch(setLoading(true))
      const response = await authService.login({ userName, userPassword })
      dispatch(loginSuccess({ user: response.user, token: response.token }))
      
      console.log('Login response:', response)
      console.log('User role:', response.user.roleName)
      
      // Redirect to admin page if user is admin (case-insensitive)
      if (response.user.roleName?.toUpperCase() === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      dispatch(setError(message))
      throw error
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <Layout>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </Layout>
  )
}
