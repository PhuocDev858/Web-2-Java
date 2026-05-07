import type { Order } from '@/types'
import { formatPrice, formatDate } from '@/utils/format'
import { X } from 'lucide-react'

interface OrderDetailModalProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED:   'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING:   'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPED:   'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ',
}

export const OrderDetailModal = ({ isOpen, order, onClose }: OrderDetailModalProps) => {
  if (!isOpen || !order) return null

  const orderId = String(order.id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {order.orderNumber || `#${orderId}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trạng thái */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Trạng thái:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Khách hàng (ID)</p>
              <p className="font-semibold text-gray-900">{order.userId}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Số điện thoại</p>
              <p className="font-semibold text-gray-900">{order.contactPhone || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ngày đặt</p>
              <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Phương thức thanh toán</p>
              <p className="font-semibold text-gray-900">{order.paymentMethod || 'COD'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 col-span-2">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Địa chỉ giao hàng</p>
              <p className="font-semibold text-gray-900">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">Sản phẩm đặt mua</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600 font-semibold">Sản phẩm</th>
                    <th className="px-4 py-2 text-center text-gray-600 font-semibold">SL</th>
                    <th className="px-4 py-2 text-right text-gray-600 font-semibold">Đơn giá</th>
                    <th className="px-4 py-2 text-right text-gray-600 font-semibold">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(order.items || []).map((item, idx) => {
                    const unitPrice = item.unitPrice ?? item.price ?? 0
                    const total = item.totalPrice ?? (unitPrice * item.quantity)
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{item.productName}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatPrice(unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatPrice(total)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
            <span className="text-xl font-bold text-primary-600">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}