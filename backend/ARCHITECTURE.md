# Backend Architecture Documentation

## 🏗️ System Architecture Overview

This document provides a comprehensive overview of the backend architecture for the E-Commerce platform, detailing the system design, component interactions, and architectural decisions.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [API Design](#api-design)
- [Database Architecture](#database-architecture)
- [Security Architecture](#security-architecture)
- [Middleware Architecture](#middleware-architecture)
- [File Upload Architecture](#file-upload-architecture)
- [Error Handling Architecture](#error-handling-architecture)
- [Performance Considerations](#performance-considerations)
- [Scalability Design](#scalability-design)

## 🎯 Architecture Overview

The backend follows a **layered architecture pattern** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Frontend)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS
┌─────────────────────▼───────────────────────────────────────┐
│                   API Gateway Layer                          │
│  • Rate Limiting  • CORS  • Security Headers  • Logging    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Route Layer                               │
│  • Route Definitions  • Route Protection  • Parameter       │
│    Validation  • Request Routing                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Controller Layer                            │
│  • Business Logic  • Request Processing  • Response         │
│    Formatting  • Error Handling                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  Service Layer                              │
│  • Data Processing  • External API Integration  •           │
│    Business Rules  • Data Transformation                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Data Access Layer                         │
│  • Database Operations  • Data Validation  • Query          │
│    Optimization  • Transaction Management                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Database Layer                            │
│  • MongoDB  • Data Persistence  • Indexing  • Backup       │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 System Components

### 1. Application Server (Express.js)
- **Purpose**: HTTP server and application framework
- **Responsibilities**:
  - Handle HTTP requests/responses
  - Route management
  - Middleware orchestration
  - Server configuration

### 2. Database Layer (MongoDB + Mongoose)
- **Purpose**: Data persistence and management
- **Responsibilities**:
  - Data storage and retrieval
  - Data validation
  - Query optimization
  - Transaction management

### 3. Authentication System (JWT)
- **Purpose**: User authentication and authorization
- **Components**:
  - JWT token generation/validation
  - Password hashing (bcryptjs)
  - Role-based access control
  - Session management

### 4. File Management System (Cloudinary)
- **Purpose**: Image storage and processing
- **Components**:
  - Image upload handling
  - Image optimization
  - CDN delivery
  - Image transformation

### 5. External Integrations
- **WhatsApp API**: Order notifications
- **Payment Gateway**: Payment processing (future)
- **Email Service**: Email notifications (future)

## 🔄 Data Flow Architecture

### Request Processing Flow

```
1. Client Request
   ↓
2. Rate Limiting Check
   ↓
3. CORS Validation
   ↓
4. Security Headers (Helmet)
   ↓
5. Request Logging (Morgan)
   ↓
6. Body Parsing (JSON/URL-encoded)
   ↓
7. Route Matching
   ↓
8. Authentication Middleware
   ↓
9. Authorization Check
   ↓
10. Input Validation
    ↓
11. Controller Processing
    ↓
12. Business Logic Execution
    ↓
13. Database Operations
    ↓
14. Response Formatting
    ↓
15. Error Handling
    ↓
16. Client Response
```

### Database Interaction Flow

```
Controller
    ↓
Service Layer (if needed)
    ↓
Model Operations
    ↓
Mongoose Schema Validation
    ↓
MongoDB Query Execution
    ↓
Index Optimization
    ↓
Data Retrieval/Modification
    ↓
Response to Controller
```

## 🌐 API Design Architecture

### RESTful API Principles

The API follows REST principles with clear resource-based URLs:

```
/api/products          → Product collection
/api/products/:id      → Specific product
/api/categories        → Category collection
/api/orders           → Order collection
/api/admin/*         → Admin-specific endpoints
```

### API Versioning Strategy

- **Current Version**: v1 (implicit)
- **Future Versions**: `/api/v2/` prefix
- **Backward Compatibility**: Maintained for at least 2 versions

### Response Standardization

All API responses follow a consistent structure:

```javascript
// Success Response
{
  success: true,
  data: { ... },
  message: "Operation successful",
  pagination: { ... } // When applicable
}

// Error Response
{
  success: false,
  message: "Error description",
  error: "Detailed error information"
}
```

### HTTP Status Code Usage

- **200**: Successful GET, PUT, PATCH
- **201**: Successful POST (resource created)
- **204**: Successful DELETE (no content)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error

## 🗄️ Database Architecture

### MongoDB Design Principles

1. **Document-Based Storage**: Flexible schema design
2. **Embedded Documents**: Related data stored together
3. **References**: For large or frequently changing data
4. **Indexing Strategy**: Optimized query performance

### Collection Design

#### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: ObjectId, // Reference to Categories
  price: Number,
  images: [String], // Cloudinary URLs
  stock: Number,
  specifications: Map, // Flexible key-value pairs
  ratings: {
    average: Number,
    count: Number
  },
  // ... other fields
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId,
  orderId: String, // Human-readable ID
  customerInfo: {
    name: String,
    phone: String,
    address: String,
    email: String
  },
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  status: String,
  // ... other fields
}
```

### Indexing Strategy

#### Product Indexes
```javascript
// Text search index
{ name: "text", description: "text", tags: "text" }

// Category and status index
{ category: 1, isActive: 1 }

// Price range index
{ price: 1 }

// Creation date index (for sorting)
{ createdAt: -1 }
```

#### Order Indexes
```javascript
// Order ID lookup
{ orderId: 1 }

// Status filtering
{ status: 1 }

// Customer lookup
{ "customerInfo.phone": 1 }

// Date range queries
{ createdAt: -1 }
```

### Data Relationships

```
Categories (1) ──→ (Many) Products
Products (1) ──→ (Many) Order Items
Orders (1) ──→ (Many) Order Items
Admins (1) ──→ (Many) Actions (implicit)
```

## 🔒 Security Architecture

### Multi-Layer Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Security                         │
│  • HTTPS Only  • Input Validation  • XSS Prevention       │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  Network Security                          │
│  • Rate Limiting  • CORS  • IP Filtering  • DDoS          │
│    Protection                                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Application Security                       │
│  • JWT Authentication  • Role-Based Access  • Input        │
│    Validation  • SQL Injection Prevention                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Data Security                            │
│  • Password Hashing  • Data Encryption  • Secure Storage  │
│  • Access Logging  • Audit Trails                         │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
1. User Login Request
   ↓
2. Credential Validation
   ↓
3. Password Verification (bcryptjs)
   ↓
4. JWT Token Generation
   ↓
5. Token Storage (Client)
   ↓
6. Token Validation (Subsequent Requests)
   ↓
7. Role-Based Authorization
   ↓
8. Resource Access
```

### Authorization Levels

- **Super Admin**: Full system access
- **Admin**: Product and order management
- **Staff**: Limited order management
- **Customer**: Public endpoints only

## 🔧 Middleware Architecture

### Middleware Stack Order

```javascript
app.use(helmet());                    // Security headers
app.use(cors({ ... }));              // CORS configuration
app.use(express.json({ limit: '10mb' })); // Body parsing
app.use(express.urlencoded({ ... })); // URL encoding
app.use(morgan('dev'));              // Request logging
app.use('/api/', limiter);           // Rate limiting
app.use('/api/', routes);            // Application routes
app.use(errorHandler);               // Error handling
```

### Custom Middleware Components

#### Authentication Middleware
```javascript
const authenticate = (req, res, next) => {
  // JWT token validation
  // User context attachment
  // Error handling
};
```

#### Authorization Middleware
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    // Role-based access control
    // Permission validation
  };
};
```

#### Validation Middleware
```javascript
const validateProduct = (req, res, next) => {
  // Input validation
  // Schema validation
  // Error reporting
};
```

## 📁 File Upload Architecture

### Cloudinary Integration Flow

```
1. Client Upload Request
   ↓
2. Multer Middleware (File Processing)
   ↓
3. File Validation (Size, Type, Count)
   ↓
4. Cloudinary Upload
   ↓
5. Image Optimization
   ↓
6. URL Generation
   ↓
7. Database Storage
   ↓
8. Response to Client
```

### File Upload Configuration

```javascript
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});
```

### Image Processing Pipeline

1. **Upload Validation**: File type, size, count
2. **Format Conversion**: Automatic format optimization
3. **Resize**: Responsive image generation
4. **Compression**: Quality optimization
5. **CDN Delivery**: Fast global delivery

## ⚠️ Error Handling Architecture

### Error Classification

#### Client Errors (4xx)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **429**: Too Many Requests (rate limit exceeded)

#### Server Errors (5xx)
- **500**: Internal Server Error (unexpected errors)
- **502**: Bad Gateway (external service errors)
- **503**: Service Unavailable (maintenance mode)

### Error Handling Flow

```
1. Error Occurrence
   ↓
2. Error Classification
   ↓
3. Error Logging
   ↓
4. Error Response Formatting
   ↓
5. Client Error Response
   ↓
6. Error Monitoring (if applicable)
```

### Error Response Structure

```javascript
{
  success: false,
  message: "User-friendly error message",
  error: "Detailed error information",
  timestamp: "2024-01-01T00:00:00.000Z",
  requestId: "unique-request-id"
}
```

## ⚡ Performance Considerations

### Database Performance

#### Query Optimization
- **Indexing**: Strategic index placement
- **Aggregation**: Efficient data aggregation
- **Pagination**: Limit data transfer
- **Projection**: Select only required fields

#### Connection Management
- **Connection Pooling**: Reuse database connections
- **Timeout Configuration**: Prevent hanging connections
- **Retry Logic**: Handle connection failures

### Caching Strategy

#### Application-Level Caching
- **In-Memory Cache**: Frequently accessed data
- **Query Result Cache**: Expensive query results
- **Session Cache**: User session data

#### CDN Caching
- **Static Assets**: Images, CSS, JS files
- **API Responses**: Cacheable API responses
- **Edge Caching**: Geographic distribution

### Performance Monitoring

#### Metrics Collection
- **Response Times**: API endpoint performance
- **Database Queries**: Query execution times
- **Memory Usage**: Application memory consumption
- **CPU Usage**: Server resource utilization

#### Performance Optimization
- **Lazy Loading**: Load data on demand
- **Batch Operations**: Group related operations
- **Async Processing**: Non-blocking operations
- **Resource Compression**: Reduce data transfer

## 📈 Scalability Design

### Horizontal Scaling Strategy

#### Load Balancing
- **Multiple Server Instances**: Distribute load
- **Session Affinity**: Maintain user sessions
- **Health Checks**: Monitor server health
- **Failover**: Automatic failover handling

#### Database Scaling
- **Read Replicas**: Distribute read operations
- **Sharding**: Partition data across servers
- **Connection Pooling**: Manage database connections
- **Query Optimization**: Reduce database load

### Microservices Architecture (Future)

#### Service Decomposition
- **User Service**: Authentication and user management
- **Product Service**: Product catalog management
- **Order Service**: Order processing and fulfillment
- **Notification Service**: Email, SMS, WhatsApp
- **Analytics Service**: Reporting and analytics

#### Inter-Service Communication
- **API Gateway**: Centralized request routing
- **Message Queues**: Asynchronous communication
- **Event Sourcing**: Event-driven architecture
- **Service Discovery**: Dynamic service location

### Performance Scaling

#### Caching Layers
- **Application Cache**: In-memory caching
- **Redis Cache**: Distributed caching
- **CDN Cache**: Global content delivery
- **Database Cache**: Query result caching

#### Database Optimization
- **Index Optimization**: Strategic index placement
- **Query Optimization**: Efficient query patterns
- **Connection Pooling**: Resource management
- **Read Replicas**: Load distribution

## 🔍 Monitoring and Observability

### Logging Strategy

#### Log Levels
- **Error**: System errors and exceptions
- **Warn**: Potential issues and warnings
- **Info**: General application information
- **Debug**: Detailed debugging information

#### Log Aggregation
- **Centralized Logging**: Collect logs from all services
- **Log Analysis**: Pattern recognition and alerting
- **Log Retention**: Long-term log storage
- **Log Security**: Sensitive data protection

### Health Monitoring

#### Health Checks
- **Application Health**: Service availability
- **Database Health**: Connection and query performance
- **External Services**: Third-party service status
- **Resource Health**: CPU, memory, disk usage

#### Alerting System
- **Threshold Alerts**: Performance metric alerts
- **Error Rate Alerts**: High error rate notifications
- **Resource Alerts**: Resource usage warnings
- **Service Down Alerts**: Service unavailability

### Performance Monitoring

#### Key Metrics
- **Response Time**: API endpoint performance
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Resource Usage**: CPU, memory, disk utilization

#### Monitoring Tools Integration
- **Application Performance Monitoring (APM)**: Real-time performance tracking
- **Log Aggregation**: Centralized log management
- **Metrics Collection**: Performance data gathering
- **Alerting**: Automated notification system

---

This architecture documentation provides a comprehensive overview of the backend system design, helping developers understand the system structure, make informed decisions, and maintain the codebase effectively.
