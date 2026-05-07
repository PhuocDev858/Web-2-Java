import { Modal } from './Modal'
import type { Order } from '@/types'

interface OrderStatusModalProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
  onSubmit: (orderId: string, status: string) => Promise<void>
  isLoading?: boolean
}

const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ',
}

export const OrderStatusModal = ({
  isOpen,
  order,
  onClose,
  onSubmit,
  isLoading = false,
}: OrderStatusModalProps) => {
  const handleStatusChange = async (status: string) => {
    if (order) {
      // ✅ ép id sang string để tránh lỗi type
      await onSubmit(String(order.id), status)
    }
  }

  // ✅ ép id sang string trước khi gọi .slice()
  const orderId = order?.id ? String(order.id) : ''
  const shortId = orderId.length > 6 ? orderId.slice(-6) : orderId

  return (
    <Modal
      isOpen={isOpen}
      title={`Cập nhật trạng thái - #${shortId}`}
      onClose={onClose}
      onConfirm={() => {}}
      confirmText="Đóng"
      cancelText="Huỷ"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-500">Mã đơn hàng</p>
          <p className="font-semibold text-gray-900">{order?.orderNumber || orderId}</p>
        </div>

        <p className="text-sm text-gray-600">
          Trạng thái hiện tại:{' '}
          <span className="font-bold text-primary-600">{STATUS_LABELS[order?.status ?? ''] ?? order?.status}</span>
        </p>

        <p className="text-sm text-gray-600 mb-2">Chọn trạng thái mới:</p>
        <div className="grid grid-cols-2 gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={isLoading || status === order?.status}
              className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
                status === order?.status
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}