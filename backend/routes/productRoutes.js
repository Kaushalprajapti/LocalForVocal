const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { validateProduct } = require('../middleware/validation');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getLowStockProducts,
  incrementFavoriteCount,
  decrementFavoriteCount
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/low-stock', protect, authorize('super-admin', 'admin', 'staff'), getLowStockProducts);
router.post('/:id/favorite', incrementFavoriteCount);
router.delete('/:id/favorite', decrementFavoriteCount);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.post('/', protect, authorize('super-admin', 'admin'), upload.array('images', 5), handleUploadError, validateProduct, createProduct);
router.put('/:id', protect, authorize('super-admin', 'admin'), upload.array('images', 5), handleUploadError, validateProduct, updateProduct);
router.delete('/:id', protect, authorize('super-admin'), deleteProduct);
router.post('/bulk-upload', protect, authorize('super-admin', 'admin'), bulkUploadProducts);

module.exports = router;
