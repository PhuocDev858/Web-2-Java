import { apiClient } from './api'

export const imageService = {
  /**
   * Upload ảnh và gắn thẳng vào sản phẩm
   */
  uploadForProduct: async (
    productId: number | string,
    file: File,
    isPrimary = false,
    displayOrder = 0
  ): Promise<{ id: number; url: string; isPrimary: boolean }> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('isPrimary', String(isPrimary))
    formData.append('displayOrder', String(displayOrder))

    const response = await apiClient.post(
      `/products/${productId}/images`,
      formData
    )
    return response.data
  },

  /**
   * Lấy danh sách ảnh của sản phẩm
   */
  getProductImages: async (productId: number | string) => {
    const response = await apiClient.get(`/products/${productId}/images`)
    return response.data
  },

  /**
   * Xoá ảnh theo ID
   */
  delete: async (imageId: number | string): Promise<void> => {
    await apiClient.delete(`/products/images/${imageId}`)
  },
}