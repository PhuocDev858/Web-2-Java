# Frontend - Backend Connection Guide

## Current Setup

### Frontend Configuration ✅
- **Port:** 3000
- **API Base URL:** `http://localhost:8900/api`
- **Environment:** `.env.local` configured
- **Timeout:** 30 seconds

### API Gateway ✅
- **Port:** 8900 (NOT 8080)
- **CORS:** Enabled for localhost:3000
- **Routes:** Auto-routing to microservices

### API Endpoints (After API Gateway Routing)

#### Authentication (User Service - 8081)
```
POST   /accounts/login         # User login (was /auth/login)
POST   /accounts/register      # User registration (was /auth/register)
GET    /accounts/profile       # Get current user profile
PUT    /accounts/profile       # Update user profile
```

#### Products (Product Catalog Service - 8082)
```
GET    /products               # List all products (paginated)
GET    /products/{id}          # Get product details
GET    /products/search        # Search products
GET    /products/category/{name} # Get products by category
GET    /products/categories    # Get all categories
POST   /products               # Create product (admin)
PUT    /products/{id}          # Update product (admin)
DELETE /products/{id}          # Delete product (admin)
```

#### Orders (Order Service - 8083)
```
GET    /orders                 # List all orders (paginated)
GET    /orders/{id}            # Get order details
GET    /orders/user/{userId}   # Get user's orders
POST   /orders                 # Create order
PATCH  /orders/{id}/status     # Update order status
PATCH  /orders/{id}/cancel     # Cancel order
```

#### Users (User Service - 8081)
```
GET    /accounts               # List all users (admin)
GET    /accounts/{id}          # Get user by ID
PUT    /accounts/{id}          # Update user (admin)
DELETE /accounts/{id}          # Delete user (admin)
```

#### Payments (Payment Service - 8084)
```
POST   /payments               # Create payment
GET    /payments/{id}          # Get payment details
GET    /payments/verify/{txnId} # Verify payment
POST   /payments/{id}/refund   # Refund payment
```

#### Recommendations (Recommendation Service - 8085)
```
GET    /review/user/{userId}       # Get recommendations for user (was /recommendations/user)
GET    /review/product/{id}        # Get similar products (was /recommendations/product)
GET    /review/trending            # Get trending products (was /recommendations/trending)
```

## API Gateway Configuration Required

Your API Gateway (running on port 8080) needs to route requests to appropriate services:

### Routes Configuration Example

```yaml
# API Gateway routing configuration
routes:
  - id: auth
    uri: lb://user-service:8081
    predicates:
      - Path=/auth/**
    filters:
      - StripPrefix=0

  - id: users
    uri: lb://user-service:8081
    predicates:
      - Path=/users/**
    filters:
      - StripPrefix=0

  - id: products
    uri: lb://product-catalog-service:8082
    predicates:
      - Path=/products/**
    filters:
      - StripPrefix=0

  - id: orders
    uri: lb://order-service:8083
    predicates:
      - Path=/orders/**
    filters:
      - StripPrefix=0

  - id: payments
    uri: lb://payment-service:8084
    predicates:
      - Path=/payments/**
    filters:
      - StripPrefix=0

  - id: recommendations
    uri: lb://product-recommendation-service:8085
    predicates:
      - Path=/recommendations/**
    filters:
      - StripPrefix=0
```

## CORS Configuration

### On Each Microservice (if not configured in API Gateway)

Add this to each Spring Boot service:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Or on API Gateway

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class GatewayCorsConfiguration {
    
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.addAllowedOrigin("http://localhost:3000");
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}
```

## Testing Connection

### 1. Check Backend is Running
```bash
# Test API Gateway
curl -X GET http://localhost:8080/products

# Test Product Service directly
curl -X GET http://localhost:8082/products
```

### 2. Check Frontend Connection (in browser console)
```javascript
// Open browser DevTools (F12) → Console tab
// Try fetching a product
fetch('/api/products')
  .then(r => r.json())
  .then(d => console.log('Products:', d))
  .catch(e => console.error('Error:', e))
```

### 3. Monitor Network Requests
- Open DevTools → Network tab
- Try to login or browse products
- Check if requests are going to `/api/...`
- Verify responses have correct status codes

## Common Issues & Solutions

### Issue 1: 404 Not Found
**Cause:** API Gateway routing not configured
**Solution:** Verify API Gateway routes match the paths above

### Issue 2: CORS Error in Browser
**Cause:** API doesn't allow requests from localhost:3000
**Solution:** Add CORS configuration to API Gateway or services

### Issue 3: 401 Unauthorized
**Cause:** JWT token not sent or expired
**Solution:** Make sure token is in localStorage after login

### Issue 4: Connection Refused
**Cause:** Backend services not running
**Solution:** Start all Java services + API Gateway

### Issue 5: Timeout
**Cause:** Services taking too long to respond
**Solution:** Check service logs, increase timeout in `.env.local`

## Debugging Steps

1. **Check all services are running:**
   ```bash
   curl http://localhost:8761  # Eureka
   ```

2. **Check API Gateway routes:**
   Access API Gateway health/actuator endpoints to verify routing

3. **Check service endpoints:**
   ```bash
   curl http://localhost:8081/users/all  # User Service
   curl http://localhost:8082/products   # Product Service
   ```

4. **Monitor backend logs for errors**

5. **Check frontend browser console for API errors**

## Running Frontend

```bash
# Navigate to frontend directory
cd computer-parts-store-ui

# Start development server (with HMR)
npm run dev

# Access at http://localhost:3000
```

## Verify Connection Works

1. Open http://localhost:3000 in browser
2. Go to Products page
3. Open DevTools → Network tab
4. Check if products load (look for `/api/products` requests)
5. Try login (check `/api/auth/login` request)
6. Try adding to cart (should work without backend)

---

**Last Updated:** April 13, 2026
