import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { clearCart } from '@/store/cart.slice'
import { apiClient } from '@/services/api'
import { formatPrice } from '@/utils/format'

export const CheckoutPage = () => {
  const { items, totalPrice } = useAppSelector((state) => state.cart)
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shippingAddress: '',
    contactPhone: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const totalWithTax = totalPrice * 1.1

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.shippingAddress || !form.contactPhone) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      setIsLoading(true)

      // Bước 1: Tạo đơn hàng
      const orderPayload = {
        userId: user?.id,
        shippingAddress: form.shippingAddress,
        contactPhone: form.contactPhone,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      }

      const orderResponse = await apiClient.post<any>('/orders/create', orderPayload)
      const orderId = orderResponse.data?.id

      if (!orderId) {
        setError('Không thể tạo đơn hàng, vui lòng thử lại')
        return
      }

      // Bước 2: Tạo URL thanh toán VNPay
      const vnpayResponse = await apiClient.post<any>(
        `/payments/create-vnpay?orderId=${orderId}&amount=${Math.round(totalWithTax)}`,
        {}
      )

      const paymentUrl = vnpayResponse.data?.url
      if (!paymentUrl) {
        setError('Không thể tạo link thanh toán VNPay')
        return
      }

      // Bước 3: Xóa giỏ hàng và redirect sang VNPay
      dispatch(clearCart())
      window.location.href = paymentUrl

    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="py-12">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form thông tin */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Địa chỉ */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ giao hàng *
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={form.shippingAddress}
                    onChange={handleChange}
                    rows={3}
                    required
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    required
                    placeholder="VD: 0901234567"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
                  />
                </div>

                {/* Phương thức thanh toán */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <div className="flex items-center gap-3 border border-gray-300 rounded px-4 py-3 bg-gray-50">
                    <img
                      src="https://vnpay.vn/s1/statics/img/logo2.svg"
                      alt="VNPay"
                      className="h-8"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <span className="font-semibold text-gray-700">Thanh toán qua VNPay</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 rounded font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Đang xử lý...' : 'Đặt hàng & Thanh toán qua VNPay'}
                </button>
              </form>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Vận chuyển:</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Thuế (10%):</span>
                <span>{formatPrice(totalPrice * 0.1)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-primary-600">{formatPrice(totalWithTax)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}