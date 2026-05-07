import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { clearCart } from '@/store/cart.slice'
import { apiClient } from '@/services/api'
import { formatPrice } from '@/utils/format'

type PaymentMethod = 'COD' | 'VNPAY'

export const CheckoutPage = () => {
  const { items, totalPrice } = useAppSelector((state) => state.cart)
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shippingAddress: '',
    contactPhone: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Dùng ref để tránh race condition
  const orderPlacedRef = useRef(false)

  const totalWithTax = totalPrice * 1.1

  // Chỉ redirect về cart nếu chưa đặt hàng
  useEffect(() => {
    if (!isLoading && items.length === 0 && !orderPlacedRef.current) {
      navigate('/cart')
    }
  }, [items.length, isLoading, navigate])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.shippingAddress || !form.contactPhone) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng')
      return
    }

    try {
      setIsLoading(true)

      const orderPayload = {
        userId: user?.userId ? Number(user.userId) : null,
        shippingAddress: form.shippingAddress,
        contactPhone: form.contactPhone,
        paymentMethod: paymentMethod,
        items: items.map((item) => ({
          productId: Number(item.product.id),
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: Math.round(item.product.price)
        }))
      }

      // Tạo đơn hàng
      const orderResponse = await apiClient.post<any>(
        '/orders/create',
        orderPayload
      )

      const orderId =
        orderResponse.data?.id || orderResponse.data?.orderId

      if (!orderId) {
        setError('Không thể tạo đơn hàng, vui lòng thử lại')
        return
      }

      // Đánh dấu đã đặt hàng ngay lập tức
      orderPlacedRef.current = true

      // COD
      if (paymentMethod === 'COD') {
        // Navigate trước
        navigate(`/order-success?orderId=${orderId}&method=COD`, {
          replace: true
        })

        // Clear cart sau
        dispatch(clearCart())
      }

      // VNPAY
      else if (paymentMethod === 'VNPAY') {
        const vnpayResponse = await apiClient.post<any>(
          `/payments/create-vnpay?orderId=${orderId}&amount=${Math.round(
            totalWithTax
          )}`,
          {}
        )

        const paymentUrl =
          vnpayResponse.data?.url ||
          vnpayResponse.data?.paymentUrl

        if (!paymentUrl) {
          orderPlacedRef.current = false
          setError('Không thể tạo link thanh toán VNPay')
          return
        }

        dispatch(clearCart())
        window.location.href = paymentUrl
      }
    } catch (err: any) {
      console.error('Checkout error:', err)

      orderPlacedRef.current = false

      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message ||
            'Có lỗi xảy ra, vui lòng thử lại'

      setError(msg)
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
              <h2 className="text-xl font-bold mb-6">
                Thông tin giao hàng
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phương thức thanh toán *
                  </label>

                  <div className="space-y-3">
                    {/* COD */}
                    <label
                      className={`flex items-center gap-3 border-2 rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                        paymentMethod === 'COD'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-primary-600"
                      />
                      <span className="text-2xl">💵</span>

                      <div>
                        <p className="font-semibold text-gray-800">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                        <p className="text-xs text-gray-500">
                          Trả tiền mặt khi nhận hàng
                        </p>
                      </div>
                    </label>

                    {/* VNPAY */}
                    <label
                      className={`flex items-center gap-3 border-2 rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                        paymentMethod === 'VNPAY'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="VNPAY"
                        checked={paymentMethod === 'VNPAY'}
                        onChange={() => setPaymentMethod('VNPAY')}
                        className="accent-primary-600"
                      />

                      <img
                        src="https://vnpay.vn/s1/statics/img/logo2.svg"
                        alt="VNPay"
                        className="h-7"
                        onError={(e) =>
                          (e.currentTarget.style.display = 'none')
                        }
                      />

                      <div>
                        <p className="font-semibold text-gray-800">
                          Thanh toán qua VNPay
                        </p>
                        <p className="text-xs text-gray-500">
                          ATM, Visa, MasterCard, QR Code
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isLoading
                    ? 'Đang xử lý...'
                    : paymentMethod === 'COD'
                    ? '✅ Đặt hàng (COD)'
                    : '🔒 Đặt hàng & Thanh toán VNPay'}
                </button>
              </form>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600 truncate max-w-[60%]">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(
                      item.product.price * item.quantity
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Vận chuyển:</span>
                <span className="text-green-600">
                  Miễn phí
                </span>
              </div>

              <div className="flex justify-between">
                <span>Thuế (10%):</span>
                <span>{formatPrice(totalPrice * 0.1)}</span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-primary-600">
                  {formatPrice(totalWithTax)}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
              {paymentMethod === 'COD'
                ? '💵 Thanh toán khi nhận hàng'
                : '🔒 Thanh toán qua VNPay'}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}