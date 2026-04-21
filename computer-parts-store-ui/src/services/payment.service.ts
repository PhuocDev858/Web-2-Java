import { apiClient } from './api'
import type { Payment, PaymentRequest } from '@/types'

export const paymentService = {
  create: async (paymentRequest: PaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/payments', paymentRequest)
    return response.data
  },

  getById: async (id: string): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/payments/${id}`)
    return response.data
  },

  verify: async (transactionId: string): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/payments/verify/${transactionId}`)
    return response.data
  },

  getOrderPayments: async (orderId: string): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/order/${orderId}`)
    return response.data
  },

  refund: async (id: string): Promise<Payment> => {
    const response = await apiClient.post<Payment>(`/payments/${id}/refund`, {})
    return response.data
  },
}
