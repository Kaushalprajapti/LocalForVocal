import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Trash2 } from 'lucide-react';
import { useFavorites } from '../../context/FavoriteContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Image } from '../../components/common/Image';
import { QuickViewModal } from '../../components/customer/QuickViewModal';
import { formatPrice } from '../../utils/helpers';
import { Product } from '../../types';

const Favorites: React.FC = () => {
  const { state, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { showSuccess, showError } = useNotification();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleAddToCart = async (item: any) => {
    try {
      // Convert favorite item back to product format
      const product = {
        _id: item.id,
        name: item.name,
        price: item.price,
        discountPrice: item.discountPrice,
        images: item.images,
        stock: 10, // Default stock for favorites
        maxOrderQuantity: 10,
        category: { 
          _id: 'temp-category-id',
          name: item.category,
          slug: item.category.toLowerCase().replace(/\s+/g, '-'),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ratings: { average: 4.5, count: 0 },
        sku: '',
        description: '',
        specifications: {},
        tags: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addToCart(product, 1);
      showSuccess(`${item.name} added to cart!`);
    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    try {
      removeFromCart(itemId);
      showSuccess('Removed from cart!');
    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleQuickView = (item: any) => {
    // Convert favorite item to product format for QuickViewModal
    const product = {
      _id: item.id,
      name: item.name,
      price: item.price,
      discountPrice: item.discountPrice,
      images: item.images,
      stock: 10,
      maxOrderQuantity: 10,
      category: { 
        _id: 'temp-category-id',
        name: item.category,
        slug: item.category.toLowerCase().replace(/\s+/g, '-'),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ratings: { average: 4.5, count: 0 },
      sku: '',
      description: '',
      specifications: {},
      tags: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const handleRemoveFromFavorites = async (itemId: string) => {
    try {
      await removeFromFavorites(itemId);
      showSuccess('Removed from favorites');
    } catch (error: any) {
      showError('Failed to remove from favorites');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all items from favorites?')) {
    clearFavorites();
      showSuccess('All favorites cleared');
    }
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            {state.error}
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
          </div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              No Favorites Yet
            </h1>
            <p className="text-lg text-secondary-600 mb-8 max-w-md mx-auto">
              Start adding products to your favorites by clicking the heart icon on any product.
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                Browse Products
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
              <div>
            <h1 className="text-3xl font-bold text-secondary-900">
                  My Favorites
                </h1>
            <p className="text-secondary-600 mt-2">
              {state.items.length} {state.items.length === 1 ? 'item' : 'items'} saved
                </p>
            </div>
            
            {state.items.length > 0 && (
              <Button
                variant="outline"
              onClick={handleClearAll}
              className="text-red-600 border-red-600 hover:bg-red-50"
              >
              <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.items.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <Link to={`/product/${item.id}`}>
                  <Image
                    src={item.images[0] || '/placeholder-image.svg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    lazy
                  />
                </Link>
                
                {/* Remove from Favorites Button */}
                <button
                  onClick={() => handleRemoveFromFavorites(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title="Remove from favorites"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                <p className="text-xs text-secondary-500 mb-1">
                  {item.category}
                </p>
                
                {/* Product Name */}
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-medium text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {item.name}
              </h3>
                </Link>
                
                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-semibold text-secondary-900">
                    {formatPrice(item.discountPrice || item.price)}
                  </span>
                  {item.discountPrice && (
                    <span className="text-sm text-secondary-500 line-through">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={isInCart(item.id) ? () => handleRemoveFromCart(item.id) : () => handleAddToCart(item)}
                    className={`flex-1 ${isInCart(item.id) ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInCart(item.id) ? 'Remove from Cart' : 'Add to Cart'}
                  </Button>
                  
                  <Button
                    onClick={() => handleQuickView(item)}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Eye className="h-4 w-4" />
                </Button>
                </div>
            </div>
          </Card>
            ))}
          </div>

        {/* Bottom Actions */}
        {state.items.length > 0 && (
          <div className="mt-12 text-center">
            <Link to="/products">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        product={quickViewProduct}
      />
    </div>
  );
};

export default Favorites;