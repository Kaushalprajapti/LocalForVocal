const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Dummy data
const dummyData = {
  admins: [
    {
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      whatsappNumber: '+1234567890',
      role: 'super-admin',
      isActive: true
    },
    {
      name: 'John Manager',
      email: 'manager@example.com',
      password: 'manager123',
      whatsappNumber: '+1234567891',
      role: 'admin',
      isActive: true
    },
    {
      name: 'Jane Staff',
      email: 'staff@example.com',
      password: 'staff123',
      whatsappNumber: '+1234567892',
      role: 'staff',
      isActive: true
    }
  ],

  categories: [
    {
      name: 'Electronics',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
      isActive: true
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
      isActive: true
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      isActive: true
    },
    {
      name: 'Sports',
      slug: 'sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
      isActive: true
    },
    {
      name: 'Books',
      slug: 'books',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      isActive: true
    }
  ],

  products: [
    // Electronics
    {
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced camera system and A17 Pro chip',
      category: null, // Will be set after categories are created
      subCategory: 'Smartphones',
      price: 999,
      discountPrice: 899,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
      ],
      stock: 50,
      maxOrderQuantity: 2,
      sku: 'IPH15PRO-128',
      tags: ['smartphone', 'apple', 'premium', 'camera'],
      specifications: {
        'Storage': '128GB',
        'Color': 'Natural Titanium',
        'Display': '6.1 inch Super Retina XDR',
        'Camera': '48MP Main Camera'
      },
      ratings: {
        average: 4.8,
        count: 245
      },
      isActive: true
    },
    {
      name: 'MacBook Air M2',
      description: 'Lightweight laptop with M2 chip and all-day battery life',
      category: null,
      subCategory: 'Laptops',
      price: 1199,
      discountPrice: 1099,
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
      ],
      stock: 30,
      maxOrderQuantity: 1,
      sku: 'MBA-M2-256',
      tags: ['laptop', 'apple', 'macbook', 'm2'],
      specifications: {
        'Chip': 'Apple M2',
        'Memory': '8GB',
        'Storage': '256GB SSD',
        'Display': '13.6 inch Liquid Retina'
      },
      ratings: {
        average: 4.7,
        count: 189
      },
      isActive: true
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise canceling wireless headphones',
      category: null,
      subCategory: 'Audio',
      price: 399,
      discountPrice: 349,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
      ],
      stock: 75,
      maxOrderQuantity: 3,
      sku: 'SONY-WH1000XM5',
      tags: ['headphones', 'wireless', 'noise-canceling', 'premium'],
      specifications: {
        'Type': 'Over-ear',
        'Connectivity': 'Bluetooth 5.2',
        'Battery Life': '30 hours',
        'Noise Canceling': 'Yes'
      },
      ratings: {
        average: 4.6,
        count: 312
      },
      isActive: true
    },

    // Clothing
    {
      name: 'Classic White T-Shirt',
      description: 'Premium cotton t-shirt with comfortable fit',
      category: null,
      subCategory: 'Tops',
      price: 29,
      discountPrice: 24,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'
      ],
      stock: 200,
      maxOrderQuantity: 10,
      sku: 'TSHIRT-WHITE-M',
      tags: ['t-shirt', 'cotton', 'basic', 'casual'],
      specifications: {
        'Material': '100% Cotton',
        'Fit': 'Regular',
        'Care': 'Machine Wash',
        'Sizes': 'S, M, L, XL'
      },
      ratings: {
        average: 4.3,
        count: 156
      },
      isActive: true
    },
    {
      name: 'Denim Jeans',
      description: 'Classic blue denim jeans with modern fit',
      category: null,
      subCategory: 'Bottoms',
      price: 79,
      discountPrice: 69,
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        'https://images.unsplash.com/photo-1506629905607-3a5b4b0b0b0b?w=500'
      ],
      stock: 150,
      maxOrderQuantity: 5,
      sku: 'JEANS-DENIM-32',
      tags: ['jeans', 'denim', 'casual', 'bottoms'],
      specifications: {
        'Material': '98% Cotton, 2% Elastane',
        'Fit': 'Slim',
        'Wash': 'Medium Blue',
        'Sizes': '28, 30, 32, 34, 36'
      },
      ratings: {
        average: 4.4,
        count: 203
      },
      isActive: true
    },

    // Home & Garden
    {
      name: 'Smart Home Speaker',
      description: 'Voice-controlled smart speaker with excellent sound quality',
      category: null,
      subCategory: 'Smart Home',
      price: 99,
      discountPrice: 79,
      images: [
        'https://images.unsplash.com/photo-1543512214-318c7553f226?w=500',
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'
      ],
      stock: 80,
      maxOrderQuantity: 2,
      sku: 'SMART-SPEAKER-1',
      tags: ['smart-home', 'speaker', 'voice-control', 'wifi'],
      specifications: {
        'Connectivity': 'WiFi, Bluetooth',
        'Voice Assistant': 'Yes',
        'Power': 'AC Adapter',
        'Compatibility': 'iOS, Android'
      },
      ratings: {
        average: 4.2,
        count: 98
      },
      isActive: true
    },
    {
      name: 'Indoor Plant Set',
      description: 'Beautiful collection of easy-care indoor plants',
      category: null,
      subCategory: 'Plants',
      price: 49,
      discountPrice: 39,
      images: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500'
      ],
      stock: 60,
      maxOrderQuantity: 3,
      sku: 'PLANTS-INDOOR-SET',
      tags: ['plants', 'indoor', 'decorative', 'low-maintenance'],
      specifications: {
        'Set Includes': '3 Plants',
        'Pot Size': '6 inch',
        'Care Level': 'Easy',
        'Light': 'Bright Indirect'
      },
      ratings: {
        average: 4.5,
        count: 67
      },
      isActive: true
    },

    // Sports
    {
      name: 'Running Shoes',
      description: 'Lightweight running shoes with excellent cushioning',
      category: null,
      subCategory: 'Footwear',
      price: 129,
      discountPrice: 109,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
      ],
      stock: 100,
      maxOrderQuantity: 2,
      sku: 'RUNNING-SHOES-10',
      tags: ['running', 'shoes', 'athletic', 'lightweight'],
      specifications: {
        'Type': 'Running',
        'Cushioning': 'High',
        'Weight': 'Light',
        'Sizes': '7-12'
      },
      ratings: {
        average: 4.6,
        count: 178
      },
      isActive: true
    },
    {
      name: 'Yoga Mat',
      description: 'Premium non-slip yoga mat for all types of exercises',
      category: null,
      subCategory: 'Fitness',
      price: 39,
      discountPrice: 29,
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        'https://images.unsplash.com/photo-1506629905607-3a5b4b0b0b0b?w=500'
      ],
      stock: 120,
      maxOrderQuantity: 5,
      sku: 'YOGA-MAT-PREMIUM',
      tags: ['yoga', 'mat', 'fitness', 'non-slip'],
      specifications: {
        'Material': 'PVC',
        'Thickness': '6mm',
        'Size': '72" x 24"',
        'Weight': '2.5 lbs'
      },
      ratings: {
        average: 4.4,
        count: 89
      },
      isActive: true
    },

    // Books
    {
      name: 'JavaScript: The Complete Guide',
      description: 'Comprehensive guide to modern JavaScript development',
      category: null,
      subCategory: 'Programming',
      price: 49,
      discountPrice: 39,
      images: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
      ],
      stock: 80,
      maxOrderQuantity: 3,
      sku: 'BOOK-JS-GUIDE',
      tags: ['javascript', 'programming', 'book', 'development'],
      specifications: {
        'Pages': '800',
        'Format': 'Paperback',
        'Language': 'English',
        'Publisher': 'Tech Books Inc'
      },
      ratings: {
        average: 4.7,
        count: 134
      },
      isActive: true
    },
    {
      name: 'Design Patterns Book',
      description: 'Essential design patterns for software developers',
      category: null,
      subCategory: 'Programming',
      price: 59,
      discountPrice: 49,
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'
      ],
      stock: 65,
      maxOrderQuantity: 2,
      sku: 'BOOK-DESIGN-PATTERNS',
      tags: ['design-patterns', 'programming', 'book', 'software'],
      specifications: {
        'Pages': '600',
        'Format': 'Hardcover',
        'Language': 'English',
        'Publisher': 'Code Masters'
      },
      ratings: {
        average: 4.8,
        count: 98
      },
      isActive: true
    }
  ],

  orders: [
    {
      orderId: 'ORD-001',
      customerInfo: {
        name: 'John Doe',
        phone: '+1234567890',
        address: '123 Main St, New York, NY 10001',
        email: 'john.doe@example.com'
      },
      items: [
        {
          productId: null, // Will be set after products are created
          name: 'iPhone 15 Pro',
          price: 899,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
          sku: 'IPH15PRO-128'
        }
      ],
      totalAmount: 899,
      status: 'confirmed',
      whatsappMessageSent: true,
      confirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      orderId: 'ORD-002',
      customerInfo: {
        name: 'Jane Smith',
        phone: '+1234567891',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        email: 'jane.smith@example.com'
      },
      items: [
        {
          productId: null,
          name: 'MacBook Air M2',
          price: 1099,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
          sku: 'MBA-M2-256'
        },
        {
          productId: null,
          name: 'Sony WH-1000XM5 Headphones',
          price: 349,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          sku: 'SONY-WH1000XM5'
        }
      ],
      totalAmount: 1448,
      status: 'pending',
      whatsappMessageSent: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      orderId: 'ORD-003',
      customerInfo: {
        name: 'Mike Johnson',
        phone: '+1234567892',
        address: '789 Pine St, Chicago, IL 60601',
        email: 'mike.johnson@example.com'
      },
      items: [
        {
          productId: null,
          name: 'Classic White T-Shirt',
          price: 24,
          quantity: 3,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          sku: 'TSHIRT-WHITE-M'
        },
        {
          productId: null,
          name: 'Denim Jeans',
          price: 69,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
          sku: 'JEANS-DENIM-32'
        }
      ],
      totalAmount: 210,
      status: 'confirmed',
      whatsappMessageSent: true,
      confirmedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
      orderId: 'ORD-004',
      customerInfo: {
        name: 'Sarah Wilson',
        phone: '+1234567893',
        address: '321 Elm St, Miami, FL 33101',
        email: 'sarah.wilson@example.com'
      },
      items: [
        {
          productId: null,
          name: 'Running Shoes',
          price: 109,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          sku: 'RUNNING-SHOES-10'
        },
        {
          productId: null,
          name: 'Yoga Mat',
          price: 29,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
          sku: 'YOGA-MAT-PREMIUM'
        }
      ],
      totalAmount: 138,
      status: 'cancelled',
      whatsappMessageSent: false,
      cancelledAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      cancellationReason: 'Customer requested cancellation',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      orderId: 'ORD-005',
      customerInfo: {
        name: 'David Brown',
        phone: '+1234567894',
        address: '654 Maple Dr, Seattle, WA 98101',
        email: 'david.brown@example.com'
      },
      items: [
        {
          productId: null,
          name: 'JavaScript: The Complete Guide',
          price: 39,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
          sku: 'BOOK-JS-GUIDE'
        },
        {
          productId: null,
          name: 'Design Patterns Book',
          price: 49,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          sku: 'BOOK-DESIGN-PATTERNS'
        }
      ],
      totalAmount: 127,
      status: 'confirmed',
      whatsappMessageSent: true,
      confirmedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
    }
  ]
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data');

    // Create admins
    console.log('Creating admins...');
    const hashedAdmins = await Promise.all(
      dummyData.admins.map(async (admin) => ({
        ...admin,
        password: await bcrypt.hash(admin.password, 12)
      }))
    );
    const createdAdmins = await Admin.insertMany(hashedAdmins);
    console.log(`Created ${createdAdmins.length} admins`);

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(dummyData.categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create products with category references
    console.log('Creating products...');
    const electronicsCategory = createdCategories.find(cat => cat.slug === 'electronics');
    const clothingCategory = createdCategories.find(cat => cat.slug === 'clothing');
    const homeGardenCategory = createdCategories.find(cat => cat.slug === 'home-garden');
    const sportsCategory = createdCategories.find(cat => cat.slug === 'sports');
    const booksCategory = createdCategories.find(cat => cat.slug === 'books');

    const productsWithCategories = dummyData.products.map(product => {
      let categoryId = null;
      if (product.tags.includes('smartphone') || product.tags.includes('laptop') || product.tags.includes('headphones')) {
        categoryId = electronicsCategory._id;
      } else if (product.tags.includes('t-shirt') || product.tags.includes('jeans')) {
        categoryId = clothingCategory._id;
      } else if (product.tags.includes('smart-home') || product.tags.includes('plants')) {
        categoryId = homeGardenCategory._id;
      } else if (product.tags.includes('running') || product.tags.includes('yoga')) {
        categoryId = sportsCategory._id;
      } else if (product.tags.includes('javascript') || product.tags.includes('design-patterns')) {
        categoryId = booksCategory._id;
      }
      return { ...product, category: categoryId };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`Created ${createdProducts.length} products`);

    // Create orders with product references
    console.log('Creating orders...');
    const ordersWithProducts = dummyData.orders.map(order => ({
      ...order,
      items: order.items.map(item => {
        const product = createdProducts.find(p => p.sku === item.sku);
        return {
          ...item,
          productId: product ? product._id : null
        };
      })
    }));

    const createdOrders = await Order.insertMany(ordersWithProducts);
    console.log(`Created ${createdOrders.length} orders`);

    console.log('Database seeding completed successfully!');
    console.log('\n=== SEEDED DATA SUMMARY ===');
    console.log(`Admins: ${createdAdmins.length}`);
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Products: ${createdProducts.length}`);
    console.log(`Orders: ${createdOrders.length}`);
    console.log('\n=== ADMIN CREDENTIALS ===');
    console.log('Super Admin: admin@example.com / admin123');
    console.log('Manager: manager@example.com / manager123');
    console.log('Staff: staff@example.com / staff123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
connectDB().then(() => {
  seedDatabase();
});
