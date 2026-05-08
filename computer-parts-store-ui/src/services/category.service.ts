import { apiClient } from './api'

export interface Category {
  id: number
  name: string
  description?: string
  image?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CategoryRequest {
  name: string
  description?: string
  image?: string
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories')
    return Array.isArray(response.data) ? response.data : []
  },

  getById: async (id: number | string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`)
    return response.data
  },

  create: async (data: CategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data)
    return response.data
  },

  update: async (id: number | string, data: CategoryRequest): Promise<Category> => {
    const response = await apiClient.put<Category>(`/categories/${id}`, data)
    return response.data
  },

  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`)
  },
}
