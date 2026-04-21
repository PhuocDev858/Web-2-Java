# Frontend Quick Start

## Prerequisites
- All backend services running (Eureka, API Gateway, microservices)
- Node.js 16+ installed
- Dependencies installed (`npm install` completed)

## Backend Services Status Check

Make sure all these are running:
- ✅ **Eureka Server** → http://localhost:8761
- ✅ **API Gateway** → http://localhost:8080
- ✅ **User Service** → http://localhost:8081
- ✅ **Product Catalog Service** → http://localhost:8082
- ✅ **Order Service** → http://localhost:8083
- ✅ **Payment Service** → http://localhost:8084
- ✅ **Recommendation Service** → http://localhost:8085

## Start Frontend

```bash
# Navigate to project
cd computer-parts-store-ui

# Start development server
npm run dev
```

You should see:
```
VITE v5.0.2 ready in 234 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

## Access Frontend

Open your browser to: **http://localhost:3000**

## Features to Test

### 1. **Browse Products** ✅
- Go to http://localhost:3000/products
- Should load products from backend
- Check DevTools Network tab → `/api/products` should succeed

### 2. **View Product Details** ✅
- Click on a product
- Should load full product info from backend

### 3. **Search Products** ✅
- Try the search functionality
- Should query `/api/products/search`

### 4. **Shopping Cart** ✅
- Add products to cart
- Works locally (no backend needed yet)

### 5. **Login** ✅
- Go to http://localhost:3000/login
- Try logging in with test credentials
- Check if `/api/auth/login` succeeds

### 6. **Admin Panel** ✅
- After login as ADMIN → http://localhost:3000/admin
- Dashboard should load orders and products from backend
- Try creating/editing products

## Development Server Features

- **Hot Module Replacement (HMR)** - Auto-refresh on code changes
- **Fast Refresh** - Preserves component state
- **Proxy to Backend** - `/api/*` automatically routed to `http://localhost:8080`

## Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

### API Connection Error
1. Check API Gateway is running on port 8080
2. Open DevTools (F12) → Network tab
3. Check `/api/products` requests status
4. See BACKEND_INTEGRATION.md for detailed setup

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check ESLint issues
npm run lint
```

## Environment Configuration

File: `.env.local`
```env
VITE_API_URL=/api
VITE_API_TIMEOUT=30000
```

Edit this file to change API settings.

## Useful Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for lint errors
npm run lint

# Check TypeScript types
npx tsc --noEmit
```

## Project Structure

```
computer-parts-store-ui/
├── src/
│   ├── pages/           # Full page components
│   ├── components/      # Reusable components
│   ├── services/        # API integration
│   ├── store/           # Redux state
│   ├── types/           # TypeScript types
│   ├── utils/           # Helpers
│   ├── App.tsx          # Main component
│   └── main.tsx         # Entry point
├── .env.local           # Environment config
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## Browser DevTools Tips

### Redux DevTools
1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
2. Open DevTools (F12) → Redux tab
3. See state changes in real-time
4. Time-travel debug through actions

### Network Tab
- Monitor all API requests
- Check request/response headers
- Verify JWT token is sent
- Check response status codes

### Console
- View error stack traces
- Log debugging info
- Test quick API calls

## Help & Documentation

- **API Integration**: See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
- **Admin Panel**: Features documented in [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Development Guide**: See [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Project Setup**: See [SETUP.md](./SETUP.md)

---

**Ready to start?** Run `npm run dev` 🚀
