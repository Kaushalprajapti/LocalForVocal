# API Integration Documentation

This document provides comprehensive information about how the frontend integrates with the backend API, including endpoints, data flow, error handling, and best practices.

## 🔌 API Client Configuration

### Base Configuration

```typescript
// utils/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Client Instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add authentication token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const duration = new Date().getTime() - response.config.metadata?.startTime;
    console.log(`API Request to ${response.config.url} took ${duration}ms`);
    
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - show access denied message
      console.error('Access denied');
    } else if (error.response?.status === 429) {
      // Rate limited - show rate limit message
      console.error('Rate limit exceeded');
    }
    
    return Promise.reject(error);
  }
);
```

## 📊 API Services Structure

### Products API

```typescript
// Products API Service
export const productsApi = {
  // Get all products with filters
  getAll: async (filters?: ProductFilters): Promise<ProductPaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create new product (Admin only)
  create: async (data: FormData): Promise<Product> => {
    const response = await apiClient.post('/admin/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product (Admin only)
  update: async (id: string, data: FormData): Promise<Product> => {
    const response = await apiClient.put(`/admin/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product (Admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/products/${id}`);
  },

  // Increment favorite count
  incrementFavorite: async (id: string): Promise<void> => {
    await apiClient.post(`/products/${id}/favorite`);
  },

  // Decrement favorite count
  decrementFavorite: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}/favorite`);
  },

  // Get low stock products (Admin only)
  getLowStock: async (): Promise<Product[]> => {
    const response = await apiClient.get('/admin/products/low-stock');
    return response.data;
  },
};
```

### Orders API

```typescript
// Orders API Service
export const ordersApi = {
  // Get all orders with filters
  getAll: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await apiClient.get(`/orders?${params.toString()}`);
    return response.data;
  },

  // Get single order by ID
  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  // Update order status (Admin only)
  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancel: async (id: string, reason: string): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Get order status
  getStatus: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}/status`);
    return response.data;
  },
};
```

### Categories API

```typescript
// Categories API Service
export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Get single category by ID
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  // Create new category (Admin only)
  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await apiClient.post('/admin/categories', data);
    return response.data;
  },

  // Update category (Admin only)
  update: async (id: string, data: UpdateCategoryData): Promise<Category> => {
    const response = await apiClient.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  // Delete category (Admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/categories/${id}`);
  },
};
```

### Analytics API

```typescript
// Analytics API Service
export const analyticsApi = {
  // Get dashboard analytics
  getDashboard: async (dateRange?: DateRange): Promise<DashboardAnalytics> => {
    const params = new URLSearchParams();
    if (dateRange?.start) params.append('startDate', dateRange.start);
    if (dateRange?.end) params.append('endDate', dateRange.end);
    
    const response = await apiClient.get(`/admin/analytics/dashboard?${params.toString()}`);
    return response.data;
  },

  // Get sales analytics
  getSales: async (dateRange?: DateRange): Promise<SalesAnalytics> => {
    const params = new URLSearchParams();
    if (dateRange?.start) params.append('startDate', dateRange.start);
    if (dateRange?.end) params.append('endDate', dateRange.end);
    
    const response = await apiClient.get(`/admin/analytics/sales?${params.toString()}`);
    return response.data;
  },

  // Get product analytics
  getProducts: async (dateRange?: DateRange): Promise<ProductAnalytics> => {
    const params = new URLSearchParams();
    if (dateRange?.start) params.append('startDate', dateRange.start);
    if (dateRange?.end) params.append('endDate', dateRange.end);
    
    const response = await apiClient.get(`/admin/analytics/products?${params.toString()}`);
    return response.data;
  },
};
```

## 🔄 React Query Integration

### Query Configuration

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../utils/api';

// Query Keys
export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productQueryKeys.lists(), filters] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
  lowStock: () => [...productQueryKeys.all, 'low-stock'] as const,
};

// Get Products Hook
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productQueryKeys.list(filters || {}),
    queryFn: () => productsApi.getAll(filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Get Single Product Hook
export function useProduct(id: string) {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Create Product Mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      
      // Add the new product to the cache
      queryClient.setQueryData(productQueryKeys.detail(newProduct._id), newProduct);
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });
}

// Update Product Mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      productsApi.update(id, data),
    onSuccess: (updatedProduct, { id }) => {
      // Update the product in cache
      queryClient.setQueryData(productQueryKeys.detail(id), updatedProduct);
      
      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
    },
  });
}

// Delete Product Mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: (_, productId) => {
      // Remove product from cache
      queryClient.removeQueries({ queryKey: productQueryKeys.detail(productId) });
      
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
    },
  });
}
```

### Optimistic Updates

```typescript
// Optimistic Update Example
export function useAddToFavorites() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsApi.incrementFavorite,
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: productQueryKeys.detail(productId) });
      
      // Snapshot the previous value
      const previousProduct = queryClient.getQueryData(productQueryKeys.detail(productId));
      
      // Optimistically update
      queryClient.setQueryData(productQueryKeys.detail(productId), (old: any) => ({
        ...old,
        favoriteCount: (old.favoriteCount || 0) + 1,
      }));
      
      // Return context with snapshot
      return { previousProduct };
    },
    onError: (err, productId, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(productQueryKeys.detail(productId), context.previousProduct);
      }
    },
    onSettled: (data, error, productId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(productId) });
    },
  });
}
```

## 🚨 Error Handling

### API Error Types

```typescript
// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface ValidationError extends ApiError {
  field: string;
  value: any;
}

// Error Handler Utility
export const handleApiError = (error: any): string => {
  // Network error
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }
  
  // Server error with message
  if (error.response.data?.message) {
    return error.response.data.message;
  }
  
  // Validation errors
  if (error.response.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.map((err: any) => err.message).join(', ');
    }
  }
  
  // HTTP status errors
  switch (error.response.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'Access denied. You do not have permission.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. The resource already exists.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
};
```

### Error Boundary Integration

```typescript
// API Error Boundary
export class ApiErrorBoundary extends React.Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log API errors to monitoring service
    if (error.message.includes('API')) {
      console.error('API Error:', error, errorInfo);
      // Send to error tracking service
    }
  }

  render() {
    if (this.state.hasError) {
      return <ApiErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

## 📊 Data Transformation

### Request/Response Transformers

```typescript
// Request Transformers
export const transformProductForCreate = (product: ProductFormData): FormData => {
  const formData = new FormData();
  
  // Basic fields
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('stock', product.stock.toString());
  formData.append('category', product.category);
  
  // Optional fields
  if (product.discountPrice) {
    formData.append('discountPrice', product.discountPrice.toString());
  }
  
  // Images
  product.images.forEach((image, index) => {
    formData.append('images', image);
  });
  
  // Specifications
  if (product.specifications) {
    formData.append('specifications', JSON.stringify(product.specifications));
  }
  
  return formData;
};

// Response Transformers
export const transformProductFromApi = (apiProduct: any): Product => {
  return {
    _id: apiProduct._id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    discountPrice: apiProduct.discountPrice,
    stock: apiProduct.stock,
    maxOrderQuantity: apiProduct.maxOrderQuantity,
    images: apiProduct.images || [],
    category: transformCategoryFromApi(apiProduct.category),
    specifications: apiProduct.specifications || {},
    tags: apiProduct.tags || [],
    ratings: {
      average: apiProduct.ratings?.average || 0,
      count: apiProduct.ratings?.count || 0,
    },
    isActive: apiProduct.isActive,
    createdAt: new Date(apiProduct.createdAt),
    updatedAt: new Date(apiProduct.updatedAt),
  };
};
```

## 🔄 Caching Strategy

### Cache Configuration

```typescript
// Query Client Configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});

// Cache Invalidation Strategy
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();
  
  const invalidateProducts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
  }, [queryClient]);
  
  const invalidateOrders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  }, [queryClient]);
  
  const invalidateAnalytics = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
  }, [queryClient]);
  
  return {
    invalidateProducts,
    invalidateOrders,
    invalidateAnalytics,
  };
};
```

## 🚀 Performance Optimizations

### Request Deduplication

```typescript
// Deduplication Configuration
export const useProductsWithDeduplication = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productQueryKeys.list(filters || {}),
    queryFn: () => productsApi.getAll(filters),
    // Enable request deduplication
    enabled: true,
    // Prevent duplicate requests
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
```

### Background Refetching

```typescript
// Background Updates
export const useProductsWithBackgroundUpdates = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productQueryKeys.list(filters || {}),
    queryFn: () => productsApi.getAll(filters),
    // Refetch in background
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: true,
    // Only refetch if data is stale
    refetchOnWindowFocus: true,
  });
};
```

## 📱 Offline Support

### Offline Detection

```typescript
// Offline Detection Hook
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOffline;
}

// Offline Query Configuration
export const useProductsWithOfflineSupport = (filters?: ProductFilters) => {
  const isOffline = useOfflineStatus();
  
  return useQuery({
    queryKey: productQueryKeys.list(filters || {}),
    queryFn: () => productsApi.getAll(filters),
    // Disable queries when offline
    enabled: !isOffline,
    // Use cached data when offline
    staleTime: isOffline ? Infinity : 5 * 60 * 1000,
  });
};
```

## 🔐 Authentication Integration

### Token Management

```typescript
// Token Management
export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  
  static setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }
  
  static getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  
  static clearTokens() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
  
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
```

### Automatic Token Refresh

```typescript
// Token Refresh Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          TokenManager.setTokens(accessToken, refreshToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        TokenManager.clearTokens();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

## 📊 Monitoring & Analytics

### API Monitoring

```typescript
// API Monitoring Hook
export function useApiMonitoring() {
  const [metrics, setMetrics] = useState<ApiMetrics>({
    requestCount: 0,
    errorCount: 0,
    averageResponseTime: 0,
  });
  
  useEffect(() => {
    const updateMetrics = (event: CustomEvent) => {
      const { type, duration, status } = event.detail;
      
      setMetrics(prev => ({
        requestCount: prev.requestCount + 1,
        errorCount: prev.errorCount + (status >= 400 ? 1 : 0),
        averageResponseTime: (prev.averageResponseTime + duration) / 2,
      }));
    };
    
    window.addEventListener('api-request', updateMetrics as EventListener);
    window.addEventListener('api-response', updateMetrics as EventListener);
    
    return () => {
      window.removeEventListener('api-request', updateMetrics as EventListener);
      window.removeEventListener('api-response', updateMetrics as EventListener);
    };
  }, []);
  
  return metrics;
}
```

This comprehensive API integration documentation covers all aspects of how the frontend communicates with the backend, including configuration, error handling, caching, and performance optimizations.
