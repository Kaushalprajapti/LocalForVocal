const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Import Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analytics');
const adminProductRoutes = require('./routes/adminProductRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const customerOrderRoutes = require('./routes/customerOrders');

// Import Middleware
const errorHandler = require('./middleware/errorHandler');

// Security Middleware
app.use(helmet());

// Parse allowed origins from environment variable
// Supports: comma-separated, JSON array, or Python-style array
const parseAllowedOrigins = (envValue) => {
  if (!envValue) return [];
  
  const clean = (url) => url.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '');
  
  // Try JSON array first
  if (envValue.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(envValue);
      return Array.isArray(parsed) ? parsed.map(clean).filter(Boolean) : [];
    } catch {
      // Python-style array: extract quoted strings
      const matches = envValue.match(/['"]([^'"]+)['"]/g);
      return matches ? matches.map(clean).filter(Boolean) : [];
    }
  }
  
  // Comma-separated format
  return envValue.split(',').map(clean).filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);
console.log("🔒 CORS - Allowed Origins:", allowedOrigins.length > 0 ? allowedOrigins : "NONE SET");

// Helper: Extract base project name from Vercel URL
const getVercelBaseName = (domain) => {
  // Remove hash patterns: "local-for-vocal-hash-kaushals-projects" -> "local-for-vocal"
  if (domain.includes('-kaushals-projects')) {
    return domain.split('-kaushals-projects')[0].replace(/-[a-z0-9]{6,}$/i, '');
  }
  // Remove simple hash: "local-for-vocal-fqde" -> "local-for-vocal"
  const match = domain.match(/^(.+?)(-[a-z0-9]{4,})$/i);
  return match && match[1].length >= 3 ? match[1] : domain;
};

// Helper: Check if two Vercel URLs belong to the same project
const isSameVercelProject = (origin, allowed) => {
  const originBase = getVercelBaseName(origin);
  const allowedBase = getVercelBaseName(allowed);
  return originBase === allowedBase || 
         origin.startsWith(allowedBase) || 
         allowed.startsWith(originBase);
};

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const normalize = (url) => url.replace(/\/$/, '').toLowerCase();
    const removeProtocol = (url) => url.replace(/^https?:\/\//, '').toLowerCase();
    
    const originNorm = normalize(origin);
    const originDomain = removeProtocol(originNorm);
    
    const isAllowed = allowedOrigins.some(allowed => {
      const allowedNorm = normalize(allowed);
      const allowedDomain = removeProtocol(allowedNorm);
      
      // Exact match
      if (originNorm === allowedNorm || originDomain === allowedDomain) return true;
      
      // Localhost: match by port
      if (originDomain.startsWith('localhost') && allowedDomain.startsWith('localhost')) {
        return (originDomain.split(':')[1] || '3000') === (allowedDomain.split(':')[1] || '3000');
      }
      
      // Vercel URLs: check if same project
      if (originDomain.includes('vercel.app') && allowedDomain.includes('vercel.app')) {
        const originBase = originDomain.split('.vercel.app')[0];
        const allowedBase = allowedDomain.split('.vercel.app')[0];
        return isSameVercelProject(originBase, allowedBase);
      }
      
      return false;
    });

    if (isAllowed) {
      console.log("✓ Origin allowed:", origin);
      callback(null, true);
    } else {
      console.log("✗ Origin not allowed:", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/', limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/customer-orders', customerOrderRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});