const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Order = require('../models/Order');

// Sync customer orders from localStorage to MongoDB
router.post('/sync', async (req, res) => {
  try {
    const { orders } = req.body;
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        message: 'Orders array is required'
      });
    }

    const syncedOrders = [];
    const errors = [];

    for (const orderData of orders) {
      try {
        // Check if order already exists
        const existingOrder = await Order.findOne({ orderId: orderData.orderId });
        
        if (existingOrder) {
          // Update existing order with customer data
          existingOrder.customerInfo = orderData.customerInfo;
          existingOrder.whatsappLink = orderData.whatsappLink;
          await existingOrder.save();
          syncedOrders.push(existingOrder);
        } else {
          // Create new order
          const newOrder = new Order({
            orderId: orderData.orderId,
            customerInfo: orderData.customerInfo,
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            status: orderData.status || 'pending',
            whatsappLink: orderData.whatsappLink,
            createdAt: orderData.createdAt ? new Date(orderData.createdAt) : new Date()
          });
          
          await newOrder.save();
          syncedOrders.push(newOrder);
        }
      } catch (error) {
        console.error(`Error syncing order ${orderData.orderId}:`, error);
        errors.push({
          orderId: orderData.orderId,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${syncedOrders.length} orders successfully`,
      data: {
        syncedCount: syncedOrders.length,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('Error syncing orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing orders',
      error: error.message
    });
  }
});

// Get customer orders (for admin to view all orders)
router.get('/customer-orders', protect, authorize('super-admin', 'admin', 'staff'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer orders',
      error: error.message
    });
  }
});

// Update order status (for admin)
router.put('/:orderId/status', protect, authorize('super-admin', 'admin'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    if (reason) {
      order.statusReason = reason;
    }
    order.updatedAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: {
          id: order._id,
          orderId: order.orderId,
          status: order.status,
          statusReason: order.statusReason,
          updatedAt: order.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Get order details by orderId
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

module.exports = router;
