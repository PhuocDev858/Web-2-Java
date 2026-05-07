import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'
import { ProductCard } from '@/components/products/ProductCard'
import { Loading } from '@/components/common/Loading'
import { Pagination } from '@/components/common/Pagination'
import { productService } from '@/services/product.service'
import { useAppDispatch } from '@/store/hooks'
import { addToCart } from '@/store/cart.slice'
import type { Product, ProductFilter } from '@/types'

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(12)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [filter, setFilter] = useState<ProductFilter>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
  })
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories()
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => (typeof c === 'string' ? c : c.name)))
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productService.getAll(currentPage, pageSize, filter)
        setProducts(response.content)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [currentPage, pageSize, filter])

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }))
  }

  const handleFilterChange = (newFilter: ProductFilter) => {
    setFilter(newFilter)
    setCurrentPage(0) // reset về trang đầu khi đổi filter
    const params = new URLSearchParams()
    if (newFilter.category) params.set('category', newFilter.category)
    if (newFilter.search) params.set('search', newFilter.search)
    if (newFilter.minPrice) params.set('minPrice', newFilter.minPrice.toString())
    if (newFilter.maxPrice) params.set('maxPrice', newFilter.maxPrice.toString())
    setSearchParams(params)
  }

  if (isLoading && products.length === 0) {
    return <Loading message="Đang tải sản phẩm..." />
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h3 className="font-bold text-lg mb-4">Bộ lọc</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-sm">Danh mục</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!filter.category}
                    onChange={() => handleFilterChange({ ...filter, category: undefined })}
                    className="mr-2"
                  />
                  <span className="text-sm">Tất cả</span>
                </label>
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      checked={filter.category === category}
                      onChange={() => handleFilterChange({ ...filter, category })}
                      className="mr-2"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Khoảng giá</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Giá tối thiểu"
                  value={filter.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filter,
                      minPrice: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  placeholder="Giá tối đa"
                  value={filter.maxPrice || ''}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filter,
                      maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3 space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Đang tải...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">Không tìm thấy sản phẩm</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalElements={totalElements}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(0)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}