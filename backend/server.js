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

// Build allowed origins list from ENV
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim().replace(/\/$/, ''))
  : [];

// Normalize origins (remove trailing slashes and ensure proper protocol)
const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, '');
};

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin);
    
    // Allow requests with no origin (like mobile apps / Postman / server-to-server)
    if (!origin) {
      console.log("No origin - allowing request");
      return callback(null, true);
    }

    // Normalize the incoming origin
    const normalizedOrigin = normalizeOrigin(origin);
    
    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = normalizeOrigin(allowed);
      
      // Remove protocol for comparison
      const originWithoutProtocol = normalizedOrigin.replace(/^https?:\/\//, '').toLowerCase();
      const allowedWithoutProtocol = normalizedAllowed.replace(/^https?:\/\//, '').toLowerCase();
      
      // Exact match (with or without protocol)
      if (normalizedOrigin.toLowerCase() === normalizedAllowed.toLowerCase()) return true;
      if (originWithoutProtocol === allowedWithoutProtocol) return true;
      
      // For localhost, check with/without port
      if (originWithoutProtocol.startsWith('localhost') && allowedWithoutProtocol.startsWith('localhost')) {
        const originPort = originWithoutProtocol.split(':')[1] || '3000';
        const allowedPort = allowedWithoutProtocol.split(':')[1] || '3000';
        if (originPort === allowedPort) return true;
      }
      
      // For Vercel URLs, allow if they share the same base domain
      if (originWithoutProtocol.includes('vercel.app') && allowedWithoutProtocol.includes('vercel.app')) {
        // Extract the main domain part (before .vercel.app)
        const originDomain = originWithoutProtocol.split('.vercel.app')[0];
        const allowedDomain = allowedWithoutProtocol.split('.vercel.app')[0];
        
        // Allow if domains match or if one contains the other (for preview deployments)
        if (originDomain === allowedDomain || 
            originDomain.includes(allowedDomain) || 
            allowedDomain.includes(originDomain)) {
          return true;
        }
      }
      
      return false;
    });

    if (isAllowed) {
      console.log("✓ Origin allowed:", normalizedOrigin);
      callback(null, true);
    } else {
      console.log("✗ Origin not allowed:", normalizedOrigin);
      console.log("Allowed origins:", allowedOrigins);
      callback(new Error("Not allowed by CORS: " + normalizedOrigin));
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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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