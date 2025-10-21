# Frontend Architecture Documentation

This document provides a comprehensive overview of the frontend architecture, design patterns, and technical decisions made in the e-commerce application.

## 🏗️ Overall Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                    │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (React Components)                     │
│  ├── Customer Interface                                     │
│  ├── Admin Interface                                        │
│  └── Shared Components                                      │
├─────────────────────────────────────────────────────────────┤
│  State Management Layer                                     │
│  ├── Server State (React Query)                             │
│  ├── Client State (Context API)                            │
│  └── Local Storage                                          │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                       │
│  ├── Custom Hooks                                           │
│  ├── Utility Functions                                      │
│  └── Validation Logic                                       │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer                                          │
│  ├── API Client                                             │
│  ├── HTTP Requests                                          │
│  └── Error Handling                                         │
├─────────────────────────────────────────────────────────────┤
│  External Services                                          │
│  ├── Backend API                                            │
│  ├── Cloudinary (Images)                                    │
│  └── WhatsApp Integration                                   │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── NotificationProvider
├── CartProvider
├── FavoriteProvider
└── AuthProvider
    ├── CustomerLayout
    │   ├── Header
    │   ├── Routes
    │   │   ├── Home
    │   │   ├── Products
    │   │   ├── ProductDetail
    │   │   ├── Cart
    │   │   ├── Checkout
    │   │   └── Favorites
    │   └── Footer
    └── AdminRoutes
        ├── AdminLayout
        ├── Dashboard
        ├── ProductsManagement
        ├── OrdersManagement
        └── Analytics
```

### Component Categories

#### 1. Layout Components
- **CustomerLayout**: Main layout for customer-facing pages
- **AdminLayout**: Layout for admin panel
- **Header**: Navigation and user controls
- **Footer**: Site footer with links and information

#### 2. Page Components
- **Home**: Landing page with featured products
- **Products**: Product listing with filters
- **ProductDetail**: Individual product view
- **Cart**: Shopping cart management
- **Checkout**: Order placement process
- **Favorites**: Saved products list

#### 3. Feature Components
- **ProductCard**: Individual product display
- **ProductGrid**: Grid layout for products
- **QuickViewModal**: Quick product preview
- **FilterSidebar**: Product filtering options
- **CategoryCard**: Category display

#### 4. UI Components
- **Button**: Reusable button component
- **Input**: Form input component
- **Card**: Container component
- **Modal**: Modal dialog component
- **Badge**: Status indicator component
- **Image**: Optimized image component
- **Loader**: Loading state components

## 🔄 State Management Architecture

### Server State Management (React Query)

React Query handles all server-side data with intelligent caching and synchronization:

```typescript
// Query Keys Structure
const queryKeys = {
  products: ['products', filters],
  product: (id: string) => ['product', id],
  categories: ['categories'],
  orders: ['orders', filters],
  order: (id: string) => ['order', id],
  analytics: ['analytics', dateRange],
};
```

#### Benefits:
- **Automatic Caching**: Reduces API calls
- **Background Updates**: Keeps data fresh
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Built-in retry logic
- **Loading States**: Automatic loading management

### Client State Management (Context API)

#### Cart Context
```typescript
interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}
```

#### Favorites Context
```typescript
interface FavoriteContextType {
  state: FavoriteState;
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  getFavoriteCount: () => number;
}
```

#### Notification Context
```typescript
interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}
```

### Local Storage Strategy

Persistent data storage for offline functionality:

```typescript
// Storage Keys
const STORAGE_KEYS = {
  CART: 'ecommerce_cart',
  FAVORITES: 'ecommerce_favorites',
  USER_PREFERENCES: 'ecommerce_preferences',
  THEME: 'ecommerce_theme',
};
```

## 🛣️ Routing Architecture

### Route Structure

#### Customer Routes
```typescript
const customerRoutes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/product/:id', component: ProductDetail },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout },
  { path: '/favorites', component: Favorites },
  { path: '/orders', component: OrderHistory },
  { path: '/order/:orderId', component: OrderConfirmation },
];
```

#### Admin Routes
```typescript
const adminRoutes = [
  { path: '/admin', component: Dashboard },
  { path: '/admin/products', component: ProductsManagement },
  { path: '/admin/products/add', component: AddProduct },
  { path: '/admin/products/edit/:id', component: EditProduct },
  { path: '/admin/orders', component: OrdersManagement },
  { path: '/admin/categories', component: CategoriesManagement },
  { path: '/admin/analytics', component: Analytics },
];
```

### Route Protection

```typescript
// Protected Route Component
const ProtectedRoute = ({ children, requireAuth, requireAdmin }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};
```

## 🔌 API Integration Architecture

### API Client Structure

```typescript
// API Client Configuration
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Service Organization

```typescript
// API Services Structure
export const api = {
  products: {
    getAll: (filters?: ProductFilters) => apiClient.get('/products', { params: filters }),
    getById: (id: string) => apiClient.get(`/products/${id}`),
    create: (data: FormData) => apiClient.post('/admin/products', data),
    update: (id: string, data: FormData) => apiClient.put(`/admin/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/admin/products/${id}`),
    incrementFavorite: (id: string) => apiClient.post(`/products/${id}/favorite`),
    decrementFavorite: (id: string) => apiClient.delete(`/products/${id}/favorite`),
  },
  orders: {
    getAll: (filters?: OrderFilters) => apiClient.get('/orders', { params: filters }),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    create: (data: OrderData) => apiClient.post('/orders', data),
    updateStatus: (id: string, status: string) => apiClient.patch(`/orders/${id}/status`, { status }),
    cancel: (id: string, reason: string) => apiClient.patch(`/orders/${id}/cancel`, { reason }),
  },
  // ... other services
};
```

## 🎨 Styling Architecture

### Tailwind CSS Configuration

```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          // ... full color palette
          900: '#9a3412',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          // ... full color palette
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### CSS Architecture

#### Global Styles (index.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  body {
    @apply bg-white text-secondary-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm border border-secondary-200 p-6;
  }
}
```

#### Component-Specific Styles
- Utility-first approach with Tailwind
- Custom CSS classes for complex animations
- Responsive design with mobile-first approach

## 🔧 Custom Hooks Architecture

### Data Fetching Hooks

```typescript
// useProducts Hook
export function useProducts(filters?: ProductFilters) {
  return useQuery<ProductPaginatedResponse<Product>>(
    ['products', filters],
    async () => {
      try {
        return await api.products.getAll(filters);
      } catch (error) {
        // Fallback to mock data
        return getMockProducts(filters);
      }
    },
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}
```

### State Management Hooks

```typescript
// useLocalStorage Hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Utility Hooks

```typescript
// useDebounce Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## 🚀 Performance Architecture

### Code Splitting Strategy

```typescript
// Lazy Loading Components
const Home = React.lazy(() => import('../pages/customer/Home'));
const Products = React.lazy(() => import('../pages/customer/Products'));
const ProductDetail = React.lazy(() => import('../pages/customer/ProductDetail'));

// Route-based Code Splitting
const CustomerLayout: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Suspense>
  );
};
```

### Image Optimization

```typescript
// Image Component with Lazy Loading
const Image: React.FC<ImageProps> = ({ src, alt, className, lazy = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
```

### Memoization Strategy

```typescript
// Memoized Product Card
const ProductCard = React.memo<ProductCardProps>(({ product, onAddToCart, onQuickView }) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);

  const handleQuickView = useCallback(() => {
    onQuickView(product);
  }, [product, onQuickView]);

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Component content */}
    </Card>
  );
});
```

## 🔒 Security Architecture

### Authentication Flow

```typescript
// Authentication Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.auth.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Token validation on app start
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      validateToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Input Validation

```typescript
// Form Validation Schema
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

// Validation Hook
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const validate = useCallback((data: unknown): ValidationResult<T> => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error.errors };
      }
      return { success: false, errors: [{ message: 'Validation failed' }] };
    }
  }, [schema]);

  return { validate };
}
```

## 🧪 Testing Architecture

### Testing Strategy

```typescript
// Component Testing
describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const mockProduct = {
      _id: '1',
      name: 'Test Product',
      price: 100,
      images: ['test-image.jpg'],
    };

    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart button is clicked', () => {
    const mockOnAddToCart = jest.fn();
    const mockProduct = { _id: '1', name: 'Test Product', price: 100 };

    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

### API Testing

```typescript
// API Mocking
const mockApi = {
  products: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  },
};

// Test API Integration
describe('useProducts Hook', () => {
  it('fetches products successfully', async () => {
    const mockProducts = [{ _id: '1', name: 'Product 1' }];
    mockApi.products.getAll.mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockProducts);
    });
  });
});
```

## 📊 Error Handling Architecture

### Error Boundary

```typescript
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### API Error Handling

```typescript
// Centralized Error Handling
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Error Handling Hook
export function useErrorHandler() {
  const { showError } = useNotification();

  const handleError = useCallback((error: any, fallbackMessage?: string) => {
    const message = handleApiError(error) || fallbackMessage || 'Something went wrong';
    showError(message);
  }, [showError]);

  return { handleError };
}
```

## 🔄 Data Flow Architecture

### Unidirectional Data Flow

```
User Action → Component → Hook → Context/API → State Update → UI Update
```

### Example: Adding Product to Cart

1. **User clicks "Add to Cart"** → ProductCard component
2. **Component calls handler** → handleAddToCart function
3. **Handler calls context** → CartContext.addToCart
4. **Context updates state** → Cart state updated
5. **Local storage updated** → Persistence layer
6. **UI re-renders** → Cart count updated

### State Synchronization

```typescript
// Optimistic Updates Pattern
const addToCart = async (product: Product, quantity: number) => {
  // Optimistic update
  const tempId = `temp-${Date.now()}`;
  const tempItem = { ...product, _id: tempId, quantity };
  
  dispatch({ type: 'ADD_TO_CART', payload: tempItem });
  
  try {
    // API call
    const response = await api.cart.addItem(product._id, quantity);
    
    // Replace temp item with real item
    dispatch({ type: 'REPLACE_CART_ITEM', payload: { tempId, realItem: response.data } });
  } catch (error) {
    // Rollback on error
    dispatch({ type: 'REMOVE_FROM_CART', payload: tempId });
    showError('Failed to add item to cart');
  }
};
```

## 🚀 Build & Deployment Architecture

### Build Process

```typescript
// Vite Configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
```

### Environment Configuration

```typescript
// Environment-specific configurations
const config = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    enableDevTools: true,
    logLevel: 'debug',
  },
  production: {
    apiUrl: 'https://api.yourapp.com/api',
    enableDevTools: false,
    logLevel: 'error',
  },
  staging: {
    apiUrl: 'https://staging-api.yourapp.com/api',
    enableDevTools: true,
    logLevel: 'info',
  },
};
```

This architecture documentation provides a comprehensive understanding of how the frontend application is structured, organized, and operates. It serves as a guide for developers working on the project and helps maintain consistency across the codebase.
