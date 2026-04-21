import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess, setError, setLoading } from '@/store/auth.slice'
import { authService } from '@/services/auth.service'
import { useState } from 'react'

export const RegisterPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (userName: string, userPassword: string, firstName: string, lastName: string, email: string, phoneNumber: string) => {
    try {
      setIsLoading(true)
      dispatch(setLoading(true))
      const response = await authService.register({ userName, userPassword, firstName, lastName, email, phoneNumber })
      dispatch(loginSuccess({ user: response.user, token: response.token }))
      navigate('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đăng ký thất bại'
      dispatch(setError(message))
      throw error
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <Layout>
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
    </Layout>
  )
}
