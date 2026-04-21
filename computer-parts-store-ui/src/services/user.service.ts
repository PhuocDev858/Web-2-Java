import { apiClient } from './api'
import type { User } from '@/types'

export const userService = {
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`)
    return response.data
  },

  getAll: async (page = 0, size = 10): Promise<{
    content: User[]
    totalElements: number
    totalPages: number
    currentPage: number
  }> => {
    const response = await apiClient.get(`/users?page=${page}&size=${size}`)
    return response.data
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/users/change-password', { oldPassword, newPassword })
  },
}
