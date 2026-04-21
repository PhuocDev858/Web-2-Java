import { Layout } from '@/components/common/Layout'
import { CartItemComponent } from '@/components/orders/CartItemComponent'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { updateQuantity, removeFromCart, clearCart } from '@/store/cart.slice'
import { Link } from 'react-router-dom'
import { formatPrice } from '@/utils/format'

export const CartPage = () => {
  const { items, totalPrice } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  if (items.length === 0) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <div className="bg-white p-12 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">Shopping Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link to="/products" className="bg-primary-600 text-white px-6 py-3 rounded hover:bg-primary-700 inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemComponent
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={(productId, quantity) => {
                    if (quantity > 0) {
                      dispatch(updateQuantity({ productId, quantity }))
                    }
                  }}
                  onRemove={(productId) => dispatch(removeFromCart(productId))}
                />
              ))}
            </div>

            <button
              onClick={() => dispatch(clearCart())}
              className="mt-6 text-red-600 hover:text-red-800 font-semibold"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-semibold">{formatPrice(totalPrice * 0.1)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total:</span>
              <span>{formatPrice(totalPrice * 1.1)}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-primary-600 text-white py-3 rounded hover:bg-primary-700 font-semibold text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="w-full border border-gray-300 text-gray-700 py-3 rounded hover:border-primary-600 hover:text-primary-600 font-semibold text-center block mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
