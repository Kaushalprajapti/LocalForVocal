import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ShoppingBag, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCreateOrder } from '../../hooks/useOrders';
import { useNotification } from '../../context/NotificationContext';
import { Image } from '../../components/common/Image';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { formatPrice, validateEmail, validatePhone } from '../../utils/helpers';
import { sendOrderToWhatsApp } from '../../utils/whatsapp';

interface CheckoutForm {
  name: string;
  phone: string;
  email?: string;
  address: string;
  termsAccepted: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart, removeInvalidProducts } = useCart();
  const { showSuccess, showError } = useNotification();
  const createOrderMutation = useCreateOrder();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Save order to localStorage for customer order history
  const saveOrderToLocalStorage = (order: any, whatsappLink?: string) => {
    try {
      const existingOrders = localStorage.getItem('customerOrders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      
      // Add the new order with WhatsApp link
      const orderWithWhatsApp = {
        ...order,
        whatsappLink: whatsappLink
      };
      
      orders.push(orderWithWhatsApp);
      localStorage.setItem('customerOrders', JSON.stringify(orders));
      
      console.log('Order saved to localStorage:', orderWithWhatsApp);
    } catch (error) {
      console.error('Error saving order to localStorage:', error);
    }
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutForm>({
    defaultValues: {
      termsAccepted: false,
    },
  });

  const watchedEmail = watch('email');

  const onSubmit = async (data: CheckoutForm) => {
    if (cartState.items.length === 0) {
      showError('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create order
      const orderData = {
        customerInfo: {
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          address: data.address,
        },
        items: cartState.items.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          image: item.product.images[0] || '',
          sku: item.product.sku || '',
        })),
        totalAmount: cartState.totalAmount,
      };

      console.log('Order data being sent:', orderData);
      const response = await createOrderMutation.mutateAsync(orderData);
      
      // Extract order data from response
      // Handle both cases: response is order object OR response has order property
      const order = response.order || response;
      const whatsappLink = response.whatsappLink;
      
      console.log('Order response:', response);
      console.log('Extracted order:', order);
      console.log('WhatsApp link:', whatsappLink);
      
      // Save order to localStorage for customer order history
      saveOrderToLocalStorage(order, whatsappLink);
      
      // Clear cart
      clearCart();
      
      // Send to WhatsApp using the link from backend
      if (whatsappLink) {
        console.log('WhatsApp link:', whatsappLink);
        // Try to open WhatsApp
        try {
          const whatsappWindow = window.open(whatsappLink, '_blank', 'noopener,noreferrer');
          if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed == 'undefined') {
            // Fallback: show the link to user
            const userConfirmed = confirm(`WhatsApp popup was blocked. Would you like to open WhatsApp manually?\n\nClick OK to copy the link to clipboard.`);
            if (userConfirmed) {
              navigator.clipboard.writeText(whatsappLink).then(() => {
                alert('WhatsApp link copied to clipboard! Please paste it in your browser to open WhatsApp.');
              }).catch(() => {
                alert(`Please manually open this link: ${whatsappLink}`);
              });
            }
          }
        } catch (error) {
          console.error('WhatsApp popup error:', error);
          alert(`Please manually open this WhatsApp link: ${whatsappLink}`);
        }
      } else {
        // Fallback: generate WhatsApp link on frontend
        const adminWhatsApp = import.meta.env.VITE_ADMIN_WHATSAPP || '+919876543210';
        sendOrderToWhatsApp(order, adminWhatsApp);
      }
      
      // Navigate to confirmation page
      const orderId = order.orderId || order.id;
      console.log('Navigating to order:', orderId);
      console.log('Order object keys:', Object.keys(order));
      console.log('Order.orderId:', order.orderId);
      console.log('Order.id:', order.id);
      navigate(`/order/${orderId}`);
      
    } catch (error: any) {
      console.error('Order creation error:', error);
      
      // Handle specific product not found errors
      if (error.response?.data?.productId) {
        const { productId, productName } = error.response.data;
        showError(`${productName} is no longer available. It has been removed from your cart. Please try again.`);
        
        // Remove the invalid product from cart
        removeInvalidProducts([productId]);
      } else {
        showError(error.response?.data?.message || error.message || 'Failed to create order');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-secondary-400" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-secondary-600 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Checkout
          </h1>
          <p className="text-secondary-600">
            Complete your order by providing the required information
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Customer Information
                </h2>
                
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                    error={errors.name?.message}
                    required
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      validate: (value) => validatePhone(value) || 'Please enter a valid phone number'
                    })}
                    error={errors.phone?.message}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    {...register('email', {
                      validate: (value) => !value || validateEmail(value) || 'Please enter a valid email address'
                    })}
                    error={errors.email?.message}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('address', { 
                        required: 'Address is required',
                        minLength: { value: 10, message: 'Address must be at least 10 characters' }
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your complete delivery address..."
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Terms and Conditions */}
              <Card className="p-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('termsAccepted', { required: 'You must accept the terms and conditions' })}
                    className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <label className="text-sm text-secondary-700">
                      I agree to the{' '}
                      <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-sm text-red-600 mt-1">{errors.termsAccepted.message}</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Order Summary
                </h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartState.items.map((item) => {
                    const currentPrice = item.product.discountPrice || item.product.price;
                    return (
                      <div key={item.product._id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-secondary-200">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            lazy
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-secondary-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-secondary-500">
                            Qty: {item.quantity} × {formatPrice(currentPrice)}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-secondary-900">
                          {formatPrice(currentPrice * item.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Order Total */}
                <div className="border-t border-secondary-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Subtotal ({cartState.totalItems} items)</span>
                    <span className="font-medium">{formatPrice(cartState.totalAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Tax</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  
                  <div className="border-t border-secondary-200 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(cartState.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* WhatsApp Order Button */}
              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Place Order via WhatsApp
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                      Your order will be sent directly to our WhatsApp for quick processing and confirmation.
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Security Info */}
              <div className="text-center text-xs text-secondary-500">
                <div className="flex items-center justify-center space-x-4 mb-2">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free Returns</span>
                  </div>
                </div>
                <p>Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
