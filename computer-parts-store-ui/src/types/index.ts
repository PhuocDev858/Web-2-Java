// User types
export interface User {
  userId: string
  userName: string
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  roleName: string
  loggedIn?: boolean
}

export interface AuthCredentials {
  userName: string
  userPassword: string
}

export interface RegisterData {
  userName: string
  userPassword: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  address?: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Product types
export interface Product {
  id?: string | number
  sku?: string
  name: string
  productName?: string
  description?: string
  brand?: string
  category?: { id: string | number; name: string }
  categoryId?: string | number
  categoryName?: string
  price: number
  quantity?: number
  stock?: number
  specification?: string | Record<string, any>
  specifications?: string | Record<string, any>
  rating?: number
  reviews?: number
  reviewCount?: number
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  images?: ProductImage[]
  featuredImage?: string
  image?: string
  discount?: number
  compatibility?: string
  warranty?: string
}

export interface ProductImage {
  id?: string | number
  imageUrl: string
  displayOrder?: number
  isPrimary?: boolean
  createdAt?: Date | string
}

export interface ProductFilter {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  rating?: number
}

// ✅ Order types - khớp với OrderResponse từ backend
export interface OrderItem {
  id?: string | number
  productId: string | number
  productName: string
  quantity: number
  unitPrice: number   // ← backend trả unitPrice
  totalPrice?: number
  price?: number      // ← fallback
}

export interface Order {
  id: string | number
  userId: string | number
  orderNumber?: string     // ← backend có field này
  items: OrderItem[]
  totalPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  shippingAddress: string
  contactPhone?: string    // ← backend có field này
  paymentMethod?: string
  discount?: number
  finalPrice?: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface CreateOrderRequest {
  userId?: number
  items: OrderItem[]
  shippingAddress: string
  contactPhone?: string
  paymentMethod?: string
}

// Payment types
export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  method: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentRequest {
  orderId: string
  amount: number
  method: string
  cardToken?: string
}

// Cart types
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// Recommendation types
export interface Recommendation {
  productId: string
  product: Product
  score: number
  reason: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}