import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'
import { Loading } from '@/components/common/Loading'
import { productService } from '@/services/product.service'
import { useAppDispatch } from '@/store/hooks'
import { addToCart } from '@/store/cart.slice'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import type { Product } from '@/types'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        const data = await productService.getById(id)
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return <Loading message="Loading product..." />
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Product not found</p>
        </div>
      </Layout>
    )
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
    setQuantity(1)
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-200 rounded-lg h-96">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-current' : ''}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-primary-600">{formatPrice(product.price)}</p>
              {product.discount && (
                <p className="text-sm text-red-600 mt-2">Save {product.discount}%</p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Specifications */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-lg mb-4">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock & Actions */}
            <div className="mb-8">
              <p className="mb-4">
                Stock:{' '}
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </p>

              <div className="flex gap-4">
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock <= 0}
                    className="px-4 py-2 disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-l border-r border-gray-300"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock <= 0}
                    className="px-4 py-2 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-primary-600 text-white py-3 rounded font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 disabled:bg-gray-400"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                {/* Wishlist */}
                <button className="border border-gray-300 px-6 py-3 rounded font-semibold hover:border-primary-600 hover:text-primary-600">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
