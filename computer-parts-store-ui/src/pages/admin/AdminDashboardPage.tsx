import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatCard } from '@/components/admin/StatCard'
import { DollarSign, ShoppingCart, Users, Package, RefreshCw, ArrowRight } from 'lucide-react'
import { orderService } from '@/services/order.service'
import { productService } from '@/services/product.service'
import { apiClient } from '@/services/api'
import { formatPrice, formatDate } from '@/utils/format'
import type { Order, Product } from '@/types'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
  deliveredOrders: number
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED:   'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING:   'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPED:   'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ',
}

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchDashboard = async () => {
    try {
      setIsLoading(true)

      // Fetch tất cả song song
      const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
        productService.getAll(0, 1000),
        orderService.getAll(0, 1000),
        apiClient.get<any[]>('/users'),
      ])

      // --- Products ---
      let totalProducts = 0
      let latestProducts: Product[] = []
      if (productsRes.status === 'fulfilled') {
        totalProducts = productsRes.value.totalElements || 0
        latestProducts = [...(productsRes.value.content || [])]
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA
          })
          .slice(0, 5)
      }
      setTopProducts(latestProducts)

      // --- Orders ---
      let totalRevenue = 0
      let totalOrders = 0
      let pendingOrders = 0
      let deliveredOrders = 0
      let latest5Orders: Order[] = []
      if (ordersRes.status === 'fulfilled') {
        const orders = ordersRes.value.content || []
        totalOrders = ordersRes.value.totalElements || orders.length

        orders.forEach((o) => {
          totalRevenue += o.totalPrice || 0
          if (o.status === 'PENDING') pendingOrders++
          if (o.status === 'DELIVERED') deliveredOrders++
        })

        latest5Orders = [...orders]
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA
          })
          .slice(0, 5)
      }
      setRecentOrders(latest5Orders)

      // --- Users ---
      let totalUsers = 0
      if (usersRes.status === 'fulfilled') {
        const usersData = usersRes.value.data
        totalUsers = Array.isArray(usersData) ? usersData.length : 0
      }

      setStats({ totalRevenue, totalOrders, totalProducts, totalUsers, pendingOrders, deliveredOrders })
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Cập nhật lần cuối: {formatDate(lastUpdated)}
            </p>
          </div>
          <button
            onClick={fetchDashboard}
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-semibold text-sm"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng doanh thu"
            value={isLoading ? '...' : formatPrice(stats.totalRevenue)}
            icon={<DollarSign size={24} />}
            color="green"
          />
          <StatCard
            title="Tổng đơn hàng"
            value={isLoading ? '...' : stats.totalOrders}
            icon={<ShoppingCart size={24} />}
            color="blue"
          />
          <StatCard
            title="Tổng sản phẩm"
            value={isLoading ? '...' : stats.totalProducts}
            icon={<Package size={24} />}
            color="yellow"
          />
          <StatCard
            title="Tổng người dùng"
            value={isLoading ? '...' : stats.totalUsers}
            icon={<Users size={24} />}
            color="red"
          />
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">⏳ Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-700">{isLoading ? '...' : stats.pendingOrders}</p>
            </div>
            <Link to="/admin/orders" className="text-yellow-600 hover:text-yellow-800 text-sm font-semibold flex items-center gap-1">
              Xem <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">✅ Đã giao thành công</p>
              <p className="text-2xl font-bold text-green-700">{isLoading ? '...' : stats.deliveredOrders}</p>
            </div>
            <Link to="/admin/orders" className="text-green-600 hover:text-green-800 text-sm font-semibold flex items-center gap-1">
              Xem <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">📦 Tổng sản phẩm đang bán</p>
              <p className="text-2xl font-bold text-blue-700">{isLoading ? '...' : stats.totalProducts}</p>
            </div>
            <Link to="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1">
              Xem <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Orders & Latest Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Đơn hàng mới nhất</h3>
              <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="animate-pulse h-14 bg-gray-100 rounded-lg" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        #{String(order.id).slice(-6)} · User {order.userId}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.createdAt ? formatDate(order.createdAt) : '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{formatPrice(order.totalPrice || 0)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sản phẩm mới nhất</h3>
              <Link to="/admin/products" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="animate-pulse h-14 bg-gray-100 rounded-lg" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có sản phẩm nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {product.categoryName || product.category?.name || '—'} · {product.brand || '—'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary-600 text-sm">{formatPrice(product.price || 0)}</p>
                      <p className="text-xs text-gray-400">Kho: {product.quantity ?? product.stock ?? 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
