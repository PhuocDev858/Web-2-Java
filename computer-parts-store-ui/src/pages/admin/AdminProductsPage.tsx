import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProductTable } from '@/components/admin/tables/ProductTable'
import { ProductFormModal } from '@/components/admin/modals/ProductFormModal'
import { productService } from '@/services/product.service'
import { showSuccess, showError } from '@/utils/toast'
import { Plus } from 'lucide-react'
import type { Product } from '@/types'

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await productService.getAll(0, 100)
      setProducts(response.content)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.delete(productId)
        showSuccess('Xóa sản phẩm thành công!')
      } catch (error) {
        console.error('Failed to delete product:', error)
        const message = error instanceof Error ? error.message : 'Không thể xóa sản phẩm'
        showError(`Lỗi: ${message}`)
      }
    }
  }

  const handleSubmit = async (formData: Partial<Product>) => {
    try {
      setIsSaving(true)
      if (selectedProduct?.id) {
        await productService.update(selectedProduct.id, formData)
        showSuccess('Cập nhật sản phẩm thành công!')
      } else {
        await productService.create(formData)
        showSuccess('Thêm sản phẩm thành công!')
      }
      await fetchProducts()
      setIsModalOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Failed to save product:', error)
      const message = error instanceof Error ? error.message : 'Không thể lưu sản phẩm'
      showError(`Lỗi: ${message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600 mt-2">Quản lý danh sách linh kiện PC</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Thêm sản phẩm
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <ProductTable
            products={products}
          isLoading={isSaving}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}

        {/* Modal */}
        <ProductFormModal
          isOpen={isModalOpen}
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  )
}
