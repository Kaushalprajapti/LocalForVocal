const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateAdmin, validateEmail, validatePhone, validatePassword } = require('../middleware/validation');
const {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  changePassword,
  createAdmin,
  getAllAdmins,
  updateAdminStatus,
  getDashboardStats,
  verifyToken
} = require('../controllers/adminController');

// Public routes
router.post('/register', validateAdmin, registerAdmin);
router.post('/login', validateEmail, loginAdmin);

// Protected routes
router.get('/verify-token', protect, verifyToken);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validatePhone, updateProfile);
router.put('/change-password', protect, validatePassword, changePassword);
router.get('/dashboard', protect, getDashboardStats);

// Super-admin only routes
router.post('/create-admin', protect, authorize('super-admin'), validateAdmin, createAdmin);
router.get('/admins', protect, authorize('super-admin'), getAllAdmins);
router.put('/admins/:id/status', protect, authorize('super-admin'), updateAdminStatus);

module.exports = router;
