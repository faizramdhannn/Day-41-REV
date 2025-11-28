# E-Commerce API Documentation

Base URL: `http://localhost:3000/api`

---

## 1. Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/profile` | Private | Get current user profile |
| PUT | `/auth/password` | Private | Update user password |

---

## 2. Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Private | Get all users (paginated) |
| GET | `/users/:id` | Private | Get user by ID |
| PUT | `/users/:id` | Private | Update user |
| DELETE | `/users/:id` | Private | Delete user |
| GET | `/users/:id/addresses` | Private | Get user addresses |
| POST | `/users/:id/addresses` | Private | Add user address |
| PUT | `/users/:id/addresses/:addressId` | Private | Update user address |
| DELETE | `/users/:id/addresses/:addressId` | Private | Delete user address |

---

## 3. Products

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/products` | Public | Get all products (paginated, filterable) |
| GET | `/products/:id` | Public | Get product by ID |
| POST | `/products` | Private | Create new product |
| PUT | `/products/:id` | Private | Update product |
| DELETE | `/products/:id` | Private | Delete product |
| GET | `/products/categories` | Public | Get all categories |
| GET | `/products/brands` | Public | Get all brands |

**Query Parameters for GET /products:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by product name
- `category_id` - Filter by category
- `brand_id` - Filter by brand
- `min_price` - Minimum price
- `max_price` - Maximum price

---

## 4. Cart

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/cart` | Private | Get user cart |
| POST | `/cart/items` | Private | Add item to cart |
| PUT | `/cart/items/:id` | Private | Update cart item quantity |
| DELETE | `/cart/items/:id` | Private | Remove item from cart |
| DELETE | `/cart/clear` | Private | Clear all cart items |

---

## 5. Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/orders` | Private | Get all user orders (paginated) |
| GET | `/orders/:id` | Private | Get order by ID |
| POST | `/orders` | Private | Create new order (checkout) |
| PATCH | `/orders/:id/status` | Private | Update order status |
| PATCH | `/orders/:id/complete` | Private | Complete order (DELIVERED → COMPLETED) |
| PATCH | `/orders/:id/cancel` | Private | Cancel order (PENDING/PAID → CANCELED) |
| POST | `/orders/:id/payment` | Private | Create payment (PENDING → PAID) |
| POST | `/orders/:id/shipment` | Private | Create shipment (PAID → SHIPPED) |
| PATCH | `/orders/:id/shipment/status` | Private | Update shipment status |

**Order Status Flow:**
```
PENDING → PAID → SHIPPED → DELIVERED → COMPLETED
         ↓
      CANCELED
```

**Query Parameters for GET /orders:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

---

## 6. Payments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/payments` | Private | Get all payments (paginated) |
| GET | `/payments/:id` | Private | Get payment by ID |
| POST | `/payments` | Private | Create payment |
| PUT | `/payments/:id` | Private | Update payment |
| DELETE | `/payments/:id` | Private | Delete payment |

**Query Parameters for GET /payments:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

---

## 7. Shipments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/shipments` | Private | Get all shipments (paginated) |
| GET | `/shipments/:id` | Private | Get shipment by ID |
| GET | `/shipments/track/:tracking_number` | Public | Track shipment by tracking number |
| POST | `/shipments` | Private | Create shipment |
| PUT | `/shipments/:id` | Private | Update shipment |
| DELETE | `/shipments/:id` | Private | Delete shipment |

**Query Parameters for GET /shipments:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by shipment status

**Shipment Status:**
- `WAITING_PICKUP` - Waiting for courier pickup
- `PICKED_UP` - Picked up by courier
- `IN_TRANSIT` - In transit/delivery
- `DELIVERED` - Delivered to customer

---

## Authentication

All **Private** endpoints require authentication token in header:

```
Authorization: Bearer <token>
```

Get token from:
- `POST /auth/register` response
- `POST /auth/login` response

---

## Response Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Total Endpoints: 43

- **Authentication:** 4 endpoints
- **Users:** 8 endpoints
- **Products:** 7 endpoints
- **Cart:** 5 endpoints
- **Orders:** 9 endpoints
- **Payments:** 5 endpoints
- **Shipments:** 6 endpoints