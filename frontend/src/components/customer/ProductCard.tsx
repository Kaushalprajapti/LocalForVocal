import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Product } from '../../types';
import { Image } from '../common/Image';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoriteContext';
import { formatPrice, calculateDiscountPercentage, getStockStatus } from '../../utils/helpers';
import { useNotification } from '../../context/NotificationContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { showSuccess, showError } = useNotification();
  
  const stockStatus = getStockStatus(product.stock);
  const discountPercentage = product.discountPrice 
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;
  
  const currentPrice = product.discountPrice || product.price;
  const isInCartItem = isInCart(product._id);

  const handleAddToCart = () => {
    try {
      addToCart(product, 1);
      showSuccess(`${product.name} added to cart!`);
    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleRemoveFromCart = () => {
    try {
      removeFromCart(product._id);
      showSuccess(`${product.name} removed from cart!`);
    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleQuickView = () => {
    onQuickView?.(product);
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite(product._id)) {
        await removeFromFavorites(product._id);
        showSuccess('Removed from favorites');
      } else {
        await addToFavorites(product);
        showSuccess('Added to favorites');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to update favorites');
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            lazy
          />
        </Link>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge
            variant="error"
            size="sm"
            className="absolute top-2 left-2"
          >
            -{discountPercentage}%
          </Badge>
        )}
        
        {/* Stock Status Badge */}
        {stockStatus.status === 'out-of-stock' && (
          <Badge
            variant="error"
            size="sm"
            className="absolute top-2 right-2"
          >
            Out of Stock
          </Badge>
        )}
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuickView()}
            className="bg-white/90 hover:bg-white text-secondary-900"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteToggle}
            className={`bg-white/90 hover:bg-white text-secondary-900 ${
              isFavorite(product._id) ? 'text-red-500' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite(product._id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-secondary-500 mb-1">
          {product.category.name}
        </p>
        
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-medium text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.ratings.average)
                    ? 'text-yellow-400 fill-current'
                    : 'text-secondary-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-secondary-500">
            ({product.ratings.count})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-semibold text-secondary-900">
            {formatPrice(currentPrice)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-secondary-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium ${stockStatus.color}`}>
            {stockStatus.message}
          </span>
          {product.sku && (
            <span className="text-xs text-secondary-500">
              SKU: {product.sku}
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button
          onClick={isInCartItem ? handleRemoveFromCart : handleAddToCart}
          disabled={product.stock === 0 && !isInCartItem}
          className={`w-full ${isInCartItem ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
          size="sm"
        >
          {isInCartItem ? (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Remove from Cart
            </>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
