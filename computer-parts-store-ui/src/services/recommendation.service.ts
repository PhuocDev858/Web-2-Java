import { apiClient } from './api'
import type { Recommendation } from '@/types'

export const recommendationService = {
  getForUser: async (userId: string, limit = 10): Promise<Recommendation[]> => {
    const response = await apiClient.get<Recommendation[]>(
      `/review/user/${userId}?limit=${limit}`
    )
    return response.data
  },

  getForProduct: async (productId: string, limit = 5): Promise<Recommendation[]> => {
    const response = await apiClient.get<Recommendation[]>(
      `/review/product/${productId}?limit=${limit}`
    )
    return response.data
  },

  getTrending: async (limit = 10): Promise<Recommendation[]> => {
    const response = await apiClient.get<Recommendation[]>(`/review/trending?limit=${limit}`)
    return response.data
  },
}
