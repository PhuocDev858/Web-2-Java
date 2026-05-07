import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OrderTable } from '@/components/admin/tables/OrderTable'
import { OrderStatusModal } from '@/components/admin/modals/OrderStatusModal'
import { OrderDetailModal } from '@/components/admin/modals/OrderDetailModal'
import { orderService } from '@/services/order.service'
import type { Order } from '@/types'

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ✅ 2 modal riêng: 1 xem chi tiết, 1 sửa trạng thái
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await orderService.getAll(0, 100)
      const ordersList = Array.isArray(response) ? response : response.content || []
      setOrders(ordersList)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Nút mắt → mở detail modal
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  // ✅ Nút bút → mở edit status modal
  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsEditOpen(true)
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Bạn có chắc chắn muốn xoá đơn hàng này?')) {
      try {
        setOrders(orders.filter((o) => String(o.id) !== String(orderId)))
      } catch (error) {
        console.error('Failed to delete order:', error)
      }
    }
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await orderService.updateStatus(orderId, status)
      await fetchOrders()
      setIsEditOpen(false)
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-2">
            Tổng cộng: <span className="font-semibold text-primary-600">{orders.length}</span> đơn hàng
          </p>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">Đang tải đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <OrderTable
            orders={orders}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
          />
        )}

        {/* ✅ Modal xem chi tiết */}
        <OrderDetailModal
          isOpen={isDetailOpen}
          order={selectedOrder}
          onClose={() => setIsDetailOpen(false)}
        />

        {/* ✅ Modal sửa trạng thái */}
        <OrderStatusModal
          isOpen={isEditOpen}
          order={selectedOrder}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleStatusChange}
        />
      </div>
    </AdminLayout>
  )
}