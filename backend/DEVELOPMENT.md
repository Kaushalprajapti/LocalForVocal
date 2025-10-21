# Development Guide

## 👨‍💻 Complete Development Documentation

This document provides comprehensive guidance for developers working on the E-Commerce backend system, including setup, coding standards, testing, and best practices.

## 📋 Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [API Development](#api-development)
- [Database Development](#database-development)
- [Testing Guidelines](#testing-guidelines)
- [Debugging](#debugging)
- [Performance Optimization](#performance-optimization)
- [Git Workflow](#git-workflow)
- [Code Review Process](#code-review-process)
- [Troubleshooting](#troubleshooting)

## 🛠️ Development Environment Setup

### Prerequisites

#### Required Software
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: v4.4 or higher (local or Atlas)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

#### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "mongodb.mongodb-vscode",
    "ms-vscode.vscode-node-debug2",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-thunder-client"
  ]
}
```

### Initial Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd backend
```

#### 2. Install Dependencies
```bash
# Install all dependencies
npm install

# Install development dependencies
npm install --save-dev nodemon eslint prettier
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.development

# Edit environment variables
code .env.development
```

#### 4. Database Setup
```bash
# Option 1: Local MongoDB
mongod --dbpath /data/db

# Option 2: MongoDB Atlas (Recommended)
# Update MONGODB_URI in .env.development
```

#### 5. Seed Database
```bash
# Run database seeding
npm run seed

# Or run specific seed
npm run seed:products
npm run seed:categories
npm run seed:admins
```

#### 6. Start Development Server
```bash
# Start with auto-reload
npm run dev

# Start with debug mode
DEBUG=app:* npm run dev

# Start with specific environment
NODE_ENV=development npm start
```

### Development Tools

#### 1. Code Quality Tools
```bash
# ESLint configuration
npm run lint

# Prettier formatting
npm run format

# Type checking (if using TypeScript)
npm run type-check
```

#### 2. Testing Tools
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "Product Controller"
```

#### 3. Database Tools
```bash
# MongoDB Compass (GUI)
# Download from: https://www.mongodb.com/products/compass

# MongoDB CLI
mongo
use ecommerce_dev
show collections
db.products.find().limit(5)
```

## 📁 Project Structure

### Directory Layout
```
backend/
├── config/                 # Configuration files
│   ├── cloudinary.js      # Cloudinary configuration
│   └── db.js              # Database configuration
├── controllers/           # Route controllers
│   ├── adminController.js  # Admin operations
│   ├── analyticsController.js # Analytics operations
│   ├── categoryController.js  # Category operations
│   ├── orderController.js     # Order operations
│   └── productController.js  # Product operations
├── middleware/            # Custom middleware
│   ├── auth.js            # Authentication middleware
│   ├── errorHandler.js    # Error handling middleware
│   ├── upload.js          # File upload middleware
│   └── validation.js      # Input validation middleware
├── models/                # Database models
│   ├── Admin.js           # Admin model
│   ├── Category.js        # Category model
│   ├── Order.js           # Order model
│   └── Product.js         # Product model
├── routes/                # API routes
│   ├── adminCategoryRoutes.js
│   ├── adminOrderRoutes.js
│   ├── adminProductRoutes.js
│   ├── adminRoutes.js
│   ├── analytics.js
│   ├── categories.js
│   ├── customerOrders.js
│   ├── orders.js
│   └── productRoutes.js
├── utils/                 # Utility functions
│   └── whatsapp.js        # WhatsApp integration
├── logs/                  # Application logs
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── fixtures/          # Test data
├── scripts/               # Utility scripts
│   ├── seed.js            # Database seeding
│   └── migrate.js         # Database migrations
├── .env.development       # Development environment
├── .env.production        # Production environment
├── .gitignore            # Git ignore rules
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── package.json          # Dependencies and scripts
├── server.js             # Application entry point
└── README.md             # Project documentation
```

### File Naming Conventions

#### Controllers
- **Pattern**: `{entity}Controller.js`
- **Examples**: `productController.js`, `orderController.js`

#### Models
- **Pattern**: `{Entity}.js` (PascalCase)
- **Examples**: `Product.js`, `Order.js`

#### Routes
- **Pattern**: `{entity}Routes.js` or `{purpose}Routes.js`
- **Examples**: `productRoutes.js`, `adminRoutes.js`

#### Middleware
- **Pattern**: `{purpose}.js`
- **Examples**: `auth.js`, `validation.js`

#### Utilities
- **Pattern**: `{purpose}.js`
- **Examples**: `whatsapp.js`, `helpers.js`

## 📝 Coding Standards

### JavaScript Style Guide

#### 1. Variable Declarations
```javascript
// ✅ Good: Use const for immutable values
const API_BASE_URL = 'https://api.example.com';
const user = await User.findById(userId);

// ✅ Good: Use let for mutable values
let currentPage = 1;
let hasMoreData = true;

// ❌ Bad: Avoid var
var oldVariable = 'deprecated';
```

#### 2. Function Declarations
```javascript
// ✅ Good: Use async/await for asynchronous operations
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Good: Use arrow functions for callbacks
const products = await Product.find({}).sort({ createdAt: -1 });

// ❌ Bad: Avoid callback hell
Product.find({}, (err, products) => {
  if (err) {
    // handle error
  } else {
    // handle success
  }
});
```

#### 3. Error Handling
```javascript
// ✅ Good: Consistent error handling
const handleError = (error, res) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

// ✅ Good: Use try-catch blocks
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    handleError(error, res);
  }
};
```

#### 4. Code Organization
```javascript
// ✅ Good: Group related functionality
class ProductController {
  // Create product
  static async createProduct(req, res) {
    // Implementation
  }
  
  // Get all products
  static async getProducts(req, res) {
    // Implementation
  }
  
  // Get single product
  static async getProduct(req, res) {
    // Implementation
  }
  
  // Update product
  static async updateProduct(req, res) {
    // Implementation
  }
  
  // Delete product
  static async deleteProduct(req, res) {
    // Implementation
  }
}

module.exports = ProductController;
```

### API Response Standards

#### 1. Success Responses
```javascript
// ✅ Good: Consistent success response format
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

// Usage examples
successResponse(res, product, 'Product created successfully', 201);
successResponse(res, products, 'Products retrieved successfully');
```

#### 2. Error Responses
```javascript
// ✅ Good: Consistent error response format
const errorResponse = (res, message = 'Error', statusCode = 400, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

// Usage examples
errorResponse(res, 'Product not found', 404);
errorResponse(res, 'Validation failed', 400, validationErrors);
```

#### 3. Pagination Responses
```javascript
// ✅ Good: Consistent pagination format
const paginatedResponse = (res, data, pagination, message = 'Success') => {
  res.json({
    success: true,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: pagination.pages,
      totalItems: pagination.total,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      limit: pagination.limit
    },
    message
  });
};
```

### Database Standards

#### 1. Model Definitions
```javascript
// ✅ Good: Comprehensive model definition
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  // ... other fields
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Good: Add indexes for performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });

// ✅ Good: Add virtual fields
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

module.exports = mongoose.model('Product', productSchema);
```

#### 2. Query Patterns
```javascript
// ✅ Good: Use proper query methods
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category', 'name slug')
      .lean();
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};
```

## 🔌 API Development

### RESTful API Design

#### 1. URL Structure
```javascript
// ✅ Good: RESTful URL patterns
GET    /api/products              // Get all products
GET    /api/products/:id          // Get single product
POST   /api/products              // Create product
PUT    /api/products/:id          // Update product
DELETE /api/products/:id          // Delete product

GET    /api/categories            // Get all categories
GET    /api/categories/:id        // Get single category
POST   /api/categories            // Create category
PUT    /api/categories/:id        // Update category
DELETE /api/categories/:id        // Delete category

GET    /api/orders                // Get all orders
GET    /api/orders/:id            // Get single order
POST   /api/orders                // Create order
PUT    /api/orders/:id/status     // Update order status
```

#### 2. HTTP Methods
```javascript
// ✅ Good: Proper HTTP method usage
app.get('/api/products', getProducts);           // Read
app.get('/api/products/:id', getProduct);         // Read
app.post('/api/products', createProduct);        // Create
app.put('/api/products/:id', updateProduct);     // Update
app.delete('/api/products/:id', deleteProduct);  // Delete

// ✅ Good: Use PATCH for partial updates
app.patch('/api/products/:id', updateProductPartial);
```

#### 3. Status Codes
```javascript
// ✅ Good: Appropriate status codes
res.status(200).json({ success: true, data });        // OK
res.status(201).json({ success: true, data });        // Created
res.status(204).send();                                // No Content
res.status(400).json({ success: false, message });     // Bad Request
res.status(401).json({ success: false, message });     // Unauthorized
res.status(403).json({ success: false, message });     // Forbidden
res.status(404).json({ success: false, message });     // Not Found
res.status(429).json({ success: false, message });     // Too Many Requests
res.status(500).json({ success: false, message });     // Internal Server Error
```

### Middleware Development

#### 1. Authentication Middleware
```javascript
// ✅ Good: Comprehensive authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Admin.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};
```

#### 2. Authorization Middleware
```javascript
// ✅ Good: Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Usage
router.delete('/products/:id', 
  authenticate, 
  authorize('super-admin'), 
  deleteProduct
);
```

#### 3. Validation Middleware
```javascript
// ✅ Good: Input validation middleware
const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  const errors = [];
  
  if (!name || name.trim().length < 3) {
    errors.push('Name is required and must be at least 3 characters');
  }
  
  if (!price || price < 0) {
    errors.push('Price is required and must be non-negative');
  }
  
  if (!category) {
    errors.push('Category is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};
```

### File Upload Handling

#### 1. Multer Configuration
```javascript
// ✅ Good: Secure file upload configuration
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.'
      });
    }
  }
  
  if (error.message === 'Invalid file type') {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
    });
  }
  
  next(error);
};
```

## 🗄️ Database Development

### Model Development

#### 1. Schema Design
```javascript
// ✅ Good: Well-designed schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      minlength: [10, 'Address must be at least 10 characters']
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [10, 'Quantity cannot exceed 10']
    },
    image: {
      type: String,
      default: ''
    },
    sku: String
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  whatsappMessageSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
```

#### 2. Pre/Post Hooks
```javascript
// ✅ Good: Use pre-save hooks for data processing
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.constructor.countDocuments();
    this.orderId = `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// ✅ Good: Use post-save hooks for side effects
orderSchema.post('save', async function(doc) {
  if (doc.status === 'confirmed' && !doc.whatsappMessageSent) {
    // Send WhatsApp notification
    await sendWhatsAppNotification(doc);
  }
});
```

#### 3. Virtual Fields
```javascript
// ✅ Good: Add virtual fields for computed properties
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual('statusHistory').get(function() {
  const history = [];
  if (this.confirmedAt) history.push({ status: 'confirmed', date: this.confirmedAt });
  if (this.shippedAt) history.push({ status: 'shipped', date: this.shippedAt });
  if (this.deliveredAt) history.push({ status: 'delivered', date: this.deliveredAt });
  if (this.cancelledAt) history.push({ status: 'cancelled', date: this.cancelledAt });
  return history;
});
```

### Query Optimization

#### 1. Indexing Strategy
```javascript
// ✅ Good: Strategic indexing
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });

orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ status: 1 });
orderSchema.index({ 'customerInfo.phone': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
```

#### 2. Query Optimization
```javascript
// ✅ Good: Optimized queries
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query efficiently
    const query = {};
    if (category) query.category = new mongoose.Types.ObjectId(category);
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort efficiently
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Use lean() for better performance when not modifying documents
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category', 'name slug')
      .lean();
    
    // Use countDocuments for better performance
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};
```

#### 3. Aggregation Pipelines
```javascript
// ✅ Good: Use aggregation for complex queries
const getProductAnalytics = async (req, res) => {
  try {
    const analytics = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' },
          lowStockProducts: {
            $sum: {
              $cond: [{ $lt: ['$stock', 10] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $project: {
          categoryName: '$categoryInfo.name',
          totalProducts: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          totalStock: 1,
          lowStockProducts: 1
        }
      },
      {
        $sort: { totalProducts: -1 }
      }
    ]);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    handleError(error, res);
  }
};
```

## 🧪 Testing Guidelines

### Test Structure

#### 1. Test Organization
```
tests/
├── unit/                    # Unit tests
│   ├── controllers/        # Controller tests
│   ├── models/            # Model tests
│   ├── middleware/        # Middleware tests
│   └── utils/             # Utility tests
├── integration/           # Integration tests
│   ├── api/               # API endpoint tests
│   ├── database/          # Database tests
│   └── auth/              # Authentication tests
├── e2e/                   # End-to-end tests
│   ├── user-flows/        # User journey tests
│   └── admin-flows/       # Admin workflow tests
└── fixtures/              # Test data
    ├── products.json      # Product test data
    ├── orders.json        # Order test data
    └── users.json         # User test data
```

#### 2. Test Setup
```javascript
// ✅ Good: Test setup with proper configuration
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');

describe('Product API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });
  
  beforeEach(async () => {
    // Clear database before each test
    await mongoose.connection.db.dropDatabase();
    
    // Seed test data
    await seedTestData();
  });
  
  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });
  
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });
    
    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=category-id')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(product => 
        product.category._id === 'category-id'
      )).toBe(true);
    });
    
    it('should search products by name', async () => {
      const response = await request(app)
        .get('/api/products?search=test')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});
```

#### 3. Mocking and Stubbing
```javascript
// ✅ Good: Mock external services
const cloudinary = require('cloudinary').v2;

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn()
    }
  }
}));

describe('File Upload', () => {
  beforeEach(() => {
    cloudinary.uploader.upload.mockResolvedValue({
      public_id: 'test-image',
      secure_url: 'https://res.cloudinary.com/test/image/upload/test-image.jpg'
    });
  });
  
  it('should upload image successfully', async () => {
    const response = await request(app)
      .post('/api/admin/products')
      .attach('images', 'test-image.jpg')
      .expect(201);
    
    expect(cloudinary.uploader.upload).toHaveBeenCalled();
    expect(response.body.success).toBe(true);
  });
});
```

### Test Coverage

#### 1. Coverage Goals
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **Critical Paths**: 100% coverage

#### 2. Coverage Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 🐛 Debugging

### Debugging Tools

#### 1. Node.js Debugger
```javascript
// ✅ Good: Use debugger statements
const createProduct = async (req, res) => {
  try {
    debugger; // Breakpoint for debugging
    
    const productData = req.body;
    console.log('Product data:', productData);
    
    const product = await Product.create(productData);
    
    debugger; // Another breakpoint
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    handleError(error, res);
  }
};
```

#### 2. Logging
```javascript
// ✅ Good: Structured logging
const logger = require('winston');

const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
};

// ✅ Good: Error logging
const logError = (error, req, res, next) => {
  logger.error('Application error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  next(error);
};
```

#### 3. Performance Monitoring
```javascript
// ✅ Good: Performance monitoring
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    if (duration > 1000) { // Log slow requests
      logger.warn('Slow request detected', {
        url: req.url,
        method: req.method,
        duration: `${duration}ms`
      });
    }
  });
  
  next();
};
```

### Common Debugging Scenarios

#### 1. Database Connection Issues
```javascript
// ✅ Good: Database connection debugging
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully');
    
    // Monitor connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB Reconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
```

#### 2. Authentication Issues
```javascript
// ✅ Good: Authentication debugging
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    console.log('🔍 Token received:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);
    
    const user = await Admin.findById(decoded.userId);
    console.log('👤 User found:', user ? user.username : 'Not found');
    
    if (!user || !user.isActive) {
      console.log('❌ User not found or inactive');
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};
```

## ⚡ Performance Optimization

### Database Optimization

#### 1. Query Optimization
```javascript
// ✅ Good: Optimized queries
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    // Build efficient query
    const query = {};
    if (category) {
      query.category = new mongoose.Types.ObjectId(category);
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    // Use projection to limit fields
    const projection = {
      name: 1,
      price: 1,
      discountPrice: 1,
      images: { $slice: 1 }, // Only first image
      category: 1,
      stock: 1,
      isActive: 1
    };
    
    // Execute query with proper indexing
    const products = await Product.find(query, projection)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category', 'name slug')
      .lean(); // Use lean() for read-only operations
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};
```

#### 2. Caching Strategy
```javascript
// ✅ Good: Implement caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original res.json
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        client.setex(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Usage
app.get('/api/products', cacheMiddleware(300), getProducts);
```

### Application Optimization

#### 1. Memory Management
```javascript
// ✅ Good: Memory optimization
const processLargeDataset = async (req, res) => {
  try {
    const cursor = Product.find({}).cursor();
    const results = [];
    
    // Process in batches to avoid memory issues
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      results.push(processDocument(doc));
      
      // Process in chunks
      if (results.length >= 1000) {
        await processBatch(results);
        results.length = 0; // Clear array
      }
    }
    
    // Process remaining results
    if (results.length > 0) {
      await processBatch(results);
    }
    
    res.json({ success: true, message: 'Processing completed' });
  } catch (error) {
    handleError(error, res);
  }
};
```

#### 2. Async Processing
```javascript
// ✅ Good: Use async processing for heavy operations
const processOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    
    // Send response immediately
    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
    
    // Process heavy operations asynchronously
    setImmediate(async () => {
      try {
        await sendWhatsAppNotification(order);
        await updateInventory(order);
        await sendEmailConfirmation(order);
      } catch (error) {
        console.error('Async processing error:', error);
      }
    });
    
  } catch (error) {
    handleError(error, res);
  }
};
```

## 🔄 Git Workflow

### Branch Strategy

#### 1. Branch Naming
```bash
# Feature branches
feature/product-search
feature/order-tracking
feature/admin-dashboard

# Bug fix branches
bugfix/login-validation
bugfix/payment-processing
bugfix/image-upload

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug

# Release branches
release/v1.2.0
release/v1.3.0
```

#### 2. Commit Messages
```bash
# ✅ Good: Conventional commit format
feat: add product search functionality
fix: resolve image upload validation issue
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add unit tests for product controller
chore: update dependencies

# ✅ Good: Detailed commit messages
feat(products): add advanced search with filters

- Add text search across name and description
- Add category filtering
- Add price range filtering
- Add sorting options
- Add pagination support

Closes #123
```

### Pull Request Process

#### 1. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

#### 2. Code Review Checklist
- [ ] Code follows established patterns
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed
- [ ] Security implications reviewed
- [ ] Tests are comprehensive
- [ ] Documentation is updated

## 🔍 Code Review Process

### Review Guidelines

#### 1. What to Look For
- **Functionality**: Does the code work as intended?
- **Performance**: Are there any performance issues?
- **Security**: Are there any security vulnerabilities?
- **Maintainability**: Is the code easy to understand and maintain?
- **Testing**: Are there adequate tests?

#### 2. Review Comments
```javascript
// ✅ Good: Constructive feedback
// Consider using async/await instead of callbacks for better readability
// Suggestion: const result = await Product.findById(id);

// ✅ Good: Security concerns
// Security: This query could be vulnerable to NoSQL injection
// Suggestion: Use parameterized queries or input validation

// ✅ Good: Performance suggestions
// Performance: This query could be slow on large datasets
// Suggestion: Add an index on the 'category' field
```

### Automated Checks

#### 1. Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

#### 2. CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linter
      run: npm run lint
      
    - name: Run tests
      run: npm test
      
    - name: Run security audit
      run: npm audit
```

---

This development guide provides comprehensive guidance for developers working on the E-Commerce backend system. Follow these standards and practices to ensure code quality, maintainability, and team collaboration.
