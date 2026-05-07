import { jwtDecode } from 'jwt-decode'
import { apiClient } from './api'
import type { User, AuthCredentials, RegisterData, AuthResponse } from '@/types'

// ✅ Helper: lấy message từ error của backend (plain string hoặc object)
const extractErrorMessage = (error: any): string => {
  if (error.response?.data) {
    // Backend trả về plain string
    if (typeof error.response.data === 'string' && error.response.data.length > 0) {
      return error.response.data
    }
    // Backend trả về object có message
    if (error.response.data.message) {
      return error.response.data.message
    }
  }
  return error.message || 'Có lỗi xảy ra'
}

export const authService = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<any>('/users/login', {
        identifier: credentials.userName,
        password: credentials.userPassword,
      })

      if (!response.data) {
        throw new Error('Đăng nhập thất bại')
      }

      let roleName = 'CUSTOMER'
      try {
        const decoded: any = jwtDecode(response.data.token)
        if (decoded.roles && decoded.roles.length > 0) {
          roleName = decoded.roles[0]
        }
      } catch (err) {
        console.log('Failed to decode JWT:', err)
      }

      const user: User = {
        userId: response.data.userId,
        userName: response.data.username,
        email: response.data.email,
        firstName: response.data.fullName,
        lastName: '',
        phoneNumber: response.data.phone,
        roleName: roleName,
      }

      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(user))

      return { token: response.data.token, user }
    } catch (error: any) {
      throw new Error(extractErrorMessage(error))
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<any>('/users/register', {
        username: data.userName,
        password: data.userPassword,
        fullName: (data.firstName || '') + ' ' + (data.lastName || ''),
        email: data.email,
        phone: data.phoneNumber,
        address: data.address || '',
      })

      if (!response.data) {
        throw new Error('Đăng ký thất bại')
      }

      // Auto login sau khi đăng ký thành công
      return authService.login(data)
    } catch (error: any) {
      // ✅ Lấy đúng message từ backend (plain string)
      throw new Error(extractErrorMessage(error))
    }
  },

  logout: (): void => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken')
  },

  getProfile: async (): Promise<User> => {
    const user = authService.getCurrentUser()
    if (!user || !user.userId) {
      throw new Error('No user logged in')
    }
    const response = await apiClient.get<any>(`/users/${user.userId}`)
    const data = response.data
    return {
      userId: data.id,
      userName: data.username,
      email: data.email,
      firstName: data.fullName,
      phoneNumber: data.phone,
      roleName: user.roleName,
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const user = authService.getCurrentUser()
    if (!user || !user.userId) {
      throw new Error('No user logged in')
    }
    const response = await apiClient.put<any>(`/users/${user.userId}`, {
      fullName: data.firstName,
      email: data.email,
      phone: data.phoneNumber,
    })
    if (response.data) {
      const updatedUser: User = {
        userId: response.data.id,
        userName: response.data.username,
        email: response.data.email,
        firstName: response.data.fullName,
        phoneNumber: response.data.phone,
        roleName: user.roleName,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser
    }
    throw new Error('Update profile failed')
  },
}