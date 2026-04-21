import { apiClient } from './api'
import type { Product, ProductFilter, PaginatedResponse } from '@/types'

export const productService = {
  getAll: async (page = 0, size = 12, filter?: ProductFilter): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())

    if (filter?.category) params.append('category', filter.category)
    if (filter?.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString())
    if (filter?.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString())
    if (filter?.search) params.append('search', filter.search)
    if (filter?.rating !== undefined) params.append('rating', filter.rating.toString())

    const response = await apiClient.get<any>(`/products?${params}`)
    
    // Handle both formats: PaginatedResponse or direct array
    if (Array.isArray(response.data)) {
      return {
        content: response.data,
        totalElements: response.data.length,
        totalPages: 1,
        currentPage: 0,
        pageSize: size,
      }
    } else if (response.data && response.data.content) {
      return response.data as PaginatedResponse<Product>
    } else {
      // Fallback if response format is unknown
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: size,
      }
    }
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  search: async (query: string, page = 0, size = 12): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`
    )
    return response.data
  },

  getByCategory: async (category: string, page = 0, size = 12): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products/category/${category}?page=${page}&size=${size}`
    )
    return response.data
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/products/categories')
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
