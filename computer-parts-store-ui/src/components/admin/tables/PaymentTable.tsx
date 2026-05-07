import { Eye, Trash2 } from 'lucide-react'

interface Payment {
  id: number
  orderId: number
  amount: number
  method: string
  status: string
  paymentDate: string
  transactionId: string
  bankCode: string
}

interface PaymentTableProps {
  payments: Payment[]
  onView: (payment: Payment) => void
  onDelete: (paymentId: number) => void
}

export const PaymentTable = ({ payments, onView, onDelete }: PaymentTableProps) => {
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
      'VNPAY': 'VNPay',
      'MOMO': 'MoMo',
      'CASH': 'Tiền mặt',
      'CREDIT_CARD': 'Thẻ tín dụng',
      'DEBIT_CARD': 'Thẻ ghi nợ',
      'BANK_TRANSFER': 'Chuyển khoản',
    }
    return methods[method] || method
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Đơn hàng</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số tiền</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phương thức</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ngân hàng</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ngày thanh toán</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{payment.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">#{payment.orderId}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {payment.amount?.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {getMethodLabel(payment.method)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {payment.bankCode || '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                    {getStatusLabel(payment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleDateString('vi-VN')
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(payment)}
                      className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(payment.id)}
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
      </div>
    </div>
  )
}