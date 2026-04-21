# Computer Parts Store UI

Modern web application for browsing and purchasing computer components.

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Run for testing
```bash
npm run preview
```

## Project Architecture

This project follows a clean, scalable architecture:

- **src/pages/** - Page components (full page views)
- **src/components/** - Reusable UI components
  - **common/** - Shared components (Header, Footer, Layout)
  - **products/** - Product-related components
  - **orders/** - Order/cart components
  - **auth/** - Authentication forms
- **src/services/** - API integration layer
- **src/store/** - Redux state management
- **src/types/** - TypeScript interfaces
- **src/utils/** - Utility functions

## Key Features

✅ **Product Browsing**
- View all products with filtering
- Search functionality
- Category filtering
- Price range filtering

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Calculate totals

✅ **User Authentication**
- Login/Register
- JWT token management
- Protected routes (ready for implementation)

✅ **Responsive Design**
- Mobile-first approach
- Tailwind CSS styling
- Optimized for all devices

## API Integration

All API requests go through the API Gateway (http://localhost:8080).

### Available Services
- User Service (Authentication, Profiles)
- Product Catalog Service (Products)
- Order Service (Orders)
- Payment Service (Payments)
- Recommendation Service (Recommendations)

## Configuration

Environment variables in `.env.local`:
```
VITE_API_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
```

## Technologies

- React 18.2
- TypeScript 5.2
- Vite 5.0
- Redux Toolkit 1.9
- React Router 6.20
- Tailwind CSS 3.3
- Axios 1.6

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps

1. Implement protected routes
2. Add order management page
3. Create user account/profile page
4. Add admin dashboard
5. Implement payment integration
6. Add product recommendations
7. Add wishlist functionality
8. Add review/rating system
