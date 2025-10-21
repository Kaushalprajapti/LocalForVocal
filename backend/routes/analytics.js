const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getSalesAnalytics,
  getProductAnalytics,
  getLowStockProducts,
  getOrderAnalytics,
  getDashboardStats
} = require('../controllers/analyticsController');

// All analytics routes are protected (Admin only)
router.get('/sales', protect, authorize('super-admin', 'admin'), getSalesAnalytics);
router.get('/products', protect, authorize('super-admin', 'admin'), getProductAnalytics);
router.get('/low-stock', protect, authorize('super-admin', 'admin', 'staff'), getLowStockProducts);
router.get('/orders', protect, authorize('super-admin', 'admin'), getOrderAnalytics);
router.get('/dashboard', protect, authorize('super-admin', 'admin'), getDashboardStats);

module.exports = router;
