import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoriteContext';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/helpers';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state: cartState } = useCart();
  const { getFavoriteCount } = useFavorites();
  const navigate = useNavigate();
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(debouncedSearch)}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">
              E-Commerce
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:placeholder-secondary-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/orders"
              className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              My Orders
            </Link>
            {/* <Link
              to="/favorites"
              className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Favorites
            </Link> */}
            <Link
              to="/about"
              className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Cart & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              <Heart className="h-6 w-6" />
              {getFavoriteCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getFavoriteCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartState.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartState.totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <Link 
                to="/admin/login"
                className="p-2 text-secondary-700 hover:text-primary-600 transition-colors"
                title="Admin Panel"
              >
                <User className="h-6 w-6" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:placeholder-secondary-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            'md:hidden transition-all duration-300 ease-in-out',
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-secondary-200">
            <Link
              to="/products"
              className="block px-3 py-2 text-secondary-700 hover:text-primary-600 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="block px-3 py-2 text-secondary-700 hover:text-primary-600 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/orders"
              className="block px-3 py-2 text-secondary-700 hover:text-primary-600 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              My Orders
            </Link>
            <Link
              to="/favorites"
              className="block px-3 py-2 text-secondary-700 hover:text-primary-600 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-secondary-700 hover:text-primary-600 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
