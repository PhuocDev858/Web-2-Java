import { useState } from 'react'
import { Modal } from './Modal'
import type { Product } from '@/types'

interface ProductFormModalProps {
  isOpen: boolean
  product: Partial<Product> | null
  onClose: () => void
  onSubmit: (product: Partial<Product>) => Promise<void>
  isLoading?: boolean
}

export const ProductFormModal = ({
  isOpen,
  product,
  onClose,
  onSubmit,
  isLoading = false,
}: ProductFormModalProps) => {
  const [error, setError] = useState<string | null>(null)

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setError(null)
  
  try {
    const formData = new FormData(e.currentTarget)
    
    const data = {
      sku: formData.get('sku') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      brand: formData.get('brand') as string,
      categoryId: parseInt(formData.get('categoryId') as string),
      price: parseFloat(formData.get('price') as string) || 0,
      quantity: parseInt(formData.get('quantity') as string) || 0,
      specification: formData.get('specification') as string,
    }
    await onSubmit(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi khi lưu sản phẩm'
    setError(message)
  }
}

  return (
    <Modal
      isOpen={isOpen}
      title={product?.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      onClose={onClose}
      onConfirm={() => document.getElementById('productForm')?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      )}
      confirmText={product?.id ? 'Cập nhật' : 'Thêm mới'}
      isLoading={isLoading}
    >
<form id="productForm" onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
  {error && (
    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
  )}

  <fieldset disabled={isLoading} className="space-y-4">
    {/* Tên sản phẩm */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm *</label>
      <input type="text" name="name" defaultValue={product?.name || ''} required
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
        placeholder="VD: Intel Core i9-13900K" />
    </div>

    {/* Mô tả */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả *</label>
      <textarea name="description" defaultValue={product?.description || ''} required rows={2}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
        placeholder="Nhập mô tả chi tiết..." />
    </div>

    {/* Hãng và Danh mục */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Hãng *</label>
        <input type="text" name="brand" defaultValue={product?.brand || ''} required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
          placeholder="VD: Intel, AMD, NVIDIA" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục *</label>
        <select name="categoryId" defaultValue={product?.categoryId || ''} required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600">
          <option value="">-- Chọn danh mục --</option>
          <option value="2">CPU</option>
          <option value="3">GPU</option>
          <option value="4">RAM</option>
          <option value="5">SSD</option>
          <option value="6">Mainboard</option>
        </select>
      </div>
    </div>

    {/* SKU */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
      <input type="text" name="sku" defaultValue={product?.sku || ''}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
        placeholder="VD: CPU-I9-13900K" />
    </div>

    {/* Giá và Số lượng */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Giá (VNĐ) *</label>
        <input type="number" name="price" defaultValue={product?.price || ''} required step="1000"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng *</label>
        <input type="number" name="quantity" defaultValue={product?.quantity || ''} required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600" />
      </div>
    </div>

    {/* Specification */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Thông số kỹ thuật (JSON)</label>
      <textarea name="specification" defaultValue={product?.specification || ''} rows={3}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
        placeholder='VD: {"cores": 24, "threads": 32}' />
    </div>
  </fieldset>
</form>
    </Modal>
  )
}
