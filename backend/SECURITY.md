# Security Documentation

## 🔒 Comprehensive Security Guide

This document outlines the security measures, best practices, and implementation details for the E-Commerce backend system.

## 📋 Table of Contents

- [Security Overview](#security-overview)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Input Validation](#input-validation)
- [API Security](#api-security)
- [Database Security](#database-security)
- [File Upload Security](#file-upload-security)
- [Network Security](#network-security)
- [Monitoring & Logging](#monitoring--logging)
- [Security Best Practices](#security-best-practices)
- [Incident Response](#incident-response)

## 🛡️ Security Overview

### Security Philosophy
The E-Commerce backend implements a **defense-in-depth** security strategy with multiple layers of protection:

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

### Security Objectives
- **Confidentiality**: Protect sensitive data from unauthorized access
- **Integrity**: Ensure data accuracy and prevent tampering
- **Availability**: Maintain system availability and performance
- **Authentication**: Verify user identity
- **Authorization**: Control access to resources
- **Non-repudiation**: Track user actions and changes

## 🔐 Authentication & Authorization

### JWT Token Authentication

#### Token Structure
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "admin_id",
    "role": "admin",
    "iat": 1640995200,
    "exp": 1643587200
  },
  "signature": "encrypted_signature"
}
```

#### Token Generation
```javascript
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};
```

#### Token Validation
```javascript
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};
```

### Role-Based Access Control (RBAC)

#### Role Hierarchy
```
Super Admin
├── Full system access
├── User management
├── System configuration
└── Audit logs

Admin
├── Product management
├── Order management
├── Category management
└── Analytics access

Staff
├── Order processing
├── Customer support
└── Limited product access
```

#### Authorization Middleware
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

#### Usage Examples
```javascript
// Super admin only
router.delete('/products/:id', authenticate, authorize('super-admin'), deleteProduct);

// Admin and super admin
router.post('/products', authenticate, authorize('admin', 'super-admin'), createProduct);

// Staff, admin, and super admin
router.get('/orders', authenticate, authorize('staff', 'admin', 'super-admin'), getOrders);
```

### Password Security

#### Password Hashing
```javascript
const bcrypt = require('bcryptjs');

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

#### Password Requirements
- **Minimum Length**: 6 characters
- **Complexity**: Mix of letters, numbers, and symbols (recommended)
- **Salt Rounds**: 12 rounds for bcrypt
- **Storage**: Never store plain text passwords

## 🔒 Data Protection

### Sensitive Data Classification

#### Public Data
- Product information (name, description, price)
- Category information
- Public order status

#### Internal Data
- Admin user information
- System logs
- Analytics data

#### Confidential Data
- Customer personal information
- Payment information
- Admin credentials
- API keys and secrets

### Data Encryption

#### Environment Variables
```javascript
// Store sensitive configuration in environment variables
const config = {
  jwtSecret: process.env.JWT_SECRET,
  dbUri: process.env.MONGODB_URI,
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET
};
```

#### Database Encryption
- **MongoDB**: Uses TLS/SSL for data in transit
- **Passwords**: Hashed with bcryptjs
- **Sensitive Fields**: Consider field-level encryption for highly sensitive data

#### API Response Sanitization
```javascript
const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user.toObject();
  return sanitizedUser;
};
```

### Data Privacy

#### Customer Data Protection
- **Minimal Collection**: Only collect necessary customer data
- **Data Retention**: Implement data retention policies
- **Right to Deletion**: Provide data deletion capabilities
- **Consent Management**: Track user consent for data processing

#### GDPR Compliance
- **Data Processing Lawfulness**: Clear legal basis for processing
- **Transparency**: Clear privacy policies
- **Data Subject Rights**: Access, rectification, erasure, portability
- **Data Protection Impact Assessment**: For high-risk processing

## ✅ Input Validation

### Schema Validation

#### Mongoose Schema Validation
```javascript
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
  }
});
```

#### Custom Validation
```javascript
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};
```

### Input Sanitization

#### XSS Prevention
```javascript
const validator = require('validator');

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return validator.escape(input);
  }
  return input;
};
```

#### SQL Injection Prevention
- **Mongoose ODM**: Built-in protection against NoSQL injection
- **Parameterized Queries**: Use Mongoose methods instead of raw queries
- **Input Validation**: Validate all input before database operations

### File Upload Security

#### File Type Validation
```javascript
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB

const validateFile = (file) => {
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  return true;
};
```

#### File Content Validation
```javascript
const sharp = require('sharp');

const validateImageContent = async (file) => {
  try {
    const metadata = await sharp(file.buffer).metadata();
    
    // Validate image dimensions
    if (metadata.width > 4000 || metadata.height > 4000) {
      throw new Error('Image dimensions too large');
    }
    
    return true;
  } catch (error) {
    throw new Error('Invalid image file');
  }
};
```

## 🌐 API Security

### Rate Limiting

#### Express Rate Limit Configuration
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

#### Endpoint-Specific Rate Limiting
```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
});

app.use('/api/admin/login', authLimiter);
```

### CORS Configuration

#### Secure CORS Setup
```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://yourdomain.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Security Headers

#### Helmet.js Configuration
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### Custom Security Headers
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

## 🗄️ Database Security

### Connection Security

#### MongoDB Connection Security
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: process.env.NODE_ENV === 'production',
      sslValidate: true,
      authSource: 'admin'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

#### Database Access Control
- **Authentication**: Use MongoDB authentication
- **Authorization**: Implement role-based database access
- **Network Security**: Restrict database access by IP
- **Encryption**: Use TLS/SSL for database connections

### Query Security

#### NoSQL Injection Prevention
```javascript
// ❌ Vulnerable to injection
const user = await User.findOne({ username: req.body.username });

// ✅ Safe with validation
const username = validator.escape(req.body.username);
const user = await User.findOne({ username });
```

#### Parameterized Queries
```javascript
// ✅ Use Mongoose methods (safe)
const products = await Product.find({ category: categoryId });

// ❌ Avoid raw queries
const products = await Product.raw(`SELECT * FROM products WHERE category = '${categoryId}'`);
```

## 📁 File Upload Security

### Cloudinary Security

#### Secure Upload Configuration
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadOptions = {
  folder: 'ecommerce-products',
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  transformation: [
    { width: 800, height: 600, crop: 'limit' },
    { quality: 'auto' }
  ]
};
```

#### Upload Security Measures
- **File Type Validation**: Restrict to allowed image types
- **File Size Limits**: Prevent large file uploads
- **Virus Scanning**: Consider implementing virus scanning
- **Content Validation**: Validate image content
- **Access Control**: Implement proper access controls

### File Storage Security

#### Access Control
```javascript
const generateSignedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
  });
};
```

#### File Deletion Security
```javascript
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
```

## 🌐 Network Security

### HTTPS/TLS Configuration

#### SSL/TLS Best Practices
- **TLS Version**: Use TLS 1.2 or higher
- **Cipher Suites**: Use strong cipher suites
- **Certificate Management**: Regular certificate renewal
- **HSTS**: Implement HTTP Strict Transport Security

#### Production SSL Configuration
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
  ca: fs.readFileSync('path/to/ca-bundle.pem')
};

https.createServer(options, app).listen(443);
```

### Network Access Control

#### IP Whitelisting
```javascript
const allowedIPs = ['192.168.1.0/24', '10.0.0.0/8'];

const checkIP = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (!allowedIPs.some(ip => isIPInRange(clientIP, ip))) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  next();
};
```

#### VPN Requirements
- **Admin Access**: Require VPN for admin panel access
- **Database Access**: Restrict database access to VPN
- **API Access**: Consider VPN for sensitive API endpoints

## 📊 Monitoring & Logging

### Security Logging

#### Authentication Logging
```javascript
const logAuthAttempt = (req, success, reason) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    username: req.body.username,
    success,
    reason,
    endpoint: req.path
  };
  
  console.log('Auth attempt:', JSON.stringify(logEntry));
};
```

#### Access Logging
```javascript
const logAccess = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration,
      userId: req.user?.userId
    };
    
    console.log('Access log:', JSON.stringify(logEntry));
  });
  
  next();
};
```

### Security Monitoring

#### Failed Login Monitoring
```javascript
const failedLogins = new Map();

const trackFailedLogin = (ip) => {
  const count = failedLogins.get(ip) || 0;
  failedLogins.set(ip, count + 1);
  
  if (count >= 5) {
    // Block IP or send alert
    console.warn(`Suspicious activity from IP: ${ip}`);
  }
};
```

#### Anomaly Detection
- **Unusual Access Patterns**: Monitor for unusual access patterns
- **High Error Rates**: Track high error rates
- **Suspicious Requests**: Monitor for suspicious request patterns
- **Resource Usage**: Monitor resource usage anomalies

## 🛡️ Security Best Practices

### Development Security

#### Code Security
- **Input Validation**: Validate all inputs
- **Output Encoding**: Encode outputs to prevent XSS
- **Error Handling**: Don't expose sensitive information in errors
- **Dependency Management**: Keep dependencies updated
- **Code Review**: Implement security-focused code reviews

#### Environment Security
```javascript
// ✅ Secure environment variable handling
const config = {
  jwtSecret: process.env.JWT_SECRET,
  dbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV
};

// ❌ Don't expose sensitive data
console.log('JWT Secret:', process.env.JWT_SECRET);
```

### Deployment Security

#### Production Security Checklist
- [ ] **HTTPS**: Enable HTTPS with valid certificates
- [ ] **Environment Variables**: Secure environment variable management
- [ ] **Database Security**: Secure database connections
- [ ] **Access Control**: Implement proper access controls
- [ ] **Monitoring**: Set up security monitoring
- [ ] **Backup**: Implement secure backup procedures
- [ ] **Updates**: Keep all dependencies updated
- [ ] **Logging**: Implement comprehensive logging

#### Container Security
```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Remove unnecessary packages
RUN apk del .build-deps

# Set security headers
ENV NODE_ENV=production
```

### Operational Security

#### Regular Security Tasks
- **Security Updates**: Regular security updates
- **Vulnerability Scanning**: Regular vulnerability scans
- **Access Review**: Regular access review
- **Backup Testing**: Regular backup testing
- **Incident Response**: Regular incident response drills

#### Security Training
- **Developer Training**: Security awareness training
- **Best Practices**: Regular security best practices updates
- **Threat Awareness**: Stay updated on current threats
- **Incident Response**: Regular incident response training

## 🚨 Incident Response

### Incident Response Plan

#### Incident Classification
- **Low**: Minor security issues with minimal impact
- **Medium**: Moderate security issues with limited impact
- **High**: Significant security issues with substantial impact
- **Critical**: Major security incidents with severe impact

#### Response Procedures
1. **Detection**: Identify and confirm security incident
2. **Assessment**: Assess impact and severity
3. **Containment**: Contain the incident
4. **Eradication**: Remove the threat
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Document and learn from incident

#### Incident Response Team
- **Incident Commander**: Overall incident management
- **Technical Lead**: Technical response coordination
- **Communications Lead**: External communications
- **Legal Counsel**: Legal considerations
- **Management**: Executive decision making

### Security Incident Examples

#### Data Breach Response
1. **Immediate Actions**:
   - Isolate affected systems
   - Preserve evidence
   - Notify incident response team
   - Assess scope of breach

2. **Investigation**:
   - Determine cause of breach
   - Identify affected data
   - Assess impact
   - Document findings

3. **Recovery**:
   - Patch vulnerabilities
   - Restore systems
   - Implement additional security measures
   - Monitor for continued threats

4. **Communication**:
   - Notify affected users
   - Report to authorities if required
   - Communicate with stakeholders
   - Document lessons learned

#### DDoS Attack Response
1. **Detection**: Monitor for unusual traffic patterns
2. **Mitigation**: Implement DDoS protection measures
3. **Communication**: Notify users of potential service issues
4. **Recovery**: Restore normal service
5. **Analysis**: Analyze attack patterns and improve defenses

---

This security documentation provides comprehensive guidance for implementing and maintaining security measures in the E-Commerce backend system. Regular review and updates of security practices are essential to maintain effective protection against evolving threats.
