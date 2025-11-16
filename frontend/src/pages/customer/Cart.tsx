import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { Image } from '../../components/common/Image';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { formatPrice, getStockStatus } from '../../utils/helpers';

const Cart: React.FC = () => {
  const { state: cartState, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showSuccess } = useNotification();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      showSuccess('Item removed from cart');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    showSuccess(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    showSuccess('Cart cleared');
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
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products">
              <Button size="lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Shopping Cart
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-secondary-600">
              {cartState.totalItems} {cartState.totalItems === 1 ? 'item' : 'items'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartState.items.map((item) => {
              const stockStatus = getStockStatus(item.product.stock);
              const currentPrice = item.product.discountPrice || item.product.price;
              const maxQuantity = Math.min(item.product.maxOrderQuantity, item.product.stock);
              
              return (
                <Card key={item.product._id} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 bg-white rounded-lg overflow-hidden border border-secondary-200">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        lazy
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-secondary-900 hover:text-primary-600">
                            <Link to={`/product/${item.product._id}`}>
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-secondary-500">
                            {item.product.category.name}
                          </p>
                          {item.product.sku && (
                            <p className="text-xs text-secondary-400">
                              SKU: {item.product.sku}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product._id, item.product.name)}
                          className="text-secondary-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-secondary-900">
                          {formatPrice(currentPrice)}
                        </span>
                        {item.product.discountPrice && (
                          <span className="text-sm text-secondary-500 line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.message}
                        </span>
                        {item.product.stock > 0 && (
                          <span className="text-xs text-secondary-500">
                            ({item.product.stock} available)
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-secondary-700">Quantity:</span>
                        <div className="flex items-center border border-secondary-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            disabled={item.quantity >= maxQuantity}
                            className="p-2 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-xs text-secondary-500">
                          Max: {maxQuantity}
                        </span>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-lg font-semibold text-secondary-900">
                          {formatPrice(currentPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4">
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
                
                <div className="border-t border-secondary-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(cartState.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-secondary-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Free Returns</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
