import { Edit, Trash2, Eye } from 'lucide-react'
import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'

interface OrderTableProps {
  orders: Order[]
  onView: (order: Order) => void
  onEdit: (order: Order) => void
  onDelete: (orderId: string) => void
}

export const OrderTable = ({ orders, onView, onEdit, onDelete }: OrderTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700'
      case 'DELIVERED':
        return 'bg-green-100 text-green-700'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-gray-900">#{String(order.id).slice(-6)}</td>
              <td className="px-6 py-4 text-gray-600">{order.userId}</td>
              <td className="px-6 py-4 text-gray-600 text-sm">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900">
                {formatPrice(order.finalPrice)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onView(order)}
                    className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                    title="View order"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(order)}
                    className="p-2 hover:bg-green-100 rounded text-green-600 transition-colors"
                    title="Edit status"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(order.id)}
                    className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                    title="Delete order"
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
  )
}
