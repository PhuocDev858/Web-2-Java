import { jwtDecode } from 'jwt-decode'
import { apiClient } from './api'
import type { User, AuthCredentials, RegisterData, AuthResponse } from '@/types'

export const authService = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<any>('/users/login', {
        identifier: credentials.userName,
        password: credentials.userPassword,
      })
      
      // Handle response
      if (!response.data) {
        throw new Error('Đăng nhập thất bại')
      }
      
      console.log('Login raw response:', response.data)
      
      // Decode JWT to get roles
      let roleName = 'CUSTOMER'
      try {
        const decoded: any = jwtDecode(response.data.token)
        console.log('Decoded JWT:', decoded)
        if (decoded.roles && decoded.roles.length > 0) {
          roleName = decoded.roles[0]
          console.log('Extracted role from JWT:', roleName)
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
      
      return {
        token: response.data.token,
        user: user
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<any>('/users/register', {
        username: data.userName,
        password: data.userPassword,
        fullName: data.firstName + ' ' + data.lastName,
        email: data.email,
        phone: data.phoneNumber,
      })
      
      if (!response.data) {
        throw new Error('Đăng ký thất bại')
      }
      
      // After register, auto login
      return authService.login(data)
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw error
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
    const response = await apiClient.get<any>('/accounts/profile')
    const data = response.data
    return {
      userId: data.userId,
      userName: data.userName,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      roleName: data.roleName,
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<any>('/accounts/profile', data)
    if (response.data) {
      const user: User = {
        userId: response.data.userId,
        userName: response.data.userName,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber,
        roleName: response.data.roleName,
      }
      localStorage.setItem('user', JSON.stringify(user))
      return user
    }
    throw new Error('Update profile failed')
  },
}
