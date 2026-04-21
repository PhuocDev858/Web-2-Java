import { Trash2 } from 'lucide-react'
import type { CartItem } from '@/types'
import { formatPrice } from '@/utils/format'

interface CartItemComponentProps {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export const CartItemComponent = ({ item, onUpdateQuantity, onRemove }: CartItemComponentProps) => {
  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Product Image */}
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded"
      />

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{item.product.description}</p>
        <div className="text-primary-600 font-bold">{formatPrice(item.product.price)}</div>
      </div>

      {/* Quantity Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
        >
          −
        </button>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.product.id, parseInt(e.target.value))}
          className="w-12 h-8 border rounded text-center"
        />
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
        >
          +
        </button>
      </div>

      {/* Subtotal & Remove */}
      <div className="text-right">
        <div className="font-bold text-lg mb-4">
          {formatPrice(item.product.price * item.quantity)}
        </div>
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
}
