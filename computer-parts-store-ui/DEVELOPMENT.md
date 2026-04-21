# Development Guidelines

## Code Style & Best Practices

### TypeScript
- Always use TypeScript for type safety
- Define interfaces in `src/types/`
- Avoid `any` type unless absolutely necessary
- Use strict mode in tsconfig

```typescript
// Bad
const handleData = (data: any) => {}

// Good
interface UserData {
  id: string
  name: string
}
const handleData = (data: UserData) => {}
```

### React Components
- Use functional components with hooks
- Keep components focused on single responsibility
- Extract logic into custom hooks
- Use React.memo() for optimization when needed

```typescript
// src/components/ProductCard.tsx
interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div>
      {/* component JSX */}
    </div>
  )
}
```

### State Management
- Use Redux for global state (auth, cart)
- Use React state for component-local state
- Create Redux slices in `src/store/`
- Use Redux hooks: `useAppDispatch`, `useAppSelector`

```typescript
// Good Redux usage
const dispatch = useAppDispatch()
const { user } = useAppSelector(state => state.auth)

dispatch(loginSuccess({ user, token }))
```

### API Integration
- Use services in `src/services/`
- Always handle errors
- Show loading states
- Implement proper error boundaries

```typescript
// src/services/product.service.ts
export const productService = {
  getAll: async (page = 0, size = 12): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(`/products?page=${page}&size=${size}`)
    return response.data
  }
}
```

### Styling with Tailwind
- Use Tailwind classes for styling
- Create reusable component styles in `index.css`
- Follow mobile-first approach

```typescript
// Mobile-first responsive design
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Component */}
</div>
```

### Error Handling
- Use ErrorBoundary for component-level errors
- Implement try-catch for async operations
- Display user-friendly error messages

```typescript
try {
  const data = await productService.getAll()
  setState(data)
} catch (error) {
  setError(error instanceof Error ? error.message : 'Unknown error')
}
```

## File Organization

### Naming Conventions
- Components: PascalCase (e.g., `ProductCard.tsx`)
- Functions/utilities: camelCase (e.g., `formatPrice.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)
- Types/Interfaces: PascalCase (e.g., `Product`, `CartItem`)

### Import Organization
```typescript
// 1. External libraries
import React from 'react'
import { useNavigate } from 'react-router-dom'

// 2. Internal absolute imports
import { ProductCard } from '@/components/products/ProductCard'
import { productService } from '@/services/product.service'
import type { Product } from '@/types'

// 3. Styles
import './ProductCard.css'
```

## Git Workflow

### Branch Naming
- Feature: `feature/user-authentication`
- Fix: `fix/cart-calculation`
- Chore: `chore/update-dependencies`

### Commit Messages
```
feat: add product search functionality
fix: correct cart total calculation
docs: update README with setup instructions
style: format code with prettier
refactor: extract product filtering logic
test: add unit tests for product service
```

## Testing Checklist

Before submitting a PR:
- [ ] Component renders correctly
- [ ] No TypeScript errors
- [ ] All API calls work
- [ ] Responsive on mobile/tablet/desktop
- [ ] Error states handled
- [ ] Loading states present
- [ ] No console errors

## Performance Tips

1. **Code Splitting**
   ```typescript
   const HomePage = lazy(() => import('@/pages/HomePage'))
   ```

2. **Memoization**
   ```typescript
   export const ProductCard = React.memo(({ product }: ProductCardProps) => {
     return <div>{product.name}</div>
   })
   ```

3. **Image Optimization**
   - Use appropriate image sizes
   - Consider lazy loading for product images

4. **Bundle Analysis**
   ```bash
   npm run build -- --analyzer
   ```

## Common Patterns

### Custom Hooks
```typescript
// src/hooks/useProducts.ts
export const useProducts = (page = 0) => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productService.getAll(page)
        setProducts(data.content)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [page])

  return { products, isLoading, error }
}
```

### Conditional Rendering
```typescript
// Good
{isLoading ? (
  <Loading />
) : error ? (
  <ErrorMessage message={error} />
) : (
  <ProductList products={products} />
)}

// Avoid complex ternaries
```

### Event Handlers
```typescript
// Always type event handlers
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}

const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  // Handle submit
}
```

## Debugging Tips

### Redux DevTools
1. Install Redux DevTools browser extension
2. Check state changes over time
3. Replay actions for debugging

### Console Logging
```typescript
// During development
console.log('Product loaded:', product)

// Don't forget to remove before production
```

### Network Debugging
1. Open DevTools Network tab
2. Check API requests/responses
3. Verify headers and payload

## Documentation

### JSDoc Comments for Complex Functions
```typescript
/**
 * Formats a price in VND currency
 * @param price - The price in numbers
 * @returns Formatted price string (e.g., "1.000.000 ₫")
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}
```

### Component Documentation
```typescript
/**
 * ProductCard Component
 * 
 * Displays a single product with image, price, and action buttons
 * 
 * @component
 * @example
 * const product = { id: '1', name: 'CPU', price: 5000000 }
 * return <ProductCard product={product} onAddToCart={handleAdd} />
 */
export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // ...
}
```

## IDE Setup

### Recommended Extensions
- ESLint
- Prettier
- TypeScript Vue Plugin
- Tailwind CSS IntelliSense
- Redux DevTools
- Thunder Client (API testing)

### Settings (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Troubleshooting

### Issue: API requests failing
- Check if API Gateway is running on port 8080
- Verify network tab in DevTools
- Check Axios interceptors

### Issue: Redux state not updating
- Check if action is dispatched
- Verify state slice reducer
- Check Redux DevTools extension

### Issue: Components not re-rendering
- Check dependency arrays in useEffect
- Use correct Redux selector
- Verify state change in DevTools

### Issue: TypeScript errors
- Run `tsc --noEmit` to check types
- Check tsconfig.json paths
- Verify import statements

## Production Checklist

- [ ] Build passes with no errors: `npm run build`
- [ ] No console errors or warnings
- [ ] All TypeScript types correct
- [ ] Environment variables set
- [ ] API URLs pointing to production
- [ ] Assets optimized
- [ ] Performance acceptable
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] Security headers configured
- [ ] Analytics configured
- [ ] Error tracking enabled

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev/)

---

**Last Updated:** April 13, 2026
