const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { validateCategory } = require('../middleware/validation');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  getCategoryHierarchy
} = require('../controllers/categoryController');

// Public routes
router.get('/', getAllCategories);
router.get('/hierarchy', protect, authorize('super-admin', 'admin'), getCategoryHierarchy);
router.get('/:id', getCategoryById);
router.get('/:id/products', getCategoryProducts);

// Protected routes (Admin only)
router.post('/', protect, authorize('super-admin', 'admin'), upload.single('image'), handleUploadError, validateCategory, createCategory);
router.put('/:id', protect, authorize('super-admin', 'admin'), upload.single('image'), handleUploadError, validateCategory, updateCategory);
router.delete('/:id', protect, authorize('super-admin'), deleteCategory);

module.exports = router;
