export const validators = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return true;
  },

  email: (value: string) => {
    if (!value) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },

  phone: (value: string) => {
    if (!value) return 'Phone number is required';
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
    return true;
  },

  minLength: (min: number) => (value: string) => {
    if (!value) return true;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return true;
  },

  maxLength: (max: number) => (value: string) => {
    if (!value) return true;
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return true;
  },

  min: (min: number) => (value: number) => {
    if (value < min) {
      return `Must be at least ${min}`;
    }
    return true;
  },

  max: (max: number) => (value: number) => {
    if (value > max) {
      return `Must be no more than ${max}`;
    }
    return true;
  },

  positive: (value: number) => {
    if (value <= 0) {
      return 'Must be a positive number';
    }
    return true;
  },

  integer: (value: number) => {
    if (!Number.isInteger(value)) {
      return 'Must be a whole number';
    }
    return true;
  },

  url: (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  password: (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    return true;
  },

  confirmPassword: (password: string) => (value: string) => {
    if (value !== password) {
      return 'Passwords do not match';
    }
    return true;
  },

  termsAccepted: (value: boolean) => {
    if (!value) {
      return 'You must accept the terms and conditions';
    }
    return true;
  },

  // Custom validators for e-commerce
  stockQuantity: (value: number) => {
    if (value < 0) {
      return 'Stock quantity cannot be negative';
    }
    return true;
  },

  maxOrderQuantity: (value: number) => {
    if (value < 1) {
      return 'Maximum order quantity must be at least 1';
    }
    if (value > 10) {
      return 'Maximum order quantity cannot exceed 10';
    }
    return true;
  },

  price: (value: number) => {
    if (value < 0) {
      return 'Price cannot be negative';
    }
    return true;
  },

  discountPrice: (originalPrice: number) => (value: number) => {
    if (value < 0) {
      return 'Discount price cannot be negative';
    }
    if (value >= originalPrice) {
      return 'Discount price must be less than original price';
    }
    return true;
  },

  sku: (value: string) => {
    if (!value) return true; // Optional field
    const skuRegex = /^[A-Z0-9-_]+$/;
    if (!skuRegex.test(value)) {
      return 'SKU must contain only uppercase letters, numbers, hyphens, and underscores';
    }
    return true;
  },

  phoneNumber: (value: string) => {
    if (!value) return 'Phone number is required';
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      return 'Please enter a valid phone number (10-15 digits)';
    }
    return true;
  },

  address: (value: string) => {
    if (!value) return 'Address is required';
    if (value.trim().length < 10) {
      return 'Address must be at least 10 characters long';
    }
    return true;
  },
};

export const validateForm = (data: Record<string, any>, rules: Record<string, any[]>) => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      const result = rule(value);
      if (result !== true) {
        errors[field] = result;
        break; // Stop at first error for this field
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
