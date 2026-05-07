import { Link, useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const method = searchParams.get('method')

  return (
    <Layout>
      <div className="py-12 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-12 max-w-lg w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-600 mb-3">Đặt hàng thành công!</h1>
          <p className="text-gray-600 mb-2">
            Mã đơn hàng: <span className="font-semibold text-gray-900">#{orderId}</span>
          </p>
          {method === 'COD' && (
            <p className="text-gray-600 mb-6">
              Bạn sẽ thanh toán <span className="font-semibold">tiền mặt</span> khi nhận hàng.
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Link
              to="/products"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-semibold"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              to="/"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-primary-600 hover:text-primary-600 font-semibold"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}