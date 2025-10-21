import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Plus, Minus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoriteContext';
import { useNotification } from '../../context/NotificationContext';
import { Image } from '../../components/common/Image';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProductGrid } from '../../components/customer/ProductGrid';
import { Skeleton } from '../../components/common/Loader';
import { formatPrice, calculateDiscountPercentage, getStockStatus } from '../../utils/helpers';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { data: product, isLoading, error } = useProduct(id!);
  const { addToCart, removeFromCart, getItemQuantity, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { showSuccess, showError } = useNotification();
  
  // Fetch related products
  const { data: relatedProducts } = useProducts({
    category: product?.category._id,
    limit: 4,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-500 text-lg mb-4">
            Product not found
          </div>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const discountPercentage = product.discountPrice 
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;
  
  const currentPrice = product.discountPrice || product.price;
  const isInCartItem = isInCart(product._id);
  const cartQuantity = getItemQuantity(product._id);

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      showError('Product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      addToCart(product, quantity);
      showSuccess(`${product.name} added to cart!`);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsAddingToCart(false);
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

  const handleQuantityChange = (newQuantity: number) => {
    const maxQuantity = Math.min(newQuantity, product.maxOrderQuantity, product.stock);
    setQuantity(Math.max(1, maxQuantity));
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `${product.name} - ${product.description.substring(0, 100)}...`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showSuccess('Product shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.log('Error sharing:', error);
          // Fallback to copy
          await copyToClipboard();
        }
      }
    } else {
      // Fallback: copy to clipboard
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess('Product link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showSuccess('Product link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category._id}`} className="hover:text-primary-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-secondary-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                lazy
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      lazy
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="info" size="sm">
                  {product.category.name}
                </Badge>
                {discountPercentage > 0 && (
                  <Badge variant="error" size="sm">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                {product.name}
              </h1>
              
              {product.sku && (
                <p className="text-sm text-secondary-500 mb-4">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.ratings.average)
                        ? 'text-yellow-400 fill-current'
                        : 'text-secondary-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-secondary-600">
                {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-secondary-900">
                {formatPrice(currentPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-xl text-secondary-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${stockStatus.color}`}>
                {stockStatus.message}
              </span>
              {product.stock > 0 && (
                <span className="text-sm text-secondary-500">
                  ({product.stock} available)
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-secondary-700">Quantity:</span>
                <div className="flex items-center border border-secondary-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= Math.min(product.maxOrderQuantity, product.stock)}
                    className="p-2 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-secondary-500">
                  Max: {Math.min(product.maxOrderQuantity, product.stock)}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={isInCartItem ? handleRemoveFromCart : handleAddToCart}
                disabled={product.stock === 0 && !isInCartItem}
                loading={isAddingToCart}
                className={`flex-1 ${isInCartItem ? 'bg-red-600 hover:bg-red-700' : ''}`}
                size="lg"
              >
                {isInCartItem ? (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Remove from Cart ({cartQuantity})
                  </>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleFavoriteToggle}
                className={`px-6 ${isFavorite(product._id) ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}`}
              >
                <Heart className={`h-5 w-5 mr-2 ${isFavorite(product._id) ? 'fill-current' : ''}`} />
                {isFavorite(product._id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="px-6"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-secondary-200">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-secondary-700">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-secondary-700">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-secondary-700">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="border-b border-secondary-200">
              <nav className="flex space-x-8 px-6">
                <button className="py-4 px-1 border-b-2 border-primary-600 text-primary-600 font-medium text-sm">
                  Description
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent text-secondary-500 hover:text-secondary-700 font-medium text-sm">
                  Specifications
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent text-secondary-500 hover:text-secondary-700 font-medium text-sm">
                  Reviews
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-secondary-700 leading-relaxed">
                  {product.description}
                </p>
                
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                      Specifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-secondary-100">
                          <span className="font-medium text-secondary-700">{key}:</span>
                          <span className="text-secondary-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.data.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8">
              Related Products
            </h2>
            <ProductGrid
              products={relatedProducts.data.filter(p => p._id !== product._id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
