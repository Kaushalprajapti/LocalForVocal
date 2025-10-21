import React from 'react';
import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Image } from '../common/Image';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoriteContext';
import { useNotification } from '../../context/NotificationContext';
import { formatPrice, calculateDiscountPercentage, getStockStatus } from '../../utils/helpers';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { showSuccess, showError } = useNotification();

  if (!product) return null;

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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-secondary-900">Quick View</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                lazy
              />
            </div>
            
            {/* Additional Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-md">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                      lazy
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            {/* Category */}
            <p className="text-sm text-secondary-500">
              {product.category.name}
            </p>

            {/* Product Name */}
            <h3 className="text-xl font-semibold text-secondary-900">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-2">
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
              <span className="text-sm text-secondary-500">
                ({product.ratings.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-secondary-900">
                {formatPrice(currentPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-secondary-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {discountPercentage > 0 && (
                <Badge variant="error" size="sm">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${stockStatus.color}`}>
                {stockStatus.message}
              </span>
              {product.sku && (
                <span className="text-sm text-secondary-500">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-secondary-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h4 className="font-medium text-secondary-900 mb-2">Specifications</h4>
                <div className="space-y-1">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-secondary-600">{key}:</span>
                      <span className="text-secondary-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={isInCartItem ? handleRemoveFromCart : handleAddToCart}
                disabled={product.stock === 0 && !isInCartItem}
                className={`flex-1 ${isInCartItem ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCartItem ? (
                  'Remove from Cart'
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </Button>
              
              <Button
                onClick={handleFavoriteToggle}
                variant="outline"
                className={`${
                  isFavorite(product._id) 
                    ? 'text-red-600 border-red-300 hover:bg-red-50' 
                    : ''
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorite(product._id) ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
