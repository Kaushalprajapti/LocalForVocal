import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '../components/customer/Header';
import { Footer } from '../components/customer/Footer';
import { PageLoader } from '../components/common/Loader';

// Lazy load pages for better performance
const Home = React.lazy(() => import('../pages/customer/Home'));
const Products = React.lazy(() => import('../pages/customer/Products'));
const Categories = React.lazy(() => import('../pages/customer/Categories'));
const Favorites = React.lazy(() => import('../pages/customer/Favorites'));
const ProductDetail = React.lazy(() => import('../pages/customer/ProductDetail'));
const Cart = React.lazy(() => import('../pages/customer/Cart'));
const Checkout = React.lazy(() => import('../pages/customer/Checkout'));
const OrderConfirmation = React.lazy(() => import('../pages/customer/OrderConfirmation'));
const OrderHistory = React.lazy(() => import('../pages/customer/OrderHistory'));
const NotFound = React.lazy(() => import('../pages/customer/NotFound'));

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header - sticky for better UX */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Header />
      </header>

      {/* Main content area */}
      <main className="flex-1 w-full">
        <Suspense 
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <PageLoader />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:orderId" element={<OrderConfirmation />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white mt-auto">
        <Footer />
      </footer>

      {/* Scroll to top button - optional enhancement */}
      <ScrollToTopButton />
    </div>
  );
};

// Optional: Scroll to top button component
const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
};