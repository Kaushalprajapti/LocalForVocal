import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { Image } from '../common/Image';
import { cn } from '../../utils/helpers';

interface CategoryCardProps {
  category: Category;
  productCount?: number;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productCount,
  className,
}) => {
  return (
    <Link
      to={`/products?category=${category._id}`}
      className={cn(
        'group relative bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden hover:shadow-md transition-all duration-300',
        className
      )}
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={category.image || '/placeholder-category.svg'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          lazy
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h3 className="text-lg font-semibold text-center mb-1">
            {category.name}
          </h3>
          {productCount !== undefined && (
            <p className="text-sm opacity-90">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
