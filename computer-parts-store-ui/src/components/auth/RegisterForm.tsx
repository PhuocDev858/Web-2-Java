import { useState } from 'react'
import { Link } from 'react-router-dom'

interface RegisterFormProps {
  onSubmit: (userName: string, userPassword: string, firstName: string, lastName: string, email: string, phoneNumber: string) => Promise<void>
  isLoading?: boolean
}

export const RegisterForm = ({ onSubmit, isLoading = false }: RegisterFormProps) => {
  const [userName, setUserName] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userName || !userPassword || !firstName || !lastName) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }

    if (userPassword !== confirmPassword) {
      setError('Mật khẩu không khớp')
      return
    }

    if (userPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      await onSubmit(userName, userPassword, firstName, lastName, email, phoneNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Đăng Ký</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tên Người Dùng *</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Họ *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="Họ"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tên *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="Tên"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Số Điện Thoại</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Mật Khẩu *</label>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Xác Nhận Mật Khẩu *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">* Trường bắt buộc</p>
      </div>
    </div>
  )
}
