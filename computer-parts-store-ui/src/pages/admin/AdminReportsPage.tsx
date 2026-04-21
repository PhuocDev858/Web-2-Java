import { AdminLayout } from '@/components/admin/AdminLayout'
import { BarChart3 } from 'lucide-react'

export const AdminReportsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Business analytics and reports</p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 size={48} className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-semibold">Reports Coming Soon</p>
          <p className="text-gray-500 mt-2">Detailed analytics will be available soon</p>
        </div>
      </div>
    </AdminLayout>
  )
}
