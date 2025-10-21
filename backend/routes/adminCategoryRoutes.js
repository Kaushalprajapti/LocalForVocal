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

// Admin category routes
router.get('/hierarchy', protect, authorize('super-admin', 'admin'), getCategoryHierarchy);
router.post('/', protect, authorize('super-admin', 'admin'), upload.single('image'), handleUploadError, validateCategory, createCategory);
router.put('/:id', protect, authorize('super-admin', 'admin'), upload.single('image'), handleUploadError, validateCategory, updateCategory);
router.delete('/:id', protect, authorize('super-admin'), deleteCategory);

module.exports = router;
