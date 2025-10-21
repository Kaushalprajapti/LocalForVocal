const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Admin = require('../models/Admin');

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private (Admin)
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30d', startDate, endDate } = req.query;
    
    let start, end;
    
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      switch (period) {
        case '7d':
          start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }
    }

    // Get sales summary
    const salesSummary = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Get daily sales trend
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get monthly sales trend
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get sales by status
    const salesByStatus = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        summary: salesSummary[0] || { totalSales: 0, totalOrders: 0, avgOrderValue: 0 },
        dailySales,
        monthlySales,
        salesByStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics',
      error: error.message
    });
  }
};

// @desc    Get product analytics
// @route   GET /api/admin/analytics/products
// @access  Private (Admin)
const getProductAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'confirmed'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          sku: '$product.sku',
          totalSold: 1,
          totalRevenue: 1,
          image: { $arrayElemAt: ['$product.images', 0] },
          currentStock: '$product.stock'
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Get products by category performance
    const categoryPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'confirmed'
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          productCount: { $addToSet: '$items.productId' }
        }
      },
      {
        $project: {
          categoryName: 1,
          totalSold: 1,
          totalRevenue: 1,
          productCount: { $size: '$productCount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Get low performing products
    const lowPerformingProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gte: ['$createdAt', startDate] },
                    { $lte: ['$createdAt', endDate] },
                    { $eq: ['$status', 'confirmed'] }
                  ]
                }
              }
            },
            { $unwind: '$items' },
            {
              $match: {
                $expr: { $eq: ['$items.productId', '$$productId'] }
              }
            }
          ],
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalSold: {
            $sum: '$orders.items.quantity'
          }
        }
      },
      {
        $match: {
          isActive: true,
          $or: [
            { totalSold: { $eq: 0 } },
            { totalSold: { $lt: 5 } }
          ]
        }
      },
      {
        $project: {
          name: 1,
          sku: 1,
          price: 1,
          stock: 1,
          totalSold: 1,
          image: { $arrayElemAt: ['$images', 0] }
        }
      },
      { $sort: { totalSold: 1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        period,
        topSellingProducts,
        categoryPerformance,
        lowPerformingProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product analytics',
      error: error.message
    });
  }
};

// @desc    Get low stock products
// @route   GET /api/admin/analytics/low-stock
// @access  Private (Admin)
const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const lowStockProducts = await Product.find({
      stock: { $lte: Number(threshold) },
      isActive: true
    })
      .populate('category', 'name')
      .select('name sku stock price discountPrice images category')
      .sort({ stock: 1 });

    // Get out of stock products
    const outOfStockProducts = await Product.find({
      stock: 0,
      isActive: true
    })
      .populate('category', 'name')
      .select('name sku price discountPrice images category')
      .sort({ updatedAt: -1 });

    // Get products with pending orders but low stock
    const productsWithPendingOrders = await Order.aggregate([
      {
        $match: { status: 'pending' }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $match: {
          'product.stock': { $lte: Number(threshold) },
          'product.isActive': true
        }
      },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$product.name' },
          currentStock: { $first: '$product.stock' },
          pendingQuantity: { $sum: '$items.quantity' },
          pendingOrders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          productName: 1,
          currentStock: 1,
          pendingQuantity: 1,
          pendingOrdersCount: { $size: '$pendingOrders' }
        }
      },
      { $sort: { currentStock: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        threshold: Number(threshold),
        lowStockProducts,
        outOfStockProducts,
        productsWithPendingOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock products',
      error: error.message
    });
  }
};

// @desc    Get order analytics
// @route   GET /api/admin/analytics/orders
// @access  Private (Admin)
const getOrderAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get order trends by day
    const orderTrends = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          orders: { $sum: 1 },
          confirmedOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0]
            }
          },
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
            }
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalAmount', 0]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get average order processing time
    const avgProcessingTime = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          confirmedAt: { $exists: true }
        }
      },
      {
        $project: {
          processingTimeHours: {
            $divide: [
              { $subtract: ['$confirmedAt', '$createdAt'] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgProcessingTime: { $avg: '$processingTimeHours' },
          minProcessingTime: { $min: '$processingTimeHours' },
          maxProcessingTime: { $max: '$processingTimeHours' }
        }
      }
    ]);

    // Get top customers by order count
    const topCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: '$customerInfo.phone',
          customerName: { $first: '$customerInfo.name' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        period,
        orderStatusBreakdown,
        orderTrends,
        avgProcessingTime: avgProcessingTime[0] || {
          avgProcessingTime: 0,
          minProcessingTime: 0,
          maxProcessingTime: 0
        },
        topCustomers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order analytics',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/analytics/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const yesterday = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Today's stats
    const todayStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          confirmedRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalAmount', 0] }
          }
        }
      }
    ]);

    // Yesterday's stats for comparison
    const yesterdayStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday, $lt: startOfDay }
        }
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          confirmedRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalAmount', 0] }
          }
        }
      }
    ]);

    // Overall stats
    const overallStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    // Product stats
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          lowStockProducts: {
            $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] }
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
          }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderId customerInfo totalAmount status createdAt');

    // Top selling products (last 7 days)
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeek },
          status: 'confirmed'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          totalRevenue: 1,
          image: { $arrayElemAt: ['$product.images', 0] }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        today: todayStats[0] || { orders: 0, revenue: 0, confirmedOrders: 0, confirmedRevenue: 0 },
        yesterday: yesterdayStats[0] || { orders: 0, revenue: 0, confirmedOrders: 0, confirmedRevenue: 0 },
        overall: overallStats[0] || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, confirmedOrders: 0, cancelledOrders: 0 },
        products: productStats[0] || { totalProducts: 0, activeProducts: 0, lowStockProducts: 0, outOfStockProducts: 0 },
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getSalesAnalytics,
  getProductAnalytics,
  getLowStockProducts,
  getOrderAnalytics,
  getDashboardStats
};
