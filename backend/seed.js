const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    image: '/placeholder-category.jpg',
    isActive: true,
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    image: '/placeholder-category.jpg',
    isActive: true,
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    image: '/placeholder-category.jpg',
    isActive: true,
  },
  {
    name: 'Sports',
    slug: 'sports',
    image: '/placeholder-category.jpg',
    isActive: true,
  },
];

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    category: 'electronics',
    price: 2999,
    discountPrice: 2499,
    images: ['/placeholder-image.svg'],
    stock: 50,
    maxOrderQuantity: 5,
    sku: 'WBH-001',
    tags: ['wireless', 'bluetooth', 'headphones'],
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Noise Cancellation': 'Active',
    },
    ratings: {
      average: 4.5,
      count: 128,
    },
    isActive: true,
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
    category: 'clothing',
    price: 599,
    discountPrice: 499,
    images: ['/placeholder-image.svg'],
    stock: 100,
    maxOrderQuantity: 10,
    sku: 'CTS-001',
    tags: ['cotton', 't-shirt', 'casual'],
    specifications: {
      'Material': '100% Cotton',
      'Care': 'Machine Washable',
      'Fit': 'Regular',
    },
    ratings: {
      average: 4.2,
      count: 89,
    },
    isActive: true,
  },
  {
    name: 'Garden Tools Set',
    description: 'Complete set of gardening tools for all your gardening needs.',
    category: 'home-garden',
    price: 1999,
    discountPrice: 1799,
    images: ['/placeholder-image.svg'],
    stock: 25,
    maxOrderQuantity: 3,
    sku: 'GTS-001',
    tags: ['garden', 'tools', 'outdoor'],
    specifications: {
      'Material': 'Stainless Steel',
      'Handle': 'Ergonomic',
      'Items': '5 pieces',
    },
    ratings: {
      average: 4.7,
      count: 45,
    },
    isActive: true,
  },
  {
    name: 'Yoga Mat',
    description: 'Premium non-slip yoga mat for all types of exercises.',
    category: 'sports',
    price: 1299,
    discountPrice: 1099,
    images: ['/placeholder-image.svg'],
    stock: 75,
    maxOrderQuantity: 5,
    sku: 'YM-001',
    tags: ['yoga', 'exercise', 'fitness'],
    specifications: {
      'Material': 'PVC',
      'Thickness': '6mm',
      'Size': '72" x 24"',
    },
    ratings: {
      average: 4.3,
      count: 67,
    },
    isActive: true,
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring and GPS.',
    category: 'electronics',
    price: 8999,
    discountPrice: 7999,
    images: ['/placeholder-image.svg'],
    stock: 30,
    maxOrderQuantity: 2,
    sku: 'SW-001',
    tags: ['smartwatch', 'fitness', 'gps'],
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery': '7 days',
      'Water Resistance': '5ATM',
    },
    ratings: {
      average: 4.6,
      count: 156,
    },
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Inserted ${categories.length} categories`);
    
    // Update products with category IDs
    const updatedProducts = sampleProducts.map(product => {
      const category = categories.find(cat => cat.slug === product.category);
      return {
        ...product,
        category: category._id,
      };
    });
    
    // Insert products
    const products = await Product.insertMany(updatedProducts);
    console.log(`Inserted ${products.length} products`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();







