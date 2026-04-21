import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatCard } from '@/components/admin/StatCard'
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import { orderService } from '@/services/order.service'
import { productService } from '@/services/product.service'

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch products
        const productsResponse = await productService.getAll(0, 1000)
        
        // Try to fetch orders (might fail if service not available)
        let totalRevenue = 0
        let totalOrders = 0
        try {
          const ordersResponse = await orderService.getAll(0, 1000)
          if (ordersResponse && ordersResponse.content) {
            totalRevenue = ordersResponse.content.reduce((sum, order) => sum + (order.finalPrice || 0), 0)
            totalOrders = ordersResponse.totalElements || 0
          }
        } catch (orderError) {
          console.warn('Order service not available:', orderError)
        }

        setStats({
          totalRevenue,
          totalOrders,
          totalProducts: productsResponse.totalElements || 0,
          totalUsers: 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 1000000).toFixed(2)}M`}
            icon={<DollarSign size={24} />}
            change={12.5}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart size={24} />}
            change={8.2}
            color="blue"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<TrendingUp size={24} />}
            change={5.1}
            color="yellow"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users size={24} />}
            change={15.3}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-4 border-b border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">Order #00{i}</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                  <p className="font-bold text-green-600">+$1,250</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Top Products</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">Product {i}</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                    {100 - i * 10} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
