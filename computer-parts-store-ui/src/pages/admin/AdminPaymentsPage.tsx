import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Eye, Trash2 } from 'lucide-react'

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([] as any[])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      // TODO: Fetch từ API
      // const response = await paymentService.getAll()
      // setPayments(response)
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment)
    setShowModal(true)
  }

  const handleDeletePayment = async (paymentId: any) => {
    if (confirm('Bạn có chắc chắn muốn xóa ghi nhận thanh toán này?')) {
      try {
        // TODO: Call API to delete
        setPayments(payments.filter(p => p.id !== paymentId))
        alert('Xóa ghi nhận thanh toán thành công')
      } catch (error) {
        console.error('Error deleting payment:', error)
        alert('Lỗi khi xóa')
      }
    }
  }

  const filteredPayments = filterStatus === 'all' 
    ? payments 
    : payments.filter(p => p.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'FAILED':
        return 'bg-red-100 text-red-700'
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      'CREDIT_CARD': 'Thẻ tín dụng',
      'DEBIT_CARD': 'Thẻ ghi nợ',
      'PAYPAL': 'PayPal',
      'BANK_TRANSFER': 'Chuyển khoản ngân hàng'
    }
    return methods[method] || method
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý thanh toán</h1>
            <p className="text-gray-600 mt-1">Danh sách tất cả các ghi nhận thanh toán</p>
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
            {['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].map((status) => (
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
          ) : filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Không có ghi nhận thanh toán nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Đơn hàng</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số tiền</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phương thức</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày tạo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">#{payment.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">#{payment.orderId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${payment.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {getMethodLabel(payment.method)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="text-primary-600 hover:text-primary-700 p-2 hover:bg-gray-100 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
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
        {showModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chi tiết thanh toán #{selectedPayment.id}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">ID thanh toán</label>
                  <p className="text-gray-900">{selectedPayment.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Đơn hàng</label>
                  <p className="text-gray-900">#{selectedPayment.orderId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Người dùng</label>
                  <p className="text-gray-900">#{selectedPayment.userId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Số tiền</label>
                  <p className="text-lg font-bold text-primary-600">${selectedPayment.amount?.toFixed(2)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Phương thức</label>
                  <p className="text-gray-900">{getMethodLabel(selectedPayment.method)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Trạng thái</label>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status}
                  </span>
                </div>
                
                {selectedPayment.transactionId && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">ID giao dịch</label>
                    <p className="text-gray-900 break-all">{selectedPayment.transactionId}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Ngày tạo</label>
                  <p className="text-gray-900">
                    {selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString('vi-VN') : 'N/A'}
                  </p>
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
