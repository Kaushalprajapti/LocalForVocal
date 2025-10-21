const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatus,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');

// Admin order routes
router.get('/', protect, authorize('super-admin', 'admin', 'staff'), getAllOrders);
router.get('/stats', protect, authorize('super-admin', 'admin'), getOrderStats);
router.get('/:id', protect, authorize('super-admin', 'admin', 'staff'), getOrderById);
router.put('/:id/status', protect, authorize('super-admin', 'admin'), updateOrderStatus);
router.put('/:id/cancel', protect, authorize('super-admin', 'admin'), cancelOrder);

module.exports = router;
