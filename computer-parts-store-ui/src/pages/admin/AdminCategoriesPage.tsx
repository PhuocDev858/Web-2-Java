import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { CategoryFormModal } from '@/components/admin/modals/CategoryFormModal'
import { categoryService } from '@/services/category.service'
import type { Category, CategoryRequest } from '@/services/category.service'
import { showSuccess, showError } from '@/utils/toast'
import { Plus, Pencil, Trash2, RefreshCw, Tag, Search } from 'lucide-react'
import { formatDate } from '@/utils/format'

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [filtered, setFiltered] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [search, setSearch] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    const q = search.toLowerCase().trim()
    setFiltered(
      q ? categories.filter((c) => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q))
        : categories
    )
  }, [search, categories])

  const fetchCategories = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      else setIsRefreshing(true)
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err: any) {
      showError('Không thể tải danh sách danh mục')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat)
    setIsModalOpen(true)
  }

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Xoá danh mục "${cat.name}"?\nCác sản phẩm thuộc danh mục này có thể bị ảnh hưởng.`)) return
    try {
      await categoryService.delete(cat.id)
      showSuccess(`Đã xoá danh mục "${cat.name}"`)
      fetchCategories(true)
    } catch (err: any) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : 'Không thể xoá danh mục'
      showError(msg)
    }
  }

  const handleSubmit = async (data: CategoryRequest) => {
    try {
      setIsSaving(true)
      if (selectedCategory) {
        await categoryService.update(selectedCategory.id, data)
        showSuccess('Cập nhật danh mục thành công!')
      } else {
        await categoryService.create(data)
        showSuccess('Thêm danh mục thành công!')
      }
      setIsModalOpen(false)
      fetchCategories(true)
    } catch (err: any) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : 'Có lỗi xảy ra'
      showError(msg)
      throw err // để modal hiển thị lỗi
    } finally {
      setIsSaving(false)
    }
  }

  // Skeleton rows
  const SkeletonRow = () => (
    <tr>
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Tổng cộng: <span className="font-semibold text-primary-600">{categories.length}</span> danh mục
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchCategories(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Làm mới
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 text-sm font-semibold"
            >
              <Plus size={18} />
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mô tả</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Tag size={40} className="text-gray-200" />
                        <p className="font-medium">{search ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục nào'}</p>
                        {!search && (
                          <button onClick={handleAdd} className="text-primary-600 text-sm hover:underline font-semibold">
                            + Thêm danh mục đầu tiên
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      {/* ID */}
                      <td className="px-5 py-4 text-sm text-gray-400 font-mono">#{cat.id}</td>

                      {/* Tên + ảnh */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50 flex-shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                              <Tag size={18} className="text-primary-500" />
                            </div>
                          )}
                          <span className="font-semibold text-gray-900">{cat.name}</span>
                        </div>
                      </td>

                      {/* Mô tả */}
                      <td className="px-5 py-4 text-sm text-gray-500 max-w-xs">
                        <span className="line-clamp-2">{cat.description || <span className="italic text-gray-300">Chưa có mô tả</span>}</span>
                      </td>

                      {/* Trạng thái */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          cat.isActive !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {cat.isActive !== false ? '● Hoạt động' : '○ Ẩn'}
                        </span>
                      </td>

                      {/* Ngày tạo */}
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {cat.createdAt ? formatDate(cat.createdAt) : '-'}
                      </td>

                      {/* Thao tác */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Xoá"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Số kết quả tìm kiếm */}
        {search && !isLoading && (
          <p className="text-sm text-gray-500">
            Tìm thấy <span className="font-semibold">{filtered.length}</span> danh mục cho "{search}"
          </p>
        )}
      </div>

      {/* Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        category={selectedCategory}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </AdminLayout>
  )
}
