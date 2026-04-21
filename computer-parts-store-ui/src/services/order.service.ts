import { apiClient } from './api'
import type { Order, CreateOrderRequest, PaginatedResponse } from '@/types'

export const orderService = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      `/orders?page=${page}&size=${size}`
    )
    return response.data
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data
  },

  getUserOrders: async (userId: string, page = 0, size = 10): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      `/orders/user/${userId}?page=${page}&size=${size}`
    )
    return response.data
  },

  create: async (order: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', order)
    return response.data
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status })
    return response.data
  },

  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/cancel`, {})
    return response.data
  },
}
