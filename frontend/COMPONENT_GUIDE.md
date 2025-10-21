# Component Guide Documentation

This document provides detailed information about all components in the frontend application, their usage, props, and implementation details.

## 🧩 Component Architecture Overview

### Component Categories

```
Components/
├── common/           # Shared UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── Image.tsx
│   └── Loader.tsx
├── customer/         # Customer-facing components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CategoryCard.tsx
│   ├── FilterSidebar.tsx
│   └── QuickViewModal.tsx
└── admin/           # Admin-specific components
    ├── AdminLayout.tsx
    ├── Dashboard.tsx
    └── DataTable.tsx
```

## 🎨 Common Components

### Button Component

```typescript
// components/common/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
    outline: 'border border-secondary-300 bg-white hover:bg-secondary-50 text-secondary-700 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-700 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className
      )}
    >
      {loading && (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      )}
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};
```

**Usage Examples:**
```typescript
// Basic button
<Button onClick={handleClick}>Click me</Button>

// Button with icon
<Button icon={<Plus className="h-4 w-4" />} iconPosition="left">
  Add Product
</Button>

// Loading button
<Button loading={isLoading} disabled={isLoading}>
  Saving...
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
```

### Input Component

```typescript
// components/common/Input.tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  className?: string;
  name?: string;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  label,
  helperText,
  icon,
  className = '',
  name,
  id,
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-secondary-400">{icon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={cn(
            'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            icon ? 'pl-10' : '',
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-secondary-300',
            disabled ? 'bg-secondary-50 cursor-not-allowed' : 'bg-white',
            className
          )}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
};
```

**Usage Examples:**
```typescript
// Basic input
<Input
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Input with label and validation
<Input
  label="Email Address"
  type="email"
  required
  error={emailError}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input with icon
<Input
  placeholder="Search products..."
  icon={<Search className="h-4 w-4" />}
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

### Card Component

```typescript
// components/common/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  return (
    <div
      className={cn(
        'bg-white rounded-lg',
        paddingClasses[padding],
        shadowClasses[shadow],
        border ? 'border border-secondary-200' : '',
        hover ? 'hover:shadow-md transition-shadow duration-200' : '',
        className
      )}
    >
      {children}
    </div>
  );
};
```

**Usage Examples:**
```typescript
// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Card with custom styling
<Card padding="lg" shadow="md" hover>
  <div>Enhanced card content</div>
</Card>

// Card without border
<Card border={false} padding="none">
  <img src="image.jpg" alt="Card image" />
</Card>
```

### Modal Component

```typescript
// components/common/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        
        {/* Modal */}
        <div
          className={cn(
            'relative bg-white rounded-lg shadow-xl w-full',
            sizeClasses[size]
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              {title && (
                <h3 className="text-lg font-semibold text-secondary-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Usage Examples:**
```typescript
// Basic modal
<Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
  <p>Are you sure you want to proceed?</p>
  <div className="flex justify-end space-x-3 mt-4">
    <Button variant="outline" onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </div>
</Modal>

// Large modal
<Modal isOpen={isOpen} onClose={handleClose} size="xl" title="Product Details">
  <div>Large content here</div>
</Modal>
```

### Badge Component

```typescript
// components/common/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};
```

**Usage Examples:**
```typescript
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Inactive</Badge>

// Size variations
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

## 🛍️ Customer Components

### ProductCard Component

```typescript
// components/customer/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  onRemoveFromFavorites: (productId: string) => void;
  isInCart: boolean;
  cartQuantity?: number;
  isFavorite: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  onQuickView,
  onAddToFavorites,
  onRemoveFromFavorites,
  isInCart,
  cartQuantity = 0,
  isFavorite,
}) => {
  const { addToCart, removeFromCart, isInCart: checkInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite: checkFavorite } = useFavorites();
  
  const handleAddToCart = () => {
    if (isInCart) {
      removeFromCart(product._id);
    } else {
      addToCart(product, 1);
    }
  };
  
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <Image
            src={product.images[0] || '/placeholder-image.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            lazy
          />
        </Link>
        
        {/* Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-2 left-2 p-2 bg-white/90 hover:bg-white text-secondary-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          title="Quick view"
        >
          <Eye className="h-4 w-4" />
        </button>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/90 hover:bg-white text-secondary-600'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        
        {/* Discount Badge */}
        {product.discountPrice && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            {calculateDiscountPercentage(product.price, product.discountPrice)}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-secondary-500 mb-1">
          {product.category?.name || 'Uncategorized'}
        </p>
        
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-medium text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-semibold text-secondary-900">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-secondary-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="mb-3">
          <Badge variant={getStockStatus(product.stock).variant}>
            {getStockStatus(product.stock).text}
          </Badge>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 && !isInCart}
            className={`flex-1 ${isInCart ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart ? (
              `Remove from Cart (${cartQuantity})`
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
```

### ProductGrid Component

```typescript
// components/customer/ProductGrid.tsx
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onQuickView?: (product: Product) => void;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  showFilters?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  onQuickView,
  columns = 4,
  showFilters = false,
}) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };
  
  if (loading) {
    return (
      <div className={`grid ${gridClasses[columns]} gap-6`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          No products found
        </h3>
        <p className="text-secondary-600">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }
  
  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onQuickView={onQuickView}
          onAddToFavorites={addToFavorites}
          onRemoveFromFavorites={removeFromFavorites}
          isInCart={isInCart(product._id)}
          isFavorite={isFavorite(product._id)}
        />
      ))}
    </div>
  );
};
```

### QuickViewModal Component

```typescript
// components/customer/QuickViewModal.tsx
interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  if (!product) return null;
  
  const isInCartItem = isInCart(product._id);
  const isFavoriteItem = isFavorite(product._id);
  
  const handleAddToCart = () => {
    if (isInCartItem) {
      removeFromCart(product._id);
    } else {
      addToCart(product, quantity);
    }
  };
  
  const handleFavoriteToggle = () => {
    if (isFavoriteItem) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[selectedImage] || '/placeholder-image.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary-500'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              {product.name}
            </h2>
            <p className="text-secondary-600 mb-4">
              {product.description}
            </p>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-secondary-900">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <>
                <span className="text-xl text-secondary-500 line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="error">
                  {calculateDiscountPercentage(product.price, product.discountPrice)}% OFF
                </Badge>
              </>
            )}
          </div>
          
          {/* Stock Status */}
          <div>
            <Badge variant={getStockStatus(product.stock).variant}>
              {getStockStatus(product.stock).text}
            </Badge>
          </div>
          
          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-secondary-700">
                Quantity:
              </label>
              <div className="flex items-center border border-secondary-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-secondary-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-3 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.maxOrderQuantity, quantity + 1))}
                  className="p-2 hover:bg-secondary-50"
                  disabled={quantity >= product.maxOrderQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 && !isInCartItem}
              className={`flex-1 ${isInCartItem ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isInCartItem ? (
                'Remove from Cart'
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleFavoriteToggle}
              className={`px-6 ${isFavoriteItem ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}`}
            >
              <Heart className={`h-5 w-5 mr-2 ${isFavoriteItem ? 'fill-current' : ''}`} />
              {isFavoriteItem ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>
          
          {/* Specifications */}
          {Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                Specifications
              </h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-secondary-600">{key}:</span>
                    <span className="text-secondary-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
```

## 🏢 Admin Components

### AdminLayout Component

```typescript
// components/admin/AdminLayout.tsx
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];
  
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
          <h1 className="text-xl font-bold text-secondary-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-secondary-500 hover:text-secondary-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium text-secondary-700 rounded-md hover:bg-secondary-100 hover:text-secondary-900 transition-colors"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* User Menu */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-500 truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-secondary-400 hover:text-secondary-600"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-secondary-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-secondary-500 hover:text-secondary-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-secondary-600 hover:text-secondary-900"
              >
                View Store
              </Link>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
      
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
```

## 🎯 Component Best Practices

### 1. Component Composition

```typescript
// Good: Composable components
const ProductList = () => (
  <div>
    <ProductGrid products={products} />
    <Pagination currentPage={page} totalPages={totalPages} />
  </div>
);

// Avoid: Monolithic components
const ProductList = () => (
  <div>
    {/* All product grid and pagination logic in one component */}
  </div>
);
```

### 2. Props Interface Design

```typescript
// Good: Clear, specific props
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showQuickView?: boolean;
  variant?: 'default' | 'compact';
}

// Avoid: Generic or unclear props
interface ProductCardProps {
  data: any;
  onClick: () => void;
  options?: any;
}
```

### 3. Error Boundaries

```typescript
// Component-level error boundary
const ProductCardWithErrorBoundary = (props: ProductCardProps) => (
  <ErrorBoundary fallback={<ProductCardError />}>
    <ProductCard {...props} />
  </ErrorBoundary>
);
```

### 4. Performance Optimization

```typescript
// Memoized components
const ProductCard = React.memo<ProductCardProps>(({ product, onAddToCart }) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);
  
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
});

// Conditional rendering
const ProductList = ({ products, loading }) => {
  if (loading) return <ProductGridSkeleton />;
  if (products.length === 0) return <EmptyState />;
  
  return <ProductGrid products={products} />;
};
```

### 5. Accessibility

```typescript
// Accessible components
const Button = ({ children, onClick, disabled, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    role="button"
    tabIndex={disabled ? -1 : 0}
    {...props}
  >
    {children}
  </button>
);

// Screen reader support
const ProductCard = ({ product }) => (
  <div role="article" aria-label={`Product: ${product.name}`}>
    <img src={product.image} alt={product.name} />
    <h3>{product.name}</h3>
    <p>{product.description}</p>
  </div>
);
```

This comprehensive component guide provides detailed information about all components, their usage patterns, and best practices for building maintainable and scalable React components.
