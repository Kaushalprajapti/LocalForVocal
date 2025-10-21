import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  Headphones,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { ProductGrid } from '../../components/customer/ProductGrid';
import { CategoryCard } from '../../components/customer/CategoryCard';
import { QuickViewModal } from '../../components/customer/QuickViewModal';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Skeleton } from '../../components/common/Loader';
import { Product } from '../../types';

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  // Fetch featured products
  const { data: featuredProducts, isLoading: featuredLoading } = useProducts({
    limit: 8,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // Fetch new arrivals
  const { data: newArrivals, isLoading: newArrivalsLoading } = useProducts({
    limit: 8,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // Fetch top-rated products
  const { data: topRated, isLoading: topRatedLoading } = useProducts({
    limit: 8,
    sortBy: 'rating',
    sortOrder: 'desc',
  });
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over ₹500',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing:', email);
    setEmail('');
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-white">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">New Collection 2024</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-primary-100 max-w-xl">
                Explore our curated collection of premium products. Quality craftsmanship, 
                unbeatable prices, and lightning-fast delivery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-600 hover:bg-primary-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300 w-full sm:w-auto"
                >
                  View Categories
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-primary-200 text-sm">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5K+</div>
                  <div className="text-primary-200 text-sm">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9★</div>
                  <div className="text-primary-200 text-sm">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative w-full aspect-square lg:aspect-auto lg:h-[500px]">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🛍️</div>
                    <p className="text-white/80 text-lg">Your Shopping Experience</p>
                  </div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute top-8 right-8 bg-white rounded-2xl p-4 shadow-xl animate-bounce">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <div>
                      <div className="text-sm font-bold text-secondary-900">Best Seller</div>
                      <div className="text-xs text-secondary-600">This Month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-none"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Modern Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-600">EXPLORE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Browse through our diverse range of carefully curated categories
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {categories?.slice(0, 10).map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                />
              ))}
            </div>
          )}

          {categories && categories.length > 10 && (
            <div className="text-center mt-12">
              <Link to="/categories">
                <Button size="lg" variant="outline" className="group">
                  View All Categories
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-secondary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full mb-4">
                <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                <span className="text-sm font-semibold text-yellow-600">FEATURED</span>
              </div>
              <h2 className="text-4xl font-bold text-secondary-900 mb-2">
                Featured Products
              </h2>
              <p className="text-lg text-secondary-600">
                Handpicked favorites just for you
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" size="lg" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <ProductGrid
            products={featuredProducts?.data || []}
            loading={featuredLoading}
            onQuickView={handleQuickView}
          />
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">NEW</span>
              </div>
              <h2 className="text-4xl font-bold text-secondary-900 mb-2">
                New Arrivals
              </h2>
              <p className="text-lg text-secondary-600">
                Latest additions to our collection
              </p>
            </div>
            <Link to="/products?sort=newest">
              <Button variant="outline" size="lg" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <ProductGrid
            products={newArrivals?.data || []}
            loading={newArrivalsLoading}
            onQuickView={handleQuickView}
          />
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">TOP RATED</span>
              </div>
              <h2 className="text-4xl font-bold text-secondary-900 mb-2">
                Customer Favorites
              </h2>
              <p className="text-lg text-secondary-600">
                Highly rated products loved by our customers
              </p>
            </div>
            <Link to="/products?sort=rating">
              <Button variant="outline" size="lg" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <ProductGrid
            products={topRated?.data || []}
            loading={topRatedLoading}
            onQuickView={handleQuickView}
          />
        </div>
      </section>

      {/* Newsletter Section - Modern Design */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">EXCLUSIVE OFFERS</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stay in the Loop
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals
          </p>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-lg"
                required
              />
              <Button 
                type="submit"
                size="lg" 
                className="bg-white text-primary-600 hover:bg-primary-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Subscribe
              </Button>
            </div>
          </form>

          <p className="text-primary-200 text-sm mt-6">
            Join 10,000+ subscribers. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        product={quickViewProduct}
      />
    </div>
  );
};

export default Home;