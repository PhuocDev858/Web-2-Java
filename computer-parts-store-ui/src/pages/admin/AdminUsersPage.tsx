import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiClient } from '@/services/api'

interface UserData {
  id: number
  username: string
  email: string
  fullName: string
  phone: string
  address: string
  isActive: boolean
  createdAt?: string
}

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log('Fetching users from /api/users...')
      const response = await apiClient.get<any>('/users')
      
      console.log('Response:', response.data)
      console.log('Response type:', typeof response.data)
      
      // Handle if response is array or object containing array
      let userList: UserData[] = []
      if (Array.isArray(response.data)) {
        userList = response.data
      } else if (response.data?.content && Array.isArray(response.data.content)) {
        userList = response.data.content
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        userList = response.data.data
      }
      
      console.log('Parsed users:', userList)
      setUsers(userList)
      setError('')
    } catch (err: any) {
      console.error('Full error:', err)
      console.error('Error response:', err.response)
      const message = err.response?.data?.message || err.message || 'Không thể tải danh sách users'
      setError(`${message} (Status: ${err.response?.status || 'unknown'})`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-2">Manage system users</p>
          </div>
          <button 
            onClick={fetchUsers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Đang tải danh sách users...</p>
          </div>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Họ tên</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số điện thoại</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Users */}
        {!loading && users.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Users Found</h2>
            <p className="text-gray-600">Hiện tại không có users trong hệ thống</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
