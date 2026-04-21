import { useState } from 'react'
import { Link } from 'react-router-dom'

interface LoginFormProps {
  onSubmit: (userName: string, userPassword: string) => Promise<void>
  isLoading?: boolean
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const [userName, setUserName] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userName || !userPassword) {
      setError('Vui lòng nhập tên người dùng và mật khẩu')
      return
    }

    try {
      await onSubmit(userName, userPassword)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Đăng Nhập</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tên Người Dùng</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Mật Khẩu</label>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="#" className="text-primary-600 hover:text-primary-700 text-sm">
            Quên mật khẩu?
          </a>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p><strong>Demo Admin:</strong></p>
          <p>Tên: <code>admin</code></p>
          <p>Mật khẩu: <code>admin123</code></p>
        </div>
      </div>
    </div>
  )
}
