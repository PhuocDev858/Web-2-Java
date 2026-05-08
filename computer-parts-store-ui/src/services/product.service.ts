import { apiClient } from './api'
import type { Product, ProductFilter, PaginatedResponse } from '@/types'

export const productService = {
    getAll: async (page = 0, size = 12, filter?: ProductFilter): Promise<PaginatedResponse<Product>> => {
    const params: any = { page, size }
    if (filter?.category) params.category = filter.category
    if (filter?.minPrice !== undefined) params.minPrice = filter.minPrice
    if (filter?.maxPrice !== undefined) params.maxPrice = filter.maxPrice
    if (filter?.search) params.search = filter.search

    const response = await apiClient.get<any>('/products', { params })
    const data = response.data

    if (Array.isArray(data)) {
      return { content: data, totalElements: data.length, totalPages: 1, currentPage: 0, pageSize: size }
    }

    if (data?.content) {
      return {
        content: data.content,
        totalElements: data.totalElements ?? 0,
        totalPages: data.totalPages ?? 1,
        // ✅ Spring dùng "number" cho page hiện tại, "size" cho page size
        currentPage: data.number ?? data.currentPage ?? 0,
        pageSize: data.size ?? data.pageSize ?? size,
      }
    }

    return { content: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: size }
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  search: async (query: string, page = 0, size = 12): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/search?name=${encodeURIComponent(query)}&page=${page}&size=${size}`
    )
    return response.data
  },

  getByCategory: async (categoryId: string, page = 0, size = 12): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/category/${categoryId}?page=${page}&size=${size}`
    )
    return response.data
  },

  getCategories: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/categories')
    return response.data
  },

  // Admin endpoints
  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', product)
    return response.data
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, product)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },
}
