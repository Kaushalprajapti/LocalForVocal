# Database Schema Documentation

## 🗄️ Complete Database Schema Reference

This document provides detailed information about the database schema, relationships, indexes, and data validation rules for the E-Commerce backend system.

## 📋 Table of Contents

- [Database Overview](#database-overview)
- [Collections Overview](#collections-overview)
- [Product Schema](#product-schema)
- [Order Schema](#order-schema)
- [Category Schema](#category-schema)
- [Admin Schema](#admin-schema)
- [Indexes and Performance](#indexes-and-performance)
- [Data Validation](#data-validation)
- [Relationships](#relationships)
- [Migration Guide](#migration-guide)

## 🎯 Database Overview

### Database Technology
- **Database**: MongoDB (NoSQL Document Database)
- **ODM**: Mongoose (MongoDB Object Document Mapper)
- **Version**: MongoDB 4.4+
- **Connection**: Mongoose connection with connection pooling

### Database Configuration
```javascript
// Connection string format
mongodb://[username:password@]host[:port]/database[?options]

// Example
mongodb://localhost:27017/ecommerce
mongodb://user:pass@localhost:27017/ecommerce?authSource=admin
```

### Database Features
- **Document Storage**: Flexible JSON-like documents
- **Schema Validation**: Mongoose schema validation
- **Indexing**: Optimized query performance
- **Transactions**: ACID compliance for critical operations
- **Aggregation**: Advanced data processing pipelines

## 📊 Collections Overview

The database contains the following main collections:

| Collection | Purpose | Document Count (Est.) | Size (Est.) |
|------------|---------|----------------------|-------------|
| `products` | Product catalog | 1,000 - 10,000 | 50MB - 500MB |
| `orders` | Order management | 10,000 - 100,000 | 100MB - 1GB |
| `categories` | Product categorization | 10 - 100 | 1MB - 10MB |
| `admins` | Admin user management | 5 - 50 | < 1MB |

## 📦 Product Schema

### Schema Definition
```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subCategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(value) {
        return value < this.price;
      },
      message: 'Discount price must be less than regular price'
    }
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  maxOrderQuantity: {
    type: Number,
    default: 10,
    min: [1, 'Max order quantity must be at least 1'],
    max: [10, 'Max order quantity cannot exceed 10']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  specifications: {
    type: Map,
    of: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  favoriteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### Field Descriptions

#### Basic Information
- **`name`** (String, Required): Product name
  - Min length: 3 characters
  - Max length: 200 characters
  - Trimmed whitespace
  - Required field

- **`description`** (String, Required): Product description
  - Min length: 10 characters
  - Max length: 2000 characters
  - Required field

#### Categorization
- **`category`** (ObjectId, Required): Reference to Category collection
  - Required field
  - Foreign key relationship

- **`subCategory`** (String, Optional): Sub-category name
  - Optional field
  - Trimmed whitespace

#### Pricing
- **`price`** (Number, Required): Regular product price
  - Required field
  - Minimum value: 0
  - No maximum limit

- **`discountPrice`** (Number, Optional): Discounted price
  - Optional field
  - Must be less than regular price
  - Minimum value: 0

#### Inventory
- **`stock`** (Number, Required): Available stock quantity
  - Required field
  - Minimum value: 0
  - Default: 0

- **`maxOrderQuantity`** (Number, Optional): Maximum order quantity per customer
  - Default: 10
  - Range: 1-10
  - Prevents bulk ordering

#### Media
- **`images`** (Array of Strings, Required): Product image URLs
  - Required field
  - Array of Cloudinary URLs
  - Multiple images supported

#### Identification
- **`sku`** (String, Optional): Stock Keeping Unit
  - Optional field
  - Unique constraint (sparse)
  - Uppercase format
  - Trimmed whitespace

#### Metadata
- **`tags`** (Array of Strings, Optional): Product tags
  - Optional field
  - Array of lowercase strings
  - Trimmed whitespace

- **`specifications`** (Map, Optional): Product specifications
  - Optional field
  - Key-value pairs
  - Flexible structure

#### Ratings and Popularity
- **`ratings.average`** (Number, Optional): Average rating
  - Default: 0
  - Range: 0-5
  - Calculated from user ratings

- **`ratings.count`** (Number, Optional): Number of ratings
  - Default: 0
  - Minimum: 0
  - Count of total ratings

- **`favoriteCount`** (Number, Optional): Number of favorites
  - Default: 0
  - Minimum: 0
  - Count of user favorites

#### Status
- **`isActive`** (Boolean, Optional): Product active status
  - Default: true
  - Controls product visibility

#### Timestamps
- **`createdAt`** (Date, Auto): Creation timestamp
- **`updatedAt`** (Date, Auto): Last update timestamp

### Sample Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
  "category": "507f1f77bcf86cd799439012",
  "subCategory": "Audio",
  "price": 199.99,
  "discountPrice": 149.99,
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/headphones1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/headphones2.jpg"
  ],
  "stock": 50,
  "maxOrderQuantity": 5,
  "sku": "WBH-001",
  "tags": ["wireless", "bluetooth", "headphones", "audio"],
  "specifications": {
    "battery": "30 hours",
    "connectivity": "Bluetooth 5.0",
    "weight": "250g",
    "warranty": "2 years"
  },
  "ratings": {
    "average": 4.5,
    "count": 127
  },
  "favoriteCount": 45,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🛒 Order Schema

### Schema Definition
```javascript
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
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
  },
  confirmedAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  }
}, {
  timestamps: true
});
```

### Field Descriptions

#### Order Identification
- **`orderId`** (String, Auto-generated): Human-readable order ID
  - Unique constraint
  - Auto-generated format: `ORD-YYYYMMDD-XXXX`
  - Example: `ORD-20240101-0001`

#### Customer Information
- **`customerInfo.name`** (String, Required): Customer full name
  - Required field
  - Trimmed whitespace

- **`customerInfo.phone`** (String, Required): Customer phone number
  - Required field
  - Validated format: International phone number
  - Regex: `/^\+?[1-9]\d{1,14}$/`

- **`customerInfo.address`** (String, Required): Delivery address
  - Required field
  - Minimum length: 10 characters

- **`customerInfo.email`** (String, Optional): Customer email
  - Optional field
  - Validated email format
  - Lowercase and trimmed

#### Order Items
- **`items`** (Array of Objects, Required): Order items
  - Required field
  - Array of product items

- **`items.productId`** (ObjectId, Required): Reference to Product
  - Required field
  - Foreign key relationship

- **`items.name`** (String, Required): Product name at time of order
  - Required field
  - Snapshot of product name

- **`items.price`** (Number, Required): Product price at time of order
  - Required field
  - Snapshot of product price

- **`items.quantity`** (Number, Required): Quantity ordered
  - Required field
  - Range: 1-10

- **`items.image`** (String, Optional): Product image URL
  - Optional field
  - Snapshot of product image

- **`items.sku`** (String, Optional): Product SKU
  - Optional field
  - Snapshot of product SKU

#### Order Totals
- **`totalAmount`** (Number, Required): Total order amount
  - Required field
  - Minimum value: 0
  - Calculated from items

#### Order Status
- **`status`** (String, Required): Order status
  - Required field
  - Enum values: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`
  - Default: `pending`

#### Communication
- **`whatsappMessageSent`** (Boolean, Optional): WhatsApp notification status
  - Default: false
  - Tracks notification delivery

#### Status Timestamps
- **`confirmedAt`** (Date, Optional): Confirmation timestamp
- **`shippedAt`** (Date, Optional): Shipping timestamp
- **`deliveredAt`** (Date, Optional): Delivery timestamp
- **`cancelledAt`** (Date, Optional): Cancellation timestamp

#### Cancellation
- **`cancellationReason`** (String, Optional): Reason for cancellation

#### Timestamps
- **`createdAt`** (Date, Auto): Order creation timestamp
- **`updatedAt`** (Date, Auto): Last update timestamp

### Sample Document
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "orderId": "ORD-20240101-0001",
  "customerInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main Street, Apartment 4B, New York, NY 10001",
    "email": "john.doe@example.com"
  },
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "name": "Wireless Bluetooth Headphones",
      "price": 149.99,
      "quantity": 2,
      "image": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/headphones1.jpg",
      "sku": "WBH-001"
    }
  ],
  "totalAmount": 299.98,
  "status": "pending",
  "whatsappMessageSent": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 📂 Category Schema

### Schema Definition
```javascript
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### Field Descriptions

#### Basic Information
- **`name`** (String, Required): Category name
  - Required field
  - Unique constraint
  - Range: 2-50 characters
  - Trimmed whitespace

- **`slug`** (String, Required): URL-friendly identifier
  - Required field
  - Unique constraint
  - Lowercase format
  - Used in URLs

- **`description`** (String, Optional): Category description
  - Optional field
  - Maximum length: 500 characters

#### Media
- **`image`** (String, Optional): Category image URL
  - Optional field
  - Cloudinary URL

#### Status
- **`isActive`** (Boolean, Optional): Category active status
  - Default: true
  - Controls category visibility

#### Timestamps
- **`createdAt`** (Date, Auto): Creation timestamp
- **`updatedAt`** (Date, Auto): Last update timestamp

### Sample Document
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories including smartphones, laptops, and audio equipment.",
  "image": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/electronics.jpg",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 👨‍💼 Admin Schema

### Schema Definition
```javascript
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'staff'],
    default: 'staff'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});
```

### Field Descriptions

#### Authentication
- **`username`** (String, Required): Admin username
  - Required field
  - Unique constraint
  - Range: 3-30 characters
  - Trimmed whitespace

- **`email`** (String, Required): Admin email
  - Required field
  - Unique constraint
  - Validated email format
  - Lowercase and trimmed

- **`password`** (String, Required): Hashed password
  - Required field
  - Minimum length: 6 characters
  - Hashed using bcryptjs

#### Authorization
- **`role`** (String, Required): Admin role
  - Required field
  - Enum values: `super-admin`, `admin`, `staff`
  - Default: `staff`

#### Status
- **`isActive`** (Boolean, Optional): Admin active status
  - Default: true
  - Controls admin access

#### Activity
- **`lastLogin`** (Date, Optional): Last login timestamp

#### Timestamps
- **`createdAt`** (Date, Auto): Creation timestamp
- **`updatedAt`** (Date, Auto): Last update timestamp

### Sample Document
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "$2b$10$encrypted_password_hash",
  "role": "admin",
  "isActive": true,
  "lastLogin": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Indexes and Performance

### Product Indexes
```javascript
// Text search index for product search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Category and status index for filtering
productSchema.index({ category: 1, isActive: 1 });

// Price index for price range queries
productSchema.index({ price: 1 });

// Creation date index for sorting
productSchema.index({ createdAt: -1 });

// SKU index for unique lookups
productSchema.index({ sku: 1 }, { unique: true, sparse: true });
```

### Order Indexes
```javascript
// Order ID index for quick lookups
orderSchema.index({ orderId: 1 }, { unique: true });

// Status index for filtering
orderSchema.index({ status: 1 });

// Customer phone index for customer lookups
orderSchema.index({ 'customerInfo.phone': 1 });

// Creation date index for sorting
orderSchema.index({ createdAt: -1 });

// Status and date compound index
orderSchema.index({ status: 1, createdAt: -1 });
```

### Category Indexes
```javascript
// Name index for unique constraint
categorySchema.index({ name: 1 }, { unique: true });

// Slug index for unique constraint
categorySchema.index({ slug: 1 }, { unique: true });

// Active status index
categorySchema.index({ isActive: 1 });
```

### Admin Indexes
```javascript
// Username index for unique constraint
adminSchema.index({ username: 1 }, { unique: true });

// Email index for unique constraint
adminSchema.index({ email: 1 }, { unique: true });

// Role index for authorization
adminSchema.index({ role: 1 });
```

### Performance Considerations

#### Query Optimization
- **Compound Indexes**: Multi-field indexes for complex queries
- **Sparse Indexes**: Efficient storage for optional fields
- **Text Indexes**: Full-text search capabilities
- **Covering Indexes**: Include frequently accessed fields

#### Index Usage Guidelines
- **Read-Heavy Workloads**: More indexes for better query performance
- **Write-Heavy Workloads**: Fewer indexes to reduce write overhead
- **Memory Usage**: Monitor index memory consumption
- **Index Maintenance**: Regular index analysis and optimization

## ✅ Data Validation

### Mongoose Validation
All schemas include comprehensive validation rules:

#### Required Field Validation
```javascript
required: [true, 'Custom error message']
```

#### Length Validation
```javascript
minlength: [3, 'Minimum length message']
maxlength: [200, 'Maximum length message']
```

#### Range Validation
```javascript
min: [0, 'Minimum value message']
max: [100, 'Maximum value message']
```

#### Format Validation
```javascript
match: [/regex/, 'Format error message']
```

#### Custom Validation
```javascript
validate: {
  validator: function(value) {
    return value < this.price;
  },
  message: 'Custom validation message'
}
```

### Business Logic Validation

#### Product Validation
- Discount price must be less than regular price
- Stock cannot be negative
- SKU must be unique (sparse index)
- Images array cannot be empty

#### Order Validation
- Order items cannot be empty
- Total amount must match item calculations
- Customer phone must be valid format
- Order status must be valid enum value

#### Category Validation
- Category name must be unique
- Slug must be unique and URL-friendly
- Description cannot exceed character limit

#### Admin Validation
- Username must be unique
- Email must be valid format and unique
- Password must meet security requirements
- Role must be valid enum value

## 🔗 Relationships

### Document Relationships

#### One-to-Many Relationships
```
Categories (1) ──→ (Many) Products
Admins (1) ──→ (Many) Actions (implicit)
```

#### Many-to-Many Relationships
```
Products (Many) ──→ (Many) Orders (through Order Items)
```

### Reference Patterns

#### Product-Category Relationship
```javascript
// Product document
{
  "_id": "product_id",
  "name": "Product Name",
  "category": "category_id" // ObjectId reference
}

// Category document
{
  "_id": "category_id",
  "name": "Category Name"
}
```

#### Order-Product Relationship
```javascript
// Order document
{
  "_id": "order_id",
  "items": [
    {
      "productId": "product_id", // ObjectId reference
      "name": "Product Name",     // Snapshot data
      "price": 99.99            // Snapshot data
    }
  ]
}
```

### Population Patterns

#### Product with Category
```javascript
const product = await Product.findById(productId).populate('category');
```

#### Order with Products
```javascript
const order = await Order.findById(orderId).populate('items.productId');
```

## 🔄 Migration Guide

### Schema Changes

#### Adding New Fields
```javascript
// Add new field with default value
const newField = {
  type: String,
  default: 'default_value'
};
```

#### Modifying Existing Fields
```javascript
// Change field type or validation
const modifiedField = {
  type: Number,
  min: [0, 'New validation message']
};
```

#### Removing Fields
```javascript
// Remove field from schema
// Note: Data remains in database until manually removed
```

### Data Migration Scripts

#### Example Migration Script
```javascript
const mongoose = require('mongoose');

async function migrateData() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Update existing documents
    await Product.updateMany(
      { newField: { $exists: false } },
      { $set: { newField: 'default_value' } }
    );
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateData();
```

### Backup Strategy

#### Before Migration
1. **Full Database Backup**: Create complete database backup
2. **Schema Backup**: Export current schema definitions
3. **Data Export**: Export critical data collections
4. **Test Environment**: Test migration on staging environment

#### During Migration
1. **Maintenance Mode**: Enable maintenance mode
2. **Schema Update**: Apply new schema changes
3. **Data Migration**: Run data migration scripts
4. **Validation**: Verify data integrity
5. **Index Rebuild**: Rebuild indexes if necessary

#### After Migration
1. **Functionality Test**: Test all application features
2. **Performance Test**: Verify query performance
3. **Rollback Plan**: Prepare rollback procedures
4. **Monitoring**: Monitor system performance

---

This database schema documentation provides comprehensive information about the data structure, relationships, validation rules, and performance considerations for the E-Commerce backend system.
