import { useEffect, useState } from 'react'
import { Layout } from '@/components/common/Layout'
import { ProductCard } from '@/components/products/ProductCard'
import { Loading } from '@/components/common/Loading'
import { productService } from '@/services/product.service'
import { useAppDispatch } from '@/store/hooks'
import { addToCart } from '@/store/cart.slice'
import type { Product } from '@/types'

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await productService.getAll(0, 12)
        
        // Handle response safely
        if (response && response.content) {
          setProducts(response.content)
        } else if (response && Array.isArray(response)) {
          setProducts(response)
        } else {
          console.warn('Unexpected response format:', response)
          setProducts([])
          setError('Failed to load products: Invalid response format')
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setError('Failed to load products')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }))
    // You can add a toast notification here
  }

  if (isLoading) {
    return <Loading message="Loading products..." />
  }

  if (error) {
    return (
      <Layout>
        <div className="py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-12 mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Computer Parts Store</h1>
          <p className="text-lg mb-6">Find the best computer components at unbeatable prices</p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded font-semibold hover:bg-gray-100">
            Shop Now
          </button>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
