import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';
import { getImageUrl } from '../../utils/helpers';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  fallback = '/placeholder-image.svg',
  lazy = true,
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallback);
      setIsLoading(false);
      return;
    }

    const fullSrc = getImageUrl(src);
    setImageSrc(fullSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src, fallback]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
    onError?.();
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-secondary-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-secondary-300 border-t-primary-600 rounded-full animate-spin" />
        </div>
      )}
      
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading && 'opacity-0',
          hasError && 'opacity-50'
        )}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-secondary-100 flex items-center justify-center text-secondary-500">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-secondary-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};
