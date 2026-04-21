import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden bg-gray-200 h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{product.discount}%
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`} className="hover:text-primary-600">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? 'fill-current' : ''}
              />
            ))}
          </div>
          <span className="text-gray-600 text-xs ml-2">({product.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-xl font-bold text-primary-600">{formatPrice(product.price)}</div>
          {product.stock > 0 ? (
            <span className="text-xs text-green-600">{product.stock} in stock</span>
          ) : (
            <span className="text-xs text-red-600">Out of stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock <= 0}
            className="flex-1 bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <ShoppingCart size={16} />
            Add
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:border-primary-600 hover:text-primary-600 flex items-center justify-center">
            <Heart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
