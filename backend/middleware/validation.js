const validator = require('validator');

// Validation middleware for common fields
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  next();
};

const validatePhone = (req, res, next) => {
  const { phone } = req.body;
  if (phone && !validator.isMobilePhone(phone, 'any')) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid phone number'
    });
  }
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (password && password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }
  next();
};

// Product validation
const validateProduct = (req, res, next) => {
  const { name, description, price, stock, category } = req.body;
  
  console.log('Product validation - received data:', { name, description, price, stock, category });
  
  if (!name || name.trim().length < 3) {
    console.log('Product validation failed: name too short');
    return res.status(400).json({
      success: false,
      message: 'Product name must be at least 3 characters long'
    });
  }
  
  if (!description || description.trim().length < 10) {
    console.log('Product validation failed: description too short');
    return res.status(400).json({
      success: false,
      message: 'Product description must be at least 10 characters long'
    });
  }
  
  if (!price || price < 0) {
    console.log('Product validation failed: invalid price');
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number'
    });
  }
  
  if (stock !== undefined && stock < 0) {
    console.log('Product validation failed: invalid stock');
    return res.status(400).json({
      success: false,
      message: 'Stock cannot be negative'
    });
  }
  
  if (!category) {
    console.log('Product validation failed: missing category');
    return res.status(400).json({
      success: false,
      message: 'Category is required'
    });
  }
  
  console.log('Product validation passed');
  next();
};

// Order validation
const validateOrder = (req, res, next) => {
  const { customerInfo, items } = req.body;
  
  if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.address) {
    return res.status(400).json({
      success: false,
      message: 'Customer information (name, phone, address) is required'
    });
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one item'
    });
  }
  
  // Validate each item
  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity < 1 || item.quantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Each item must have a valid productId and quantity (1-10)'
      });
    }
  }
  
  next();
};

// Category validation
const validateCategory = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Category name must be at least 2 characters long'
    });
  }
  
  next();
};

// Admin validation
const validateAdmin = (req, res, next) => {
  const { name, email, password, whatsappNumber } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
  }
  
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  if (!password || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }
  
  if (!whatsappNumber || !validator.isMobilePhone(whatsappNumber, 'any')) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid WhatsApp number'
    });
  }
  
  next();
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateProduct,
  validateOrder,
  validateCategory,
  validateAdmin
};
