import { Edit, Trash2 } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

interface ProductTableProps {
  products: Product[]
  isLoading?: boolean
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full min-w-max">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              Tên sản phẩm
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              Danh mục
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              Hãng
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              SKU
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              Giá
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              Tồn kho
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              Đánh giá
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">

              {/* Tên sản phẩm */}
              <td className="px-4 py-4">
                <span className="font-semibold text-gray-900 truncate max-w-xs block">
                  {product.name}
                </span>
                {product.description && (
                  <span className="text-xs text-gray-400 truncate max-w-xs block mt-0.5">
                    {product.description.length > 50
                      ? product.description.slice(0, 50) + '...'
                      : product.description}
                  </span>
                )}
              </td>

              {/* Danh mục — categoryName từ BE */}
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {product.categoryName || '-'}
                </span>
              </td>

              {/* Hãng */}
              <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                {product.brand || '-'}
              </td>

              {/* SKU */}
              <td className="px-4 py-4 text-gray-500 whitespace-nowrap font-mono text-sm">
                {product.sku || '-'}
              </td>

              {/* Giá */}
              <td className="px-4 py-4 font-semibold text-gray-900 whitespace-nowrap">
                {formatPrice(product.price)}
              </td>

              {/* Tồn kho — BE trả về "quantity" */}
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    (product.quantity ?? 0) > 10
                      ? 'bg-green-100 text-green-700'
                      : (product.quantity ?? 0) > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.quantity ?? 0}
                </span>
              </td>

              {/* Đánh giá — BE trả về "reviews" (số lượt) và "rating" (sao) */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 font-semibold">★</span>
                  <span className="text-gray-900 text-sm">{(product.rating ?? 0).toFixed(1)}</span>
                  <span className="text-gray-400 text-xs">({product.reviews ?? 0})</span>
                </div>
              </td>

              {/* Trạng thái — isActive từ BE */}
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  product.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {product.isActive ? 'Đang bán' : 'Ẩn'}
                </span>
              </td>

              {/* Thao tác */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(String(product.id))}
                    className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
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
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không có sản phẩm nào</p>
        </div>
      )}
    </div>
  )
}