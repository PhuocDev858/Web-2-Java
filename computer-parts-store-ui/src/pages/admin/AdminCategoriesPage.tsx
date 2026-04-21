import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Eye, Trash2, Edit, Plus } from 'lucide-react'

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([] as any[])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      // TODO: Fetch từ API
      // const response = await categoryService.getAll()
      // setCategories(response)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = () => {
    setFormData({ name: '', description: '' })
    setSelectedCategory(null)
    setShowEditForm(true)
  }

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category)
    setFormData(category)
    setShowEditForm(true)
  }

  const handleDeleteCategory = async (categoryId: any) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        // TODO: Call API to delete
        setCategories(categories.filter(c => c.id !== categoryId))
        alert('Xóa danh mục thành công')
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Lỗi khi xóa danh mục')
      }
    }
  }

  const handleSaveCategory = async () => {
    try {
      if (selectedCategory?.id) {
        // TODO: Call API to update
        setCategories(categories.map(c => c.id === selectedCategory.id ? formData : c))
        alert('Cập nhật danh mục thành công')
      } else {
        // TODO: Call API to create
        setCategories([...categories, formData])
        alert('Thêm danh mục thành công')
      }
      setShowEditForm(false)
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Lỗi khi lưu danh mục')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
            <p className="text-gray-600 mt-1">Danh sách tất cả các danh mục sản phẩm</p>
          </div>
          <button
            onClick={handleAddCategory}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Thêm danh mục
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-600">Đang tải dữ liệu...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Không có danh mục nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên danh mục</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mô tả</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{category.description || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-700 p-2 hover:bg-gray-100 rounded"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700 p-2 hover:bg-gray-100 rounded"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên danh mục</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-600"
                    placeholder="Nhập tên danh mục"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-600 resize-none"
                    rows={4}
                    placeholder="Nhập mô tả danh mục"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
