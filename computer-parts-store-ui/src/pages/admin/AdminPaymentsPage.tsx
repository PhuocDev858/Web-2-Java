import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiClient } from '@/services/api'
import { PaymentTable } from '@/components/admin/tables/PaymentTable'

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
      const response = await apiClient.get<any[]>('/payments/admin')
      setPayments(response.data || [])
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
      case 'SUCCESS': return 'bg-green-100 text-green-700'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'FAILED': return 'bg-red-100 text-red-700'
      case 'REFUNDED': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'Thành công'
      case 'PENDING': return 'Chờ xử lý'
      case 'FAILED': return 'Thất bại'
      case 'REFUNDED': return 'Hoàn tiền'
      case 'COMPLETED': return 'Hoàn thành'
      default: return status
    }
  }

  const getMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      'CREDIT_CARD': 'Thẻ tín dụng',
      'DEBIT_CARD': 'Thẻ ghi nợ',
      'PAYPAL': 'PayPal',
      'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
      'VNPAY': 'VNPay',
      'MOMO': 'MoMo',
      'CASH': 'Tiền mặt',
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
          <button
            onClick={fetchPayments}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold ${filterStatus === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Tất cả
            </button>
            {[
              { value: 'PENDING', label: 'Chờ xử lý' },
              { value: 'SUCCESS', label: 'Thành công' },
              { value: 'FAILED', label: 'Thất bại' },
              { value: 'REFUNDED', label: 'Hoàn tiền' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilterStatus(value)}
                className={`px-4 py-2 rounded-lg font-semibold ${filterStatus === value ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            Đang tải dữ liệu...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            Không có ghi nhận thanh toán nào
          </div>
        ) : (
          <PaymentTable
            payments={filteredPayments}
            onView={handleViewDetails}
            onDelete={handleDeletePayment}
          />
        )}

        {/* Detail Modal */}
        {showModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Chi tiết thanh toán #{selectedPayment.id}
              </h2>
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
                  <label className="text-sm font-semibold text-gray-600">Số tiền</label>
                  <p className="text-lg font-bold text-primary-600">
                    {selectedPayment.amount?.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Phương thức</label>
                  <p className="text-gray-900">{getMethodLabel(selectedPayment.method)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Trạng thái</label>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedPayment.status)}`}>
                    {getStatusLabel(selectedPayment.status)}
                  </span>
                </div>
                {selectedPayment.transactionId && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">ID giao dịch</label>
                    <p className="text-gray-900 break-all">{selectedPayment.transactionId}</p>
                  </div>
                )}
                {selectedPayment.bankCode && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Ngân hàng</label>
                    <p className="text-gray-900">{selectedPayment.bankCode}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Ngày thanh toán</label>
                  <p className="text-gray-900">
                    {selectedPayment.paymentDate
                      ? new Date(selectedPayment.paymentDate).toLocaleString('vi-VN')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
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