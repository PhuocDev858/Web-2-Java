import { apiClient } from './api'
import type { Order, CreateOrderRequest, PaginatedResponse } from '@/types'

export const orderService = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<any>(`/orders?page=${page}&size=${size}`)
    const data = response.data
    if (data?.content) {
      return {
        content: data.content,
        totalElements: data.totalElements ?? 0,
        totalPages: data.totalPages ?? 1,
        currentPage: data.number ?? 0,
        pageSize: data.size ?? size,
      }
    }
    return { content: Array.isArray(data) ? data : [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: size }
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data
  },

  getUserOrders: async (userId: string, page = 0, size = 10): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<any>(`/orders/user/${userId}?page=${page}&size=${size}`)
    const data = response.data
    if (data?.content) {
      return {
        content: data.content,
        totalElements: data.totalElements ?? 0,
        totalPages: data.totalPages ?? 1,
        currentPage: data.number ?? 0,
        pageSize: data.size ?? size,
      }
    }
    return { content: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize: size }
  },

  create: async (order: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders/create', order)
    return response.data
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    // ✅ Đổi patch → put, và dùng query param đúng như backend yêu cầu
    const response = await apiClient.put<Order>(`/orders/${id}/status?status=${status}`)
    return response.data
  },

  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}/status?status=CANCELLED`)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`)
  },
}