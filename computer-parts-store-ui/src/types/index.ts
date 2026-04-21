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
}

export interface AuthResponse {
  token: string
  user: User
}

// Product types
export interface Product {
  id: string
  name: string
  productName?: string
  description: string
  category: string | { id: string; name: string }
  categoryId?: string
  price: number
  discount?: number
  discountPercentage?: number
  stock: number
  stockStatus?: number
  image?: string
  featuredImage?: string
  productImages?: string
  specifications?: Record<string, string> | string
  rating?: number
  reviews?: number
  reviewCount?: number
  createdAt?: Date
  updatedAt?: Date
  // PC Component-specific fields
  brand?: string
  warranty?: string
  compatibility?: string
  powerConsumption?: string
  specsDimensions?: string
  weightKg?: number
  sku?: string
  isFeatured?: boolean
  isBestseller?: boolean
}

export interface ProductFilter {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  rating?: number
}

// Order types
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  discount?: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalPrice: number
  discount?: number
  finalPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  shippingAddress: string
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderRequest {
  items: OrderItem[]
  shippingAddress: string
  paymentMethod: string
}

// Payment types
export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER'
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
