import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Phone, Mail, MapPin, Package, ArrowLeft, Share2 } from 'lucide-react';
import { useOrderStatus } from '../../hooks/useOrders';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Image } from '../../components/common/Image';
import { Skeleton } from '../../components/common/Loader';
import { formatPrice, formatDateTime } from '../../utils/helpers';
import { sendMessageToWhatsApp } from '../../utils/whatsapp';
import { Order } from '../../types';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: orderData, isLoading, error } = useOrderStatus(orderId || '');
  
  // Extract order data from the response
  const orderDetails = orderData as Order | undefined;
  const orderStatus = orderDetails?.status;

  // Don't render anything if orderId is missing or invalid
  if (!orderId || orderId === 'undefined' || orderId === 'null') {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">
              Invalid Order ID
            </h1>
            <p className="text-secondary-600 mb-8">
              The order ID in the URL is missing or invalid.
            </p>
            <Link to="/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleContactAdmin = () => {
    const adminWhatsApp = import.meta.env.VITE_ADMIN_WHATSAPP || '+919876543210';
    const message = `Hi! I have a question about my order ${orderId}.`;
    sendMessageToWhatsApp(message, adminWhatsApp);
  };

  const handleShareOrder = async () => {
    const orderUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order ${orderId}`,
          text: `Check out my order details`,
          url: orderUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(orderUrl);
      // You could show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderData || !orderDetails) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">
              Order Not Found
            </h1>
            <p className="text-secondary-600 mb-8">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-secondary-600 mb-4">
            Thank you for your order. We'll process it shortly and contact you for delivery details.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant={statusColors[orderStatus || 'pending'] as any} size="lg">
              {statusLabels[orderStatus || 'pending']}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareOrder}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Order
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Order Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600">Order ID</label>
                  <p className="text-lg font-semibold text-secondary-900">{orderDetails.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Order Date</label>
                  <p className="text-lg font-semibold text-secondary-900">
                    {formatDateTime(orderDetails.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Status</label>
                  <div className="mt-1">
                    <Badge variant={statusColors[orderStatus || 'pending'] as any}>
                      {statusLabels[orderStatus || 'pending']}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Total Amount</label>
                  <p className="text-lg font-semibold text-secondary-900">
                    {formatPrice(orderDetails.totalAmount)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Customer Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {orderDetails.customerInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{orderDetails.customerInfo.name}</p>
                    <p className="text-sm text-secondary-600">{orderDetails.customerInfo.phone}</p>
                  </div>
                </div>
                
                {orderDetails.customerInfo.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-secondary-400" />
                    <span className="text-secondary-700">{orderDetails.customerInfo.email}</span>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-secondary-400 mt-0.5" />
                  <span className="text-secondary-700">{orderDetails.customerInfo.address}</span>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Order Items
              </h2>
              
              <div className="space-y-4">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 py-4 border-b border-secondary-100 last:border-b-0">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-secondary-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        lazy
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-secondary-900 truncate">
                        {item.name}
                      </h3>
                      {item.sku && (
                        <p className="text-sm text-secondary-500">SKU: {item.sku}</p>
                      )}
                      <p className="text-sm text-secondary-600">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-secondary-200 pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(orderDetails.totalAmount)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Admin */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Need Help?
              </h3>
              <p className="text-sm text-secondary-600 mb-4">
                Have questions about your order? Contact us directly via WhatsApp.
              </p>
              <Button
                onClick={handleContactAdmin}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Admin
              </Button>
            </Card>

            {/* Order Tracking */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Track Your Order
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-secondary-700">Order Placed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    orderStatus === 'confirmed' ? 'bg-green-100' : 'bg-secondary-100'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      orderStatus === 'confirmed' ? 'bg-green-600' : 'bg-secondary-400'
                    }`} />
                  </div>
                  <span className="text-sm text-secondary-700">Order Confirmed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-secondary-400" />
                  </div>
                  <span className="text-sm text-secondary-700">Out for Delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-secondary-400" />
                  </div>
                  <span className="text-sm text-secondary-700">Delivered</span>
                </div>
              </div>
            </Card>

            {/* Continue Shopping */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Continue Shopping
              </h3>
              <p className="text-sm text-secondary-600 mb-4">
                Discover more amazing products in our store.
              </p>
              <Link to="/products">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
