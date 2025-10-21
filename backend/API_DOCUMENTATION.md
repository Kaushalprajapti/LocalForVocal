# API Documentation

## 📚 Complete API Reference

This document provides comprehensive documentation for all API endpoints in the E-Commerce backend system.

## 📋 Table of Contents

- [Base Information](#base-information)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Public Endpoints](#public-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Customer Endpoints](#customer-endpoints)
- [Analytics Endpoints](#analytics-endpoints)
- [Webhooks](#webhooks)

## 🌐 Base Information

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Content Type
All requests and responses use `application/json` unless specified otherwise.

### Response Format
All API responses follow this structure:

```json
{
  "success": true|false,
  "data": { ... },
  "message": "Human readable message",
  "pagination": { ... } // Only for paginated responses
}
```

## 🔐 Authentication

### JWT Token Authentication
Most endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Format
JWT tokens contain:
- **User ID**: Unique user identifier
- **Role**: User role (super-admin, admin, staff)
- **Expiration**: Token expiration time
- **Issued At**: Token creation time

### Token Refresh
Tokens expire after 30 days by default. To refresh:
1. Use the login endpoint with valid credentials
2. Receive a new token
3. Update client-side token storage

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **429**: Too Many Requests
- **500**: Internal Server Error

### Common Error Messages
- `"Authentication required"`: Missing or invalid token
- `"Insufficient permissions"`: User lacks required role
- `"Validation failed"`: Input validation errors
- `"Resource not found"`: Requested resource doesn't exist
- `"Rate limit exceeded"`: Too many requests

## 🌍 Public Endpoints

These endpoints don't require authentication.

### Health Check

#### GET /api/health
Check server health status.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Products

#### GET /api/products
Get paginated list of products.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `category` (string, optional): Filter by category ID
- `search` (string, optional): Search in name and description
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter
- `sortBy` (string, optional): Sort field (name, price, createdAt)
- `sortOrder` (string, optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "discountPrice": 79.99,
      "images": ["image_url_1", "image_url_2"],
      "stock": 50,
      "category": {
        "_id": "category_id",
        "name": "Category Name"
      },
      "ratings": {
        "average": 4.5,
        "count": 25
      },
      "favoriteCount": 10,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalProducts": 100,
    "hasNext": true,
    "hasPrev": false,
    "limit": 10
  }
}
```

#### GET /api/products/:id
Get single product by ID.

**Path Parameters:**
- `id` (string, required): Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Detailed product description",
    "price": 99.99,
    "discountPrice": 79.99,
    "images": ["image_url_1", "image_url_2"],
    "stock": 50,
    "maxOrderQuantity": 10,
    "sku": "PROD-001",
    "tags": ["tag1", "tag2"],
    "specifications": {
      "weight": "1kg",
      "dimensions": "10x10x10cm"
    },
    "category": {
      "_id": "category_id",
      "name": "Category Name"
    },
    "ratings": {
      "average": 4.5,
      "count": 25
    },
    "favoriteCount": 10,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/products/:id/favorite
Increment product favorite count.

**Path Parameters:**
- `id` (string, required): Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product added to favorites"
}
```

#### DELETE /api/products/:id/favorite
Decrement product favorite count.

**Path Parameters:**
- `id` (string, required): Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product removed from favorites"
}
```

### Categories

#### GET /api/categories
Get all active categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Category Name",
      "slug": "category-slug",
      "description": "Category description",
      "image": "category_image_url",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/categories/:id
Get single category by ID.

**Path Parameters:**
- `id` (string, required): Category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "name": "Category Name",
    "slug": "category-slug",
    "description": "Category description",
    "image": "category_image_url",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Orders

#### POST /api/orders
Create a new order.

**Request Body:**
```json
{
  "customerInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, State, 12345",
    "email": "john@example.com"
  },
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderId": "ORD-20240101-0001",
    "customerInfo": {
      "name": "John Doe",
      "phone": "+1234567890",
      "address": "123 Main St, City, State, 12345",
      "email": "john@example.com"
    },
    "items": [
      {
        "productId": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "quantity": 2,
        "image": "product_image_url",
        "sku": "PROD-001"
      }
    ],
    "totalAmount": 199.98,
    "status": "pending",
    "whatsappMessageSent": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Order created successfully"
}
```

## 👨‍💼 Admin Endpoints

These endpoints require admin authentication.

### Authentication

#### POST /api/admin/login
Admin login.

**Request Body:**
```json
{
  "username": "admin_username",
  "password": "admin_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "admin": {
      "_id": "admin_id",
      "username": "admin_username",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

### Products Management

#### GET /api/admin/products
Get all products with admin details.

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `search` (string, optional): Search query
- `category` (string, optional): Category filter
- `status` (string, optional): Active status filter

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "discountPrice": 79.99,
      "images": ["image_url_1", "image_url_2"],
      "stock": 50,
      "maxOrderQuantity": 10,
      "sku": "PROD-001",
      "tags": ["tag1", "tag2"],
      "specifications": {
        "weight": "1kg",
        "dimensions": "10x10x10cm"
      },
      "category": {
        "_id": "category_id",
        "name": "Category Name"
      },
      "ratings": {
        "average": 4.5,
        "count": 25
      },
      "favoriteCount": 10,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalProducts": 100,
    "hasNext": true,
    "hasPrev": false,
    "limit": 20
  }
}
```

#### POST /api/admin/products
Create new product.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name` (string, required): Product name
- `description` (string, required): Product description
- `category` (string, required): Category ID
- `subCategory` (string, optional): Sub-category
- `price` (number, required): Product price
- `discountPrice` (number, optional): Discounted price
- `stock` (number, required): Stock quantity
- `maxOrderQuantity` (number, optional): Max order quantity
- `sku` (string, optional): Product SKU
- `tags` (string, optional): Comma-separated tags
- `isActive` (boolean, optional): Active status
- `specifications` (string, optional): JSON string of specifications
- `images` (files, optional): Product images (max 5)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_product_id",
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "stock": 50,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

#### PUT /api/admin/products/:id
Update existing product.

**Path Parameters:**
- `id` (string, required): Product ID

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body:** Same as POST /api/admin/products

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Updated Product Name",
    "description": "Updated description",
    "price": 109.99,
    "stock": 45,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Product updated successfully"
}
```

#### DELETE /api/admin/products/:id
Delete product.

**Path Parameters:**
- `id` (string, required): Product ID

**Headers:**
```
Authorization: Bearer <super_admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Response (if product has active orders):**
```json
{
  "success": false,
  "message": "Cannot delete product with active orders. Consider deactivating instead."
}
```

#### GET /api/admin/products/low-stock
Get products with low stock.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Low Stock Product",
      "stock": 5,
      "category": {
        "name": "Category Name"
      }
    }
  ]
}
```

### Categories Management

#### GET /api/admin/categories
Get all categories (including inactive).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Category Name",
      "slug": "category-slug",
      "description": "Category description",
      "image": "category_image_url",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/admin/categories
Create new category.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name` (string, required): Category name
- `description` (string, optional): Category description
- `image` (file, optional): Category image
- `isActive` (boolean, optional): Active status

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_category_id",
    "name": "New Category",
    "slug": "new-category",
    "description": "Category description",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Category created successfully"
}
```

#### PUT /api/admin/categories/:id
Update category.

**Path Parameters:**
- `id` (string, required): Category ID

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body:** Same as POST /api/admin/categories

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "name": "Updated Category",
    "slug": "updated-category",
    "description": "Updated description",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Category updated successfully"
}
```

#### DELETE /api/admin/categories/:id
Delete category.

**Path Parameters:**
- `id` (string, required): Category ID

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### Orders Management

#### GET /api/admin/orders
Get all orders with pagination.

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `search` (string, optional): Search in customer info
- `status` (string, optional): Order status filter

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id",
      "orderId": "ORD-20240101-0001",
      "customerInfo": {
        "name": "John Doe",
        "phone": "+1234567890",
        "address": "123 Main St, City, State, 12345",
        "email": "john@example.com"
      },
      "items": [
        {
          "productId": "product_id",
          "name": "Product Name",
          "price": 99.99,
          "quantity": 2,
          "image": "product_image_url",
          "sku": "PROD-001"
        }
      ],
      "totalAmount": 199.98,
      "status": "pending",
      "whatsappMessageSent": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalOrders": 100,
    "hasNext": true,
    "hasPrev": false,
    "limit": 20
  }
}
```

#### GET /api/admin/orders/:id
Get single order details.

**Path Parameters:**
- `id` (string, required): Order ID

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderId": "ORD-20240101-0001",
    "customerInfo": {
      "name": "John Doe",
      "phone": "+1234567890",
      "address": "123 Main St, City, State, 12345",
      "email": "john@example.com"
    },
    "items": [
      {
        "productId": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "quantity": 2,
        "image": "product_image_url",
        "sku": "PROD-001"
      }
    ],
    "totalAmount": 199.98,
    "status": "pending",
    "whatsappMessageSent": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/admin/orders/:id/status
Update order status.

**Path Parameters:**
- `id` (string, required): Order ID

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderId": "ORD-20240101-0001",
    "status": "confirmed",
    "confirmedAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Order status updated successfully"
}
```

#### POST /api/admin/orders/:id/cancel
Cancel order.

**Path Parameters:**
- `id` (string, required): Order ID

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "reason": "Customer requested cancellation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderId": "ORD-20240101-0001",
    "status": "cancelled",
    "cancelledAt": "2024-01-01T00:00:00.000Z",
    "cancellationReason": "Customer requested cancellation",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Order cancelled successfully"
}
```

## 👥 Customer Endpoints

### Order Tracking

#### GET /api/customer-orders/:orderId
Get order details by order ID (public endpoint for customers).

**Path Parameters:**
- `orderId` (string, required): Order ID (e.g., "ORD-20240101-0001")

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderId": "ORD-20240101-0001",
    "customerInfo": {
      "name": "John Doe",
      "phone": "+1234567890",
      "address": "123 Main St, City, State, 12345",
      "email": "john@example.com"
    },
    "items": [
      {
        "productId": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "quantity": 2,
        "image": "product_image_url",
        "sku": "PROD-001"
      }
    ],
    "totalAmount": 199.98,
    "status": "pending",
    "whatsappMessageSent": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 📊 Analytics Endpoints

These endpoints provide analytics and reporting data.

#### GET /api/admin/analytics/overview
Get dashboard overview statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalRevenue": 15000.00,
    "totalProducts": 50,
    "totalCategories": 10,
    "pendingOrders": 5,
    "confirmedOrders": 20,
    "shippedOrders": 15,
    "deliveredOrders": 100,
    "cancelledOrders": 10,
    "lowStockProducts": 3,
    "recentOrders": [
      {
        "orderId": "ORD-20240101-0001",
        "customerName": "John Doe",
        "totalAmount": 199.98,
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### GET /api/admin/analytics/sales
Get sales analytics data.

**Query Parameters:**
- `period` (string, optional): Time period (day, week, month, year)
- `startDate` (string, optional): Start date (ISO format)
- `endDate` (string, optional): End date (ISO format)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 15000.00,
    "totalOrders": 150,
    "averageOrderValue": 100.00,
    "salesByPeriod": [
      {
        "date": "2024-01-01",
        "sales": 1000.00,
        "orders": 10
      }
    ],
    "topProducts": [
      {
        "productId": "product_id",
        "name": "Best Selling Product",
        "sales": 5000.00,
        "quantitySold": 50
      }
    ],
    "salesByCategory": [
      {
        "categoryId": "category_id",
        "categoryName": "Electronics",
        "sales": 8000.00,
        "orders": 80
      }
    ]
  }
}
```

#### GET /api/admin/analytics/products
Get product analytics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 50,
    "activeProducts": 45,
    "inactiveProducts": 5,
    "lowStockProducts": 3,
    "outOfStockProducts": 1,
    "topRatedProducts": [
      {
        "productId": "product_id",
        "name": "Highly Rated Product",
        "averageRating": 4.8,
        "ratingCount": 25
      }
    ],
    "mostFavoritedProducts": [
      {
        "productId": "product_id",
        "name": "Popular Product",
        "favoriteCount": 50
      }
    ]
  }
}
```

## 🔗 Webhooks

### WhatsApp Integration

The system integrates with WhatsApp for order notifications. When an order status changes, a WhatsApp message is automatically sent to the customer.

#### Webhook Configuration
- **Endpoint**: Configured in WhatsApp API settings
- **Authentication**: Token-based authentication
- **Payload**: Order status change notifications

#### Webhook Payload Example
```json
{
  "orderId": "ORD-20240101-0001",
  "customerPhone": "+1234567890",
  "status": "confirmed",
  "message": "Your order has been confirmed and is being prepared.",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

This API documentation provides comprehensive information about all available endpoints, request/response formats, and authentication requirements. Use this as a reference for integrating with the E-Commerce backend API.
