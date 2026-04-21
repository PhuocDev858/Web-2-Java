import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Eye, Trash2, Lock, Plus } from 'lucide-react'

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      // TODO: Fetch từ API
      // const response = await userService.getAll()
      // setUsers(response)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const viewUserDetails = (user: any) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const suspendUser = async (userId: any) => {
    if (confirm('Bạn có chắc chắn muốn khóa tài khoản này?')) {
      try {
        // TODO: Call API to suspend user
        setUsers(users.map(u => u.id === userId ? { ...u, active: 0 } : u))
        alert('Khóa tài khoản thành công')
      } catch (error) {
        console.error('Error suspending user:', error)
        alert('Lỗi khi khóa tài khoản')
      }
    }
  }

  const deleteUser = async (userId: any) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        // TODO: Call API to delete user
        setUsers(users.filter(u => u.id !== userId))
        alert('Xóa người dùng thành công')
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Lỗi khi xóa người dùng')
      }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-600 mt-1">Danh sách tất cả các người dùng trong hệ thống</p>
          </div>
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 font-semibold">
            <Plus size={20} />
            Thêm người dùng
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-600">Đang tải dữ liệu...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Không có người dùng nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên đăng nhập</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Họ tên</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vai trò</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.userName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.userDetails?.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(user.userDetails?.firstName || '') + ' ' + (user.userDetails?.lastName || '')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role?.roleName === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role?.roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.active === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.active === 1 ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewUserDetails(user)}
                            className="text-primary-600 hover:text-primary-700 p-2 hover:bg-gray-100 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {user.role?.roleName !== 'ADMIN' && (
                            <>
                              <button
                                onClick={() => suspendUser(user.id)}
                                className="text-orange-600 hover:text-orange-700 p-2 hover:bg-gray-100 rounded"
                                title="Khóa tài khoản"
                              >
                                <Lock size={18} />
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-700 p-2 hover:bg-gray-100 rounded"
                                title="Xóa"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chi tiết người dùng</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-600">ID</label>
                  <p className="text-gray-900">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Tên đăng nhập</label>
                  <p className="text-gray-900">{selectedUser.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedUser.userDetails?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Họ tên</label>
                  <p className="text-gray-900">
                    {(selectedUser.userDetails?.firstName || '') + ' ' + (selectedUser.userDetails?.lastName || '')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Số điện thoại</label>
                  <p className="text-gray-900">{selectedUser.userDetails?.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Vai trò</label>
                  <p className="text-gray-900">{selectedUser.role?.roleName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Trạng thái</label>
                  <p className="text-gray-900">{selectedUser.active === 1 ? 'Hoạt động' : 'Không hoạt động'}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
