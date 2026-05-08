import { useState, useEffect } from 'react'
import { Modal } from './Modal'

export interface CategoryFormData {
  name: string
  description: string
  image: string
}

interface Category {
  id?: number | string
  name: string
  description?: string
  image?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

interface CategoryFormModalProps {
  isOpen: boolean
  category: Category | null
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void>
  isLoading?: boolean
}

export const CategoryFormModal = ({
  isOpen,
  category,
  onClose,
  onSubmit,
  isLoading = false,
}: CategoryFormModalProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image: '',
  })
  const [error, setError] = useState('')
  const [imagePreviewError, setImagePreviewError] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
      })
    } else {
      setFormData({ name: '', description: '', image: '' })
    }
    setError('')
    setImagePreviewError(false)
  }, [category, isOpen])

  const handleSubmit = async () => {
    setError('')
    if (!formData.name.trim()) {
      setError('Tên danh mục không được để trống')
      return
    }
    try {
      await onSubmit(formData)
    } catch (err: any) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.message || 'Lỗi khi lưu danh mục'
      setError(msg)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={category?.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmText={category?.id ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Tên danh mục */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tên danh mục <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isLoading}
            placeholder="VD: CPU, GPU, RAM..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-600 disabled:bg-gray-100"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={isLoading}
            placeholder="Nhập mô tả cho danh mục..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-600 resize-none disabled:bg-gray-100"
          />
        </div>

        {/* URL Hình ảnh */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">URL Hình ảnh</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => {
              setFormData({ ...formData, image: e.target.value })
              setImagePreviewError(false)
            }}
            disabled={isLoading}
            placeholder="https://example.com/image.png"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-600 disabled:bg-gray-100"
          />
          {/* Preview ảnh */}
          {formData.image && !imagePreviewError && (
            <div className="mt-2">
              <img
                src={formData.image}
                alt="preview"
                onError={() => setImagePreviewError(true)}
                className="h-20 w-20 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
          {imagePreviewError && (
            <p className="text-xs text-red-500 mt-1">URL hình ảnh không hợp lệ</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
