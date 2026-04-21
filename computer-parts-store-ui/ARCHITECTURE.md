# Computer Parts Store - Full Architecture

## Project Overview

This is a complete microservices-based e-commerce platform for selling computer components. It consists of backend microservices and this modern React UI.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Web Browser (User)                          │
│              computer-parts-store-ui (React)                 │
└─────────────────────────────────────────────────────────────┘
                          ↓↑
              (HTTP/REST API on :3000)
                          ↓↑
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Port 8080)                    │
│        (Spring Cloud Gateway - Service Router)               │
└─────────────────────────────────────────────────────────────┘
         ↓↑           ↓↑           ↓↑           ↓↑
     ┌────────┐   ┌─────────┐  ┌────────┐  ┌──────────┐
     │ Eureka │   │  User   │  │ Product│  │  Order   │
     │ Server │   │ Service │  │Catalog │  │ Service  │
     │(Port   │   │(Port    │  │Service │  │(Port     │
     │ 8761)  │   │ 8081)   │  │(Port   │  │ 8083)    │
     └────────┘   └─────────┘  │ 8082)  │  └──────────┘
                                └────────┘
                  ↓↑           ↓↑
         ┌─────────────────┐  ┌──────────────────┐
         │ Payment Service │  │ Recommendation   │
         │ (Port 8084)     │  │ Service          │
         └─────────────────┘  │ (Port 8085)      │
                              └──────────────────┘
                  ↓↑           ↓↑
         ┌──────────────────┐  ┌──────────┐
         │ MySQL Databases  │  │  Redis   │
         │ (for services)   │  │ (Cache)  │
         └──────────────────┘  └──────────┘
```

## Backend Services (e-commerce-microservices/)

### 1. **Eureka Server** (Service Discovery)
- **Port:** 8761
- **Purpose:** Central registry for all microservices
- **Technology:** Spring Cloud Eureka
- **URL:** http://localhost:8761

### 2. **API Gateway** (Request Router)
- **Port:** 8080
- **Purpose:** Single entry point for all client requests
- **Technology:** Spring Cloud Gateway
- **Features:** 
  - Request routing
  - Load balancing
  - Authentication
  - Rate limiting

### 3. **User Service** (User Management)
- **Port:** 8081
- **Purpose:** User authentication, registration, profile management
- **Database:** MySQL
- **Key Endpoints:**
  ```
  POST   /auth/login
  POST   /auth/register
  GET    /users/profile
  PUT    /users/profile
  GET    /users/{id}
  ```
- **Features:** JWT authentication

### 4. **Product Catalog Service** (Product Management)
- **Port:** 8082
- **Purpose:** Browse, search, and manage products
- **Database:** MySQL
- **Key Endpoints:**
  ```
  GET    /products                 (List all products)
  GET    /products/{id}            (Get product details)
  GET    /products/search          (Search products)
  GET    /products/category/{name} (Filter by category)
  POST   /products                 (Admin: Create)
  PUT    /products/{id}            (Admin: Update)
  DELETE /products/{id}            (Admin: Delete)
  ```

### 5. **Order Service** (Order Management)
- **Port:** 8083
- **Purpose:** Create, track, and manage orders
- **Database:** MySQL
- **Cache:** Redis
- **Key Endpoints:**
  ```
  GET    /orders                   (List orders)
  GET    /orders/{id}              (Get order details)
  GET    /orders/user/{userId}     (User orders)
  POST   /orders                   (Create order)
  PATCH  /orders/{id}/status       (Update status)
  PATCH  /orders/{id}/cancel       (Cancel order)
  ```

### 6. **Payment Service** (Payment Processing)
- **Port:** 8084
- **Purpose:** Handle payment processing
- **Database:** MySQL
- **Key Endpoints:**
  ```
  POST   /payments                 (Process payment)
  GET    /payments/{id}            (Get payment details)
  GET    /payments/verify/{txnId}  (Verify payment)
  POST   /payments/{id}/refund     (Refund payment)
  ```

### 7. **Product Recommendation Service** (Recommendations)
- **Port:** 8085
- **Purpose:** AI-powered product recommendations
- **Database:** MySQL
- **Key Endpoints:**
  ```
  GET    /recommendations/user/{userId}     (User recommendations)
  GET    /recommendations/product/{id}      (Similar products)
  GET    /recommendations/trending          (Trending products)
  ```

## Frontend Application (computer-parts-store-ui/)

### Tech Stack
- **Framework:** React 18.2
- **Language:** TypeScript 5.2
- **Build Tool:** Vite 5.0
- **State Management:** Redux Toolkit 1.9
- **Routing:** React Router 6.20
- **HTTP Client:** Axios 1.6
- **Styling:** Tailwind CSS 3.3
- **Icons:** Lucide React 0.292

### Project Structure

```
computer-parts-store-ui/
├── src/
│   ├── components/              # Reusable components
│   │   ├── auth/               # LoginForm, RegisterForm
│   │   ├── common/             # Header, Footer, Layout, Loading
│   │   ├── orders/             # CartItemComponent
│   │   └── products/           # ProductCard
│   │
│   ├── pages/                  # Full page components
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── services/               # API integration
│   │   ├── api.ts              # Axios client
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── user.service.ts
│   │   └── recommendation.service.ts
│   │
│   ├── store/                  # Redux state management
│   │   ├── store.ts            # Store configuration
│   │   ├── hooks.ts            # Redux hooks
│   │   ├── auth.slice.ts       # Auth state
│   │   └── cart.slice.ts       # Cart state
│   │
│   ├── types/                  # TypeScript interfaces
│   │   └── index.ts            # All type definitions
│   │
│   ├── utils/                  # Utility functions
│   │   ├── format.ts           # Format helpers
│   │   └── ErrorBoundary.tsx   # Error handling
│   │
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
│
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
├── package.json                # Dependencies
└── README.md                   # Documentation
```

### Key Pages

1. **Home Page** (`/`)
   - Featured products
   - Hero section
   - Product grid

2. **Products Page** (`/products`)
   - Product listing with pagination
   - Category filtering
   - Price range filtering
   - Search functionality

3. **Product Detail** (`/products/:id`)
   - Full product information
   - Product specifications
   - Add to cart
   - Wishlist

4. **Shopping Cart** (`/cart`)
   - View cart items
   - Update quantities
   - Remove items
   - Order summary
   - Checkout link

5. **Login** (`/login`)
   - Email & password login
   - Registration link

6. **Register** (`/register`)
   - Create new account
   - Form validation
   - Login link

## Setup & Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- All backend services running

### Step 1: Navigate to Project
```bash
cd computer-parts-store-ui
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

Server runs on: http://localhost:3000

### Step 4: Build for Production
```bash
npm run build
```

Output: `dist/`

## API Integration Flow

```
User Action
    ↓
UI Component
    ↓
Redux Action → Store
    ↓
Service Layer (e.g., productService.getAll())
    ↓
Axios HTTP Request
    ↓
Dev Server Proxy (/api → localhost:8080)
    ↓
API Gateway
    ↓
Microservice (e.g., Product Catalog Service)
    ↓
Database Response
    ↓
Response Back to UI
    ↓
UI Update
```

## State Management

### Redux Store Structure
```
store
├── auth                    # User authentication state
│   ├── user               # Current logged-in user
│   ├── token              # JWT token
│   ├── isAuthenticated    # Auth status
│   ├── isLoading          # Loading state
│   └── error              # Error message
│
└── cart                    # Shopping cart state
    ├── items              # Cart items with products
    ├── totalItems         # Total quantity
    └── totalPrice         # Total amount
```

## Authentication Flow

1. **User Login/Register**
   - Submit credentials to User Service
   - Receive JWT token
   - Store token in localStorage
   - Store user info in Redux

2. **Token Management**
   - Token sent with every request in Authorization header
   - Expired token triggers logout and redirect to login

3. **Protected Routes** (Ready to implement)
   - Check Redux auth state
   - Redirect to login if not authenticated

## Data Flow Examples

### Adding Product to Cart
```
ProductCard Component
    ↓
onAddToCart() called
    ↓
dispatch(addToCart({product, quantity}))
    ↓
Redux cart.slice updates state
    ↓
Cart state updated
    ↓
Header shows updated cart count
```

### Fetching Products
```
ProductsPage component mounted
    ↓
useEffect triggers productService.getAll()
    ↓
Axios makes GET request to /api/products
    ↓
Routed to Product Catalog Service
    ↓
Service queries MySQL
    ↓
Returns paginated response
    ↓
setState(products)
    ↓
Re-render ProductCard components
```

## Environment Configuration

Create `.env.local` file:
```env
# API Configuration
VITE_API_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
```

## Debugging

### Browser DevTools
- Redux DevTools Extension (for state debugging)
- Network tab (API calls)
- Console (errors/logs)

### Common Issues
1. **CORS errors** → Check API Gateway configuration
2. **401 Unauthorized** → Token expired, need re-login
3. **404 Not Found** → Service not running or wrong endpoint

## Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- Caching with Redis (backend)
- Memoization with React.memo()
- Redux DevTools for state analysis

## Security Features

- JWT token authentication
- Secure token storage (localStorage)
- HTTPS ready
- Input validation
- Error boundaries

## Future Enhancements

- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order history and tracking
- [ ] Admin dashboard
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Real-time notifications
- [ ] User recommendations
- [ ] Advanced search with filters
- [ ] Mobile app (React Native)
- [ ] Analytics and reporting

## Deployment

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to web server
3. Configure environment variables

### Backend Deployment
- Follow deployment instructions in each microservice

## Support & Contact

For issues, questions, or contributions, please contact the project team.

---

**Last Updated:** April 13, 2026
**Version:** 1.0.0
