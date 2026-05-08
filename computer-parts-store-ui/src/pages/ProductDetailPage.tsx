import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'
import { Loading } from '@/components/common/Loading'
import { productService } from '@/services/product.service'
import { useAppDispatch } from '@/store/hooks'
import { addToCart } from '@/store/cart.slice'
import { Star, ShoppingCart, Heart, ArrowLeft, Package } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import type { Product } from '@/types'

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        setNotFound(false)
        const data = await productService.getById(id)
        setProduct(data)
      } catch (error: any) {
        console.error('Failed to fetch product:', error)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (isLoading) {
    return <Loading message="Đang tải sản phẩm..." />
  }

  // ✅ Trang Not Found đẹp hơn
  if (notFound || !product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Package size={64} className="text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-700">Sản phẩm không tồn tại</h2>
          <p className="text-gray-500">Sản phẩm này đã bị xóa hoặc không tồn tại.</p>
          <Link
            to="/products"
            className="mt-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-semibold flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </Layout>
    )
  }

  // ✅ Dùng đúng field từ BE: quantity (không phải stock)
  const stock = product.quantity ?? product.stock ?? 0
  const rating = product.rating ?? 0
  const reviews = product.reviews ?? product.reviewCount ?? 0
  const imageUrl = product.images?.[0]?.imageUrl ?? product.image ?? '/placeholder-product.png'

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
    setQuantity(1)
  }

  const renderSpecifications = () => {
    if (!product.specification) {
      return <p className="text-gray-500 text-sm">Không có thông số kỹ thuật</p>
    }
    try {
      const specs =
        typeof product.specification === 'string'
          ? JSON.parse(product.specification)
          : product.specification
      return Object.entries(specs).map(([key, value]) => (
        <div key={key} className="flex justify-between text-sm border-b border-gray-100 py-2">
          <span className="text-gray-500 capitalize">{key}</span>
          <span className="font-semibold text-gray-800">{String(value)}</span>
        </div>
      ))
    } catch {
      return <p className="text-gray-500 text-sm">{String(product.specification)}</p>
    }
  }

  return (
    <Layout>
      <div className="py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Sản phẩm</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96 overflow-hidden">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.png' }}
            />
          </div>

          {/* Product Details */}
          <div>
            {/* Category badge */}
            {product.categoryName && (
              <span className="inline-block bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full font-semibold mb-3">
                {product.categoryName}
              </span>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {product.brand && (
              <p className="text-sm text-gray-500 mb-3">
                Thương hiệu: <span className="font-semibold text-gray-700">{product.brand}</span>
                {product.sku && (
                  <span className="ml-3 font-mono text-gray-400">SKU: {product.sku}</span>
                )}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                {rating.toFixed(1)} ({reviews} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className="mb-5">
              <p className="text-4xl font-bold text-primary-600">{formatPrice(product.price)}</p>
              {product.discount && (
                <p className="text-sm text-red-500 mt-1">Tiết kiệm {product.discount}%</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            )}

            {/* Stock & Actions */}
            <div className="mb-6">
              {/* ✅ Dùng `stock` đã được map từ product.quantity ở trên */}
              <p className="mb-4 text-sm">
                Tình trạng:{' '}
                <span className={stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {stock > 0 ? `Còn ${stock} sản phẩm` : 'Hết hàng'}
                </span>
              </p>

              <div className="flex gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={stock <= 0}
                    className="px-4 py-2 hover:bg-gray-100 disabled:opacity-40 text-lg font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-14 text-center border-x border-gray-300 py-2 focus:outline-none"
                    disabled={stock <= 0}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={stock <= 0}
                    className="px-4 py-2 hover:bg-gray-100 disabled:opacity-40 text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart size={20} />
                  {stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>

                {/* Wishlist */}
                <button className="border border-gray-300 px-4 py-2 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Specifications */}
            {product.specification && (
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Thông số kỹ thuật</h3>
                <div className="space-y-1">{renderSpecifications()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}