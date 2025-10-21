# State Management Documentation

This document provides comprehensive information about state management in the frontend application, including React Query for server state, Context API for client state, and local storage for persistence.

## 🏗️ State Management Architecture

### State Categories

```
State Management
├── Server State (React Query)
│   ├── Products
│   ├── Orders
│   ├── Categories
│   ├── Analytics
│   └── User Authentication
├── Client State (Context API)
│   ├── Shopping Cart
│   ├── Favorites
│   ├── UI State
│   └── Notifications
└── Persistent State (Local Storage)
    ├── Cart Data
    ├── Favorites
    ├── User Preferences
    └── Theme Settings
```

## 🔄 Server State Management (React Query)

### Query Client Configuration

```typescript
// utils/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

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
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Query Keys Structure

```typescript
// hooks/queryKeys.ts
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    lowStock: () => [...queryKeys.products.all, 'low-stock'] as const,
  },
  
  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters: OrderFilters) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    status: (id: string) => [...queryKeys.orders.detail(id), 'status'] as const,
  },
  
  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },
  
  // Analytics
  analytics: {
    all: ['analytics'] as const,
    dashboard: (dateRange?: DateRange) => [...queryKeys.analytics.all, 'dashboard', dateRange] as const,
    sales: (dateRange?: DateRange) => [...queryKeys.analytics.all, 'sales', dateRange] as const,
    products: (dateRange?: DateRange) => [...queryKeys.analytics.all, 'products', dateRange] as const,
  },
  
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },
};
```

### Products State Management

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { queryKeys } from './queryKeys';

// Get Products Hook
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters || {}),
    queryFn: () => api.products.getAll(filters),
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
    queryKey: queryKeys.products.detail(id),
    queryFn: () => api.products.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Create Product Mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.products.create,
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      
      // Add the new product to the cache
      queryClient.setQueryData(queryKeys.products.detail(newProduct._id), newProduct);
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
      api.products.update(id, data),
    onSuccess: (updatedProduct, { id }) => {
      // Update the product in cache
      queryClient.setQueryData(queryKeys.products.detail(id), updatedProduct);
      
      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

// Delete Product Mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.products.delete,
    onSuccess: (_, productId) => {
      // Remove product from cache
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(productId) });
      
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

// Low Stock Products Hook
export function useLowStockProducts() {
  return useQuery({
    queryKey: queryKeys.products.lowStock(),
    queryFn: api.products.getLowStock,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
```

### Orders State Management

```typescript
// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { queryKeys } from './queryKeys';

// Get Orders Hook
export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters || {}),
    queryFn: () => api.orders.getAll(filters),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get Single Order Hook
export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => api.orders.getById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Create Order Mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.orders.create,
    onSuccess: (newOrder) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      
      // Add the new order to cache
      queryClient.setQueryData(queryKeys.orders.detail(newOrder._id), newOrder);
    },
  });
}

// Update Order Status Mutation
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string } }) =>
      api.orders.updateStatus(id, data.status),
    onSuccess: (updatedOrder, { id }) => {
      // Update order in cache
      queryClient.setQueryData(queryKeys.orders.detail(id), updatedOrder);
      
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}

// Cancel Order Mutation
export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.orders.cancel(id, reason),
    onSuccess: (updatedOrder, { id }) => {
      // Update order in cache
      queryClient.setQueryData(queryKeys.orders.detail(id), updatedOrder);
      
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}

// Order Status Hook (for real-time updates)
export function useOrderStatus(orderId: string) {
  const isValidOrderId = Boolean(orderId && 
    orderId !== '' && 
    orderId !== 'undefined' && 
    orderId !== 'null' &&
    orderId.length > 0 &&
    !orderId.includes('undefined'));

  return useQuery({
    queryKey: queryKeys.orders.status(orderId),
    queryFn: () => api.orders.getStatus(orderId),
    enabled: isValidOrderId,
    refetchInterval: isValidOrderId ? 30000 : false, // 30 seconds
    refetchOnWindowFocus: false,
  });
}
```

### Optimistic Updates

```typescript
// Optimistic Update Example for Favorites
export function useAddToFavorites() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.products.incrementFavorite,
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products.detail(productId) });
      
      // Snapshot the previous value
      const previousProduct = queryClient.getQueryData(queryKeys.products.detail(productId));
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.products.detail(productId), (old: any) => ({
        ...old,
        favoriteCount: (old.favoriteCount || 0) + 1,
      }));
      
      // Return context with snapshot
      return { previousProduct };
    },
    onError: (err, productId, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(queryKeys.products.detail(productId), context.previousProduct);
      }
    },
    onSettled: (data, error, productId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
    },
  });
}
```

## 🎯 Client State Management (Context API)

### Cart Context

```typescript
// context/CartContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  quantity: number;
  maxOrderQuantity: number;
  category: {
    _id: string;
    name: string;
  };
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_CART'; payload: { product: any; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item._id === action.payload.product._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload.product._id
              ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, item.maxOrderQuantity) }
              : item
          ),
          error: null,
        };
      } else {
        const newItem: CartItem = {
          _id: action.payload.product._id,
          name: action.payload.product.name,
          price: action.payload.product.price,
          discountPrice: action.payload.product.discountPrice,
          images: action.payload.product.images,
          quantity: action.payload.quantity,
          maxOrderQuantity: action.payload.product.maxOrderQuantity,
          category: action.payload.product.category,
        };
        return {
          ...state,
          items: [...state.items, newItem],
          error: null,
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        error: null,
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.productId
            ? { ...item, quantity: Math.max(1, Math.min(action.payload.quantity, item.maxOrderQuantity)) }
            : item
        ),
        error: null,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        error: null,
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartQuantity: (productId: string) => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedCart, setStoredCart] = useLocalStorage<CartItem[]>('cart', []);
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_CART', payload: storedCart });
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    setStoredCart(state.items);
  }, [state.items, setStoredCart]);

  const addToCart = (product: any, quantity: number) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update quantity' });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item._id === productId);
  };

  const getCartQuantity = (productId: string): number => {
    const item = state.items.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartQuantity,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```

### Favorites Context

```typescript
// context/FavoriteContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../utils/api';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  addedAt: string;
}

interface FavoriteState {
  items: FavoriteItem[];
  isLoading: boolean;
  error: string | null;
}

type FavoriteAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteItem[] }
  | { type: 'CLEAR_FAVORITES' };

const initialState: FavoriteState = {
  items: [],
  isLoading: false,
  error: null,
};

const favoriteReducer = (state: FavoriteState, action: FavoriteAction): FavoriteState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_FAVORITE':
      return {
        ...state,
        items: [...state.items, action.payload],
        error: null,
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        error: null,
      };
    case 'LOAD_FAVORITES':
      return {
        ...state,
        items: action.payload,
        error: null,
      };
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        items: [],
        error: null,
      };
    default:
      return state;
  }
};

interface FavoriteContextType {
  state: FavoriteState;
  addToFavorites: (product: any) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  getFavoriteCount: () => number;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedFavorites, setStoredFavorites] = useLocalStorage<FavoriteItem[]>('favorites', []);
  const [state, dispatch] = useReducer(favoriteReducer, initialState);

  // Load favorites from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_FAVORITES', payload: storedFavorites });
  }, []);

  // Save favorites to localStorage whenever state changes
  useEffect(() => {
    setStoredFavorites(state.items);
  }, [state.items, setStoredFavorites]);

  const addToFavorites = async (product: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Check if already in favorites
      if (state.items.some(item => item.id === product._id)) {
        dispatch({ type: 'SET_ERROR', payload: 'Product already in favorites' });
        return;
      }

      // Increment favorite count on server
      await api.products.incrementFavorite(product._id);

      // Add to local favorites
      const favoriteItem: FavoriteItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
        category: product.category?.name || 'Unknown',
        addedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_FAVORITE', payload: favoriteItem });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to favorites' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Decrement favorite count on server
      await api.products.decrementFavorite(productId);

      // Remove from local favorites
      dispatch({ type: 'REMOVE_FAVORITE', payload: productId });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from favorites' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const isFavorite = (productId: string): boolean => {
    return state.items.some(item => item.id === productId);
  };

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  };

  const getFavoriteCount = (): number => {
    return state.items.length;
  };

  const value: FavoriteContextType = {
    state,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    getFavoriteCount,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
```

### Notification Context

```typescript
// context/NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'success', message, duration });
  }, [addNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'error', message, duration });
  }, [addNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'warning', message, duration });
  }, [addNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    addNotification({ type: 'info', message, duration });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Container Component
const NotificationContainer: React.FC<{
  notifications: Notification[];
  onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Notification Toast Component
const NotificationToast: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg max-w-sm ${typeClasses[notification.type]} animate-slide-in`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{notification.message}</p>
        <button
          onClick={() => onRemove(notification.id)}
          className="ml-3 text-white hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
```

## 💾 Local Storage Management

### Custom Local Storage Hook

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Storage Keys and Types

```typescript
// utils/storage.ts
export const STORAGE_KEYS = {
  CART: 'ecommerce_cart',
  FAVORITES: 'ecommerce_favorites',
  USER_PREFERENCES: 'ecommerce_preferences',
  THEME: 'ecommerce_theme',
  RECENT_SEARCHES: 'ecommerce_recent_searches',
  VIEWED_PRODUCTS: 'ecommerce_viewed_products',
} as const;

export interface UserPreferences {
  currency: 'USD' | 'EUR' | 'GBP';
  language: 'en' | 'es' | 'fr';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    analytics: boolean;
    marketing: boolean;
  };
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

// Storage utility functions
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save to localStorage:`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from localStorage:`, error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Failed to clear localStorage:`, error);
    }
  },
};
```

## 🔄 State Synchronization

### Cross-Component State Updates

```typescript
// hooks/useStateSync.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useStateSync() {
  const queryClient = useQueryClient();

  // Sync cart changes with server
  useEffect(() => {
    const handleCartSync = () => {
      // Invalidate cart-related queries when cart changes
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    };

    // Listen for cart changes
    window.addEventListener('cart-updated', handleCartSync);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartSync);
    };
  }, [queryClient]);

  // Sync favorites with server
  useEffect(() => {
    const handleFavoritesSync = () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    };

    window.addEventListener('favorites-updated', handleFavoritesSync);
    
    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesSync);
    };
  }, [queryClient]);
}
```

### Optimistic Updates Pattern

```typescript
// utils/optimisticUpdates.ts
export const createOptimisticUpdate = <T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updateFn: (old: T) => T
) => {
  return {
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);
      
      // Optimistically update
      queryClient.setQueryData(queryKey, updateFn);
      
      return { previousData };
    },
    onError: (err: any, variables: any, context: any) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  };
};
```

## 🚀 Performance Optimizations

### Memoization Strategies

```typescript
// hooks/useMemoizedCallback.ts
import { useCallback, useRef } from 'react';

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    deps
  );
}

// Usage in components
const ProductCard = React.memo<ProductCardProps>(({ product, onAddToCart }) => {
  const handleAddToCart = useMemoizedCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);

  return (
    <Card>
      <Button onClick={handleAddToCart}>Add to Cart</Button>
    </Card>
  );
});
```

### State Selectors

```typescript
// hooks/useCartSelectors.ts
import { useCart } from '../context/CartContext';

export function useCartSelectors() {
  const { state } = useCart();
  
  const totalPrice = useMemo(() => {
    return state.items.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  }, [state.items]);
  
  const totalItems = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);
  
  const isCartEmpty = useMemo(() => {
    return state.items.length === 0;
  }, [state.items]);
  
  return {
    totalPrice,
    totalItems,
    isCartEmpty,
    items: state.items,
  };
}
```

This comprehensive state management documentation covers all aspects of managing state in the application, from server state with React Query to client state with Context API and persistent state with local storage.
