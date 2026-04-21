import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Eye, Trash2, Edit } from 'lucide-react'

export const AdminOrdersPageNew = () => {
  const [orders, setOrders] = useState([] as any[])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      // TODO: Fetch từ API
      // const response = await orderService.getAll()
      // setOrders(response)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleUpdateStatus = async (orderId: any, newStatus: string) => {
    try {
      // TODO: Call API to update order status
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      alert(`Cập nhật trạng thái đơn hàng thành công: ${newStatus}`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Lỗi khi cập nhật trạng thái')
    }
  }

  const handleDeleteOrder = async (orderId: any) => {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        // TODO: Call API to delete
        setOrders(orders.filter(o => o.id !== orderId))
        alert('Xóa đơn hàng thành công')
      } catch (error) {
        console.error('Error deleting order:', error)
        alert('Lỗi khi xóa đơn hàng')
      }
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-700'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700'
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-700'
      case 'PENDING':
        return 'bg-orange-100 text-orange-700'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p className="text-gray-600 mt-1">Danh sách tất cả các đơn hàng</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filterStatus === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Tất cả
            </button>
            {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  filterStatus === status ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-600">Đang tải dữ liệu...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Không có đơn hàng nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Người dùng</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Giá trị</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.userId || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.items?.length || 0} sản phẩm</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${order.finalPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-primary-600 hover:text-primary-700 p-2 hover:bg-gray-100 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <div className="relative group">
                            <button
                              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-gray-100 rounded"
                              title="Cập nhật trạng thái"
                            >
                              <Edit size={18} />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                              {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateStatus(order.id, status)}
                                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
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

        {/* Detail Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chi tiết đơn hàng #{selectedOrder.id}</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">ID đơn hàng</label>
                    <p className="text-gray-900">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Trạng thái</label>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Địa chỉ giao hàng</label>
                  <p className="text-gray-900">{selectedOrder.shippingAddress || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Phương thức thanh toán</label>
                  <p className="text-gray-900">{selectedOrder.paymentMethod || 'N/A'}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Sản phẩm trong đơn hàng</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between py-2 border-b">
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">${item.price?.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Tổng tiền:</span>
                    <span className="font-semibold text-gray-900">${selectedOrder.totalPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Giảm giá:</span>
                    <span className="font-semibold text-gray-900">${selectedOrder.discount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Thành tiền:</span>
                    <span className="font-bold text-lg text-primary-600">${selectedOrder.finalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
