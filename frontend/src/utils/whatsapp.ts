import { Order } from '../types';
import { formatDateTime } from './helpers';

export const sendOrderToWhatsApp = (order: Order, adminWhatsApp: string) => {
  const message = generateOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${adminWhatsApp.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

export const sendMessageToWhatsApp = (message: string, phoneNumber: string) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

export const generateOrderMessage = (order: Order): string => {
  const { orderId, customerInfo, items, totalAmount } = order;
  
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
  message += `📅 *Order Date:* ${formatDateTime(new Date())}\n\n`;
  message += `Please confirm this order and provide delivery details. Thank you! 🙏`;
  
  return message;
};

export const generateOrderConfirmationMessage = (order: Order): string => {
  const { orderId, customerInfo, totalAmount } = order;
  
  let message = `✅ *Order Confirmed*\n\n`;
  message += `📋 *Order ID:* ${orderId}\n`;
  message += `👤 *Customer:* ${customerInfo.name}\n`;
  message += `💰 *Total Amount:* ₹${totalAmount}\n`;
  message += `📅 *Order Date:* ${formatDateTime(new Date())}\n\n`;
  message += `Thank you for your order! We'll process it shortly and contact you for delivery details.`;
  
  return message;
};

export const generateOrderCancellationMessage = (order: Order, reason: string): string => {
  const { orderId, customerInfo, totalAmount } = order;
  
  let message = `❌ *Order Cancelled*\n\n`;
  message += `📋 *Order ID:* ${orderId}\n`;
  message += `👤 *Customer:* ${customerInfo.name}\n`;
  message += `💰 *Total Amount:* ₹${totalAmount}\n`;
  message += `📅 *Order Date:* ${formatDateTime(new Date())}\n`;
  message += `❌ *Cancellation Reason:* ${reason}\n\n`;
  message += `We apologize for any inconvenience. If you have any questions, please contact us.`;
  
  return message;
};
