import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Category } from '../../types';
import { Button } from '../common/Button';
import { cn } from '../../utils/helpers';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  categories,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId,
    });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? Number(value) : undefined;
    onFilterChange({
      ...filters,
      [field]: numValue,
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFilterChange({
      ...filters,
      sortBy,
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      inStock: checked ? true : undefined,
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:shadow-none lg:border-r lg:border-secondary-200',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 lg:hidden">
          <h2 className="text-lg font-semibold flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          {/* Clear Filters */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-secondary-900">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-primary-600 hover:text-primary-700"
            >
              Clear All
            </Button>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.category === category._id}
                    onChange={() => handleCategoryChange(category._id)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-700">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-secondary-600 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-secondary-600 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  placeholder="10000"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Stock Availability */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 mb-3">Availability</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock || false}
                onChange={(e) => handleInStockChange(e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-secondary-700">In Stock Only</span>
            </label>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 mb-3">Sort By</h3>
            <div className="space-y-2">
              {[
                { value: 'createdAt', label: 'Newest First' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'name', label: 'Name: A to Z' },
                { value: 'rating', label: 'Highest Rated' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={() => handleSortChange(option.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
