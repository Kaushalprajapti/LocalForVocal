# E-Commerce Backend API

A comprehensive Node.js backend API for a local store e-commerce platform built with Express.js, MongoDB, and modern security practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

This backend API powers a local store e-commerce platform, providing comprehensive functionality for product management, order processing, customer management, and administrative operations. The API is designed with scalability, security, and maintainability in mind.

### Key Capabilities

- **Product Management**: Full CRUD operations with image uploads
- **Order Processing**: Complete order lifecycle management
- **User Authentication**: JWT-based authentication with role-based access
- **File Upload**: Cloudinary integration for image storage
- **Analytics**: Sales and performance analytics
- **WhatsApp Integration**: Automated order notifications
- **Rate Limiting**: Protection against abuse
- **Data Validation**: Comprehensive input validation

## ✨ Features

### Core Features
- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 📦 **Product Management**: CRUD operations with image uploads and categorization
- 🛒 **Order Management**: Complete order lifecycle from creation to delivery
- 👥 **User Management**: Admin and customer account management
- 📊 **Analytics**: Sales reports and performance metrics
- 📱 **WhatsApp Integration**: Automated order notifications
- 🖼️ **Image Management**: Cloudinary integration for product images
- 🔍 **Search & Filtering**: Advanced product search and filtering
- 📄 **Pagination**: Efficient data pagination for large datasets

### Security Features
- 🛡️ **Helmet.js**: Security headers
- 🚦 **Rate Limiting**: Request rate limiting
- 🔒 **CORS**: Cross-origin resource sharing configuration
- ✅ **Input Validation**: Comprehensive data validation
- 🔐 **Password Hashing**: bcryptjs for secure password storage
- 🎫 **JWT Tokens**: Secure authentication tokens

### Performance Features
- ⚡ **Database Indexing**: Optimized MongoDB queries
- 📊 **Query Optimization**: Efficient database queries
- 🔄 **Caching**: Strategic caching implementation
- 📈 **Monitoring**: Request logging and error tracking

## 🛠️ Tech Stack

### Core Technologies
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling

### Security & Middleware
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger
- **Express Rate Limit**: Rate limiting middleware
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token management

### File Management
- **Multer**: File upload middleware
- **Cloudinary**: Cloud image storage and manipulation
- **Multer Storage Cloudinary**: Cloudinary integration for multer

### Utilities
- **dotenv**: Environment variable management
- **validator**: Input validation
- **nodemon**: Development server

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4.4 or higher)
- **Cloudinary Account** (for image storage)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# WhatsApp (Optional)
WHATSAPP_API_URL=your-whatsapp-api-url
WHATSAPP_API_TOKEN=your-whatsapp-api-token
```

### 4. Database Setup
```bash
# Start MongoDB service
mongod

# Seed the database with sample data
npm run seed
```

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRE` | JWT expiration time | No | 30d |
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |

### Database Configuration

The application uses MongoDB with Mongoose ODM. Key configuration points:

- **Connection**: Automatic reconnection on failure
- **Indexes**: Optimized indexes for performance
- **Validation**: Schema-level validation
- **Timestamps**: Automatic createdAt/updatedAt fields

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Endpoints Overview

#### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/products` - Get products (with pagination)
- `GET /api/products/:id` - Get single product
- `GET /api/categories` - Get categories
- `POST /api/orders` - Create order
- `GET /api/customer-orders/:orderId` - Get order by ID

#### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/analytics/*` - Analytics endpoints

## 🗄️ Database Schema

### Product Schema
```javascript
{
  name: String (required, 3-200 chars),
  description: String (required, 10-2000 chars),
  category: ObjectId (ref: Category),
  subCategory: String,
  price: Number (required, min: 0),
  discountPrice: Number (min: 0, < price),
  images: [String] (required),
  stock: Number (required, min: 0),
  maxOrderQuantity: Number (default: 10, min: 1, max: 10),
  sku: String (unique, sparse),
  tags: [String],
  specifications: Map<String, String>,
  ratings: {
    average: Number (0-5),
    count: Number (min: 0)
  },
  favoriteCount: Number (min: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  orderId: String (unique, auto-generated),
  customerInfo: {
    name: String (required),
    phone: String (required, validated),
    address: String (required, min: 10 chars),
    email: String (validated)
  },
  items: [{
    productId: ObjectId (ref: Product),
    name: String (required),
    price: Number (required),
    quantity: Number (required, 1-10),
    image: String,
    sku: String
  }],
  totalAmount: Number (required, min: 0),
  status: String (enum: pending, confirmed, shipped, delivered, cancelled),
  whatsappMessageSent: Boolean (default: false),
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```javascript
{
  name: String (required, unique),
  slug: String (required, unique),
  description: String,
  image: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique, validated),
  password: String (required, hashed),
  role: String (enum: super-admin, admin, staff),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Different permission levels (super-admin, admin, staff)
- **Password Hashing**: bcryptjs with salt rounds
- **Token Expiration**: Configurable token expiration

### Input Validation
- **Schema Validation**: Mongoose schema validation
- **Custom Validators**: Business logic validation
- **Sanitization**: Input sanitization and trimming
- **Type Checking**: Strict type validation

### Security Headers
- **Helmet.js**: Security headers (XSS, CSRF protection)
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Request rate limiting per IP
- **Body Size Limits**: Request body size limits

### Data Protection
- **Environment Variables**: Sensitive data in environment variables
- **Error Handling**: Secure error messages (no sensitive data exposure)
- **Logging**: Comprehensive logging without sensitive data

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set strong JWT secret
- [ ] Configure Cloudinary production settings
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting for production
- [ ] Set up monitoring and logging
- [ ] Configure SSL/HTTPS
- [ ] Set up backup strategy

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment-Specific Configuration
- **Development**: Detailed logging, relaxed CORS, mock data
- **Staging**: Production-like with test data
- **Production**: Optimized performance, strict security

## 📊 Monitoring & Logging

### Logging
- **Morgan**: HTTP request logging
- **Console Logging**: Development environment
- **Error Logging**: Comprehensive error tracking
- **Performance Logging**: Response time tracking

### Health Checks
- **Health Endpoint**: `/api/health`
- **Database Status**: MongoDB connection status
- **Service Status**: All critical services status

### Metrics
- **Request Count**: Total API requests
- **Response Times**: Average response times
- **Error Rates**: Error frequency tracking
- **Database Performance**: Query performance metrics

## 🧪 Testing

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 📝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **JSDoc**: Documentation comments
- **Conventional Commits**: Commit message format

### Pull Request Guidelines
- Clear description of changes
- Reference to related issues
- Updated documentation
- Passing tests
- Code review approval

## 📞 Support

For support and questions:
- **Documentation**: Check this README and API docs
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact the development team

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added WhatsApp integration
- **v1.2.0**: Enhanced security features
- **v1.3.0**: Performance optimizations

---

**Built with ❤️ for local businesses**