const generateWhatsAppLink = (orderData, adminPhone) => {
  const { orderId, customerInfo, items, totalAmount } = orderData;
  
  let message = `🛒 *New Order Received*\n`;
  message += `━━━━━━━━━━━━━━━━\n\n`;
  message += `📋 *Order ID:* ${orderId}\n`;
  message += `👤 *Customer:* ${customerInfo.name}\n`;
  message += `📞 *Phone:* ${customerInfo.phone}\n`;
  message += `📍 *Address:* ${customerInfo.address}\n`;
  
  if (customerInfo.email) {
    message += `📧 *Email:* ${customerInfo.email}\n`;
  }
  
  message += `\n📦 *Order Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   SKU: ${item.sku || 'N/A'}\n`;
    message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}\n\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━\n`;
  message += `💰 *Total Amount: ₹${totalAmount}*\n\n`;
  message += `📅 *Order Date:* ${new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  })}\n\n`;
  message += `Please confirm this order and provide delivery details. Thank you! 🙏`;
  
  return `https://wa.me/${adminPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
};

const generateOrderConfirmationMessage = (orderData) => {
  const { orderId, customerInfo, items, totalAmount, status } = orderData;
  
  const statusEmoji = {
    'confirmed': '✅',
    'cancelled': '❌',
    'pending': '⏳'
  };
  
  const message = `
${statusEmoji[status]} *Order ${status.toUpperCase()} #${orderId}*
━━━━━━━━━━━━━━━━
👤 *Customer:* ${customerInfo.name}
📱 *Phone:* ${customerInfo.phone}

📦 *Items:*
${items.map(item => 
  `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
).join('\n')}
━━━━━━━━━━━━━━━━
💰 *Total: ₹${totalAmount}*

${status === 'confirmed' ? 
  '✅ Order confirmed! We will process your order shortly.' : 
  status === 'cancelled' ? 
  '❌ Order cancelled. Please contact us if you have any questions.' :
  '⏳ Order is being processed. We will update you soon.'
}
  `.trim();
  
  return message;
};

const generateLowStockAlert = (products) => {
  const message = `
⚠️ *LOW STOCK ALERT*
━━━━━━━━━━━━━━━━
The following products are running low on stock:

${products.map(product => 
  `• ${product.name} - Only ${product.stock} left`
).join('\n')}

🔗 *Take Action:* ${process.env.FRONTEND_URL}/admin/products
  `.trim();
  
  return message;
};

const generateSalesReport = (reportData) => {
  const { period, totalSales, totalOrders, topProducts, lowStockCount } = reportData;
  
  const message = `
📊 *SALES REPORT - ${period}*
━━━━━━━━━━━━━━━━
💰 *Total Sales:* ₹${totalSales}
📦 *Total Orders:* ${totalOrders}
📈 *Average Order Value:* ₹${Math.round(totalSales / totalOrders)}

🏆 *Top Products:*
${topProducts.map((product, index) => 
  `${index + 1}. ${product.name} - ${product.sold} sold`
).join('\n')}

⚠️ *Low Stock Products:* ${lowStockCount}

🔗 *View Full Report:* ${process.env.FRONTEND_URL}/admin/analytics
  `.trim();
  
  return message;
};

module.exports = {
  generateWhatsAppLink,
  generateOrderConfirmationMessage,
  generateLowStockAlert,
  generateSalesReport
};
