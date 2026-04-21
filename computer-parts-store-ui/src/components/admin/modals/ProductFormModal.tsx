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
      const categoryId = formData.get('categoryId') as string
      
      // Send to API
      const data = {
        productName: formData.get('productName') as string,
        description: formData.get('description') as string,
        categoryId: categoryId ? parseInt(categoryId) : null,
        price: parseFloat(formData.get('price') as string) || 0,
        stock: parseInt(formData.get('stock') as string) || 0,
        brand: formData.get('brand') as string,
        warranty: formData.get('warranty') as string,
        compatibility: formData.get('compatibility') as string,
        powerConsumption: formData.get('powerConsumption') as string,
        sku: formData.get('sku') as string,
        featuredImage: formData.get('featuredImage') as string,
        specsDimensions: formData.get('specsDimensions') as string,
        weightKg: parseFloat(formData.get('weightKg') as string) || 0,
        isFeatured: (formData.get('isFeatured') as string) === 'on',
        isBestseller: (formData.get('isBestseller') as string) === 'on',
        discountPercentage: parseInt(formData.get('discountPercentage') as string) || 0,
      }
      await onSubmit(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi lưu sản phẩm'
      setError(message)
      console.error('Failed to save product:', err)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={product?.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      onClose={onClose}
      onConfirm={() => document.getElementById('productForm')?.dispatchEvent(new Event('submit'))}
      confirmText={product?.id ? 'Cập nhật' : 'Thêm mới'}
      isLoading={isLoading}
    >
      <form id="productForm" onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <fieldset disabled={isLoading} className="space-y-4">
        {/* Tên sản phẩm */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm *</label>
          <input
            type="text"
            name="productName"
            defaultValue={product?.productName || product?.name || ''}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
            placeholder="VD: Intel Core i9-13900K"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả sản phẩm *</label>
          <textarea
            name="description"
            defaultValue={product?.description || ''}
            required
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
            placeholder="Nhập mô tả chi tiết..."
          />
        </div>

        {/* Hãng và Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hãng *</label>
            <input
              type="text"
              name="brand"
              defaultValue={product?.brand || 'Unknown'}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="VD: Intel, AMD, NVIDIA"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục *</label>
            <select
              name="categoryId"
              defaultValue={typeof product?.category === 'object' ? product.category.id || 2 : 2}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
            >
              <option value="">-- Chọn danh mục --</option>
              <option value="2">CPU</option>
              <option value="3">GPU</option>
              <option value="4">RAM</option>
              <option value="5">SSD</option>
              <option value="6">Mainboard</option>
            </select>
          </div>
        </div>

        {/* SKU và Warranty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              defaultValue={product?.sku || ''}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="VD: CPU-I9-13900K"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bảo hành</label>
            <input
              type="text"
              name="warranty"
              defaultValue={product?.warranty || ''}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="VD: 24 tháng, Lifetime"
            />
          </div>
        </div>

        {/* Tương thích và Power Consumption */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tương thích</label>
            <input
              type="text"
              name="compatibility"
              defaultValue={product?.compatibility || ''}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="VD: LGA1700, AM5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu thụ năng lượng</label>
            <input
              type="text"
              name="powerConsumption"
              defaultValue={product?.powerConsumption || ''}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="VD: 65W, 150W"
            />
          </div>
        </div>

        {/* Giá và Tồn kho */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Giá (VNĐ) *</label>
            <input
              type="number"
              name="price"
              defaultValue={product?.price || ''}
              required
              step="1000"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tồn kho *</label>
            <input
              type="number"
              name="stock"
              defaultValue={product?.stock || ''}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
            />
          </div>
        </div>

        {/* Hình ảnh và Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh đại diện (URL)</label>
            <input
              type="url"
              name="featuredImage"
              defaultValue={product?.featuredImage || product?.image || ''}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kích thước</label>
            <input
              type="text"
              name="specsDimensions"
              defaultValue={product?.specsDimensions || ''}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="VD: 155x110mm"
            />
          </div>
        </div>

        {/* Trọng lượng và Giảm giá */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Trọng lượng (kg)</label>
            <input
              type="number"
              name="weightKg"
              defaultValue={product?.weightKg || ''}
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Giảm giá (%)</label>
            <input
              type="number"
              name="discountPercentage"
              defaultValue={product?.discountPercentage || 0}
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={product?.isFeatured || false}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isBestseller"
              defaultChecked={product?.isBestseller || false}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Sản phẩm bán chạy</span>
          </label>
        </div>
        </fieldset>
      </form>
    </Modal>
  )
}
