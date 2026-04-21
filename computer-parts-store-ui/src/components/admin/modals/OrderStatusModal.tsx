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

export const OrderStatusModal = ({
  isOpen,
  order,
  onClose,
  onSubmit,
  isLoading = false,
}: OrderStatusModalProps) => {
  const handleStatusChange = async (status: string) => {
    if (order) {
      await onSubmit(order.id, status)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={`Update Order Status - #${order?.id.slice(-6)}`}
      onClose={onClose}
      onConfirm={() => {}}
      confirmText="Close"
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600 mb-4">Current Status: <span className="font-bold">{order?.status}</span></p>
        <p className="text-sm text-gray-600 mb-4">Select New Status:</p>
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
              {status}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
