# 🔧 Lịch sử sửa chữa - Khớp Frontend với Backend Login

**Ngày:** April 13, 2026  
**Người sửa:** GitHub Copilot  
**Vấn đề:** Frontend sử dụng `email` + `password` nhưng backend User Service mong đợi `userName` + `userPassword`

---

## ❌ Vấn đề Phát Hiện

### Database User Service:
```sql
users table:
- id: 7
- user_name: admin
- user_password: admin123
- active: 1
- role_id: 1
```

### Backend LoginController:
- **Endpoint:** `/auth/login` (POST)
- **Mong đợi:** `LoginRequest` với `{userName, userPassword}`
- **Trả về:** `LoginResponse` với `{userId, userName, email, firstName, lastName, phoneNumber, roleName, token, success, message}`

### Frontend (CŨ - SAI):
- **Gửi:** `/api/accounts/login` với `{email, password}`
- **Mong đợi:** `{id, username, email, fullName, ...}`

---

## ✅ Các Thay Đổi Đã Thực Hiện

### 1. **API Gateway** - Fix Routing
**File:** `e-commerce-microservices/api-gateway/src/main/resources/application.properties`

```properties
# TRƯỚC:
spring.cloud.gateway.routes[0].filters[0]=StripPrefix=2

# SAU:
spring.cloud.gateway.routes[0].filters[0]=StripPrefix=2
spring.cloud.gateway.routes[0].filters[1]=RewritePath=/api/accounts/(?<segment>.*), /auth/$\{segment}
```

**Giải thích:**
- Bây giờ `/api/accounts/login` sẽ được forward đến `/auth/login` trên User Service ✅

---

### 2. **LoginController** - Add @PostMapping Endpoint
**File:** `e-commerce-microservices/user-service/src/main/java/.../controller/LoginController.java`

```java
// TRƯỚC:
@RestController
@RequestMapping("/auth")
public class LoginController {
    @PostMapping("/login")
```

// SAU:
```java
@RestController
public class LoginController {
    @PostMapping("/auth/login")
```

**Giải thích:**
- Rõ ràng hơn, endpoint đầy đủ là `/auth/login` ✅

---

### 3. **Frontend Types** - Align with Database
**File:** `computer-parts-store-ui/src/types/index.ts`

```typescript
// TRƯỚC:
export interface User {
  id: string
  username: string
  email: string
  fullName: string
  // ...
}

export interface AuthCredentials {
  email: string
  password: string
}

// SAU:
export interface User {
  userId: string
  userName: string
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  roleName: string
}

export interface AuthCredentials {
  userName: string
  userPassword: string
}
```

---

### 4. **Auth Service** - Parse LoginResponse
**File:** `computer-parts-store-ui/src/services/auth.service.ts`

```typescript
// TRƯỚC: Gửi {email, password} directly

// SAU: Gửi đúng field names + parse response
login: async (credentials: AuthCredentials) => {
  const response = await apiClient.post('/accounts/login', {
    userName: credentials.userName,
    userPassword: credentials.userPassword,
  })
  
  const user: User = {
    userId: response.data.userId,
    userName: response.data.userName,
    // ... map từng field
  }
  
  return { token: response.data.token, user }
}
```

---

### 5. **LoginForm Component** - Input userName
**File:** `computer-parts-store-ui/src/components/auth/LoginForm.tsx`

```typescript
// TRƯỚC: Nhập email
// SAU: Nhập userName

<div>
  <label>Tên Người Dùng</label>
  <input
    type="text"
    value={userName}
    placeholder="admin"  <!-- Demo user -->
  />
</div>

<div>
  <label>Mật Khẩu</label>
  <input
    type="password"
    value={userPassword}
    placeholder="••••••••"
  />
</div>

<!-- Demo credentials display -->
<div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
  <p><strong>Demo Admin:</strong></p>
  <p>Tên: <code>admin</code></p>
  <p>Mật khẩu: <code>admin123</code></p>
</div>
```

---

### 6. **RegisterForm & RegisterPage** - Update Register Flow
**Files:**
- `computer-parts-store-ui/src/components/auth/RegisterForm.tsx`
- `computer-parts-store-ui/src/pages/RegisterPage.tsx`

```typescript
// TRƯỚC: Tham số (username, email, fullName, password)

// SAU: Tham số (userName, userPassword, firstName, lastName, email, phoneNumber)

// RegisterForm nhập:
- Tên Người Dùng (userName)
- Họ (lastName)
- Tên (firstName)
- Email (optional)
- Số Điện Thoại (optional)
- Mật Khẩu (userPassword)
- Xác Nhận Mật Khẩu
```

---

## 🧪 Cách Test

### 1. **Restart Backend Services** (nếu Gateway đã thay đổi)
```bash
# Terminal User Service
cd e-commerce-microservices/user-service
mvn spring-boot:run

# Terminal API Gateway (nếu sửa)
cd e-commerce-microservices/api-gateway
mvn spring-boot:run
```

### 2. **Start Frontend**
```bash
cd computer-parts-store-ui
npm run dev
```

### 3. **Test Login**
```
URL: http://localhost:3000/login
Tên: admin
Mật khẩu: admin123

Expected Result:
- ✅ 200 OK response từ /api/accounts/login
- ✅ JWT token trong localStorage
- ✅ User info lưu vào Redux state
- ✅ Redirect về trang home
```

### 4. **Kiểm tra Browser DevTools**
```
Network Tab:
- POST http://localhost:3000/api/accounts/login
- Request Body: {"userName":"admin","userPassword":"admin123"}
- Response: {userId, userName, token, success: true}

Application Tab:
- localStorage.authToken = "jwt_token_here"
- localStorage.user = {userId, userName, ...}
```

---

## 📝 Summary

| Thành phần | Trước | Sau | Trạng thái |
|-----------|-------|-----|----------|
| Frontend request | `{email, password}` | `{userName, userPassword}` | ✅ Fixed |
| Backend endpoint | Không khớp | `/auth/login` | ✅ Fixed |
| API Gateway route | Không forward đúng | RewritePath thêm | ✅ Fixed |
| User Type | `id, username, email` | `userId, userName, firstName` | ✅ Fixed |
| LoginForm input | Email field | UserName field | ✅ Fixed |
| Response parsing | Chưa xử lý | Map LoginResponse fields | ✅ Fixed |

---

## 🚀 Status: READY TO TEST

Tất cả các endpoint, request/response body, và type definitions đều đã được khớp với nhau.  
Hãy chạy `npm run dev` và test login flow!

### Demo Credentials:
- **Username:** `admin`
- **Password:** `admin123`
