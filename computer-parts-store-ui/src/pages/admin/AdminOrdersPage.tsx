import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OrderTable } from '@/components/admin/tables/OrderTable'
import { OrderStatusModal } from '@/components/admin/modals/OrderStatusModal'
import { orderService } from '@/services/order.service'
import type { Order } from '@/types'

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await orderService.getAll(0, 100)
      // Handle both paginated response {content: []} and direct array []
      const ordersList = Array.isArray(response) ? response : response.content || []
      setOrders(ordersList)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        // Implement delete if API supports it
        setOrders(orders.filter((o) => o.id !== orderId))
      } catch (error) {
        console.error('Failed to delete order:', error)
      }
    }
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await orderService.updateStatus(orderId, status)
      await fetchOrders()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <OrderTable
            orders={orders}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
          />
        )}

        {/* Modal */}
        <OrderStatusModal
          isOpen={isModalOpen}
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleStatusChange}
        />
      </div>
    </AdminLayout>
  )
}
