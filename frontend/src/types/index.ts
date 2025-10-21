// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  maxOrderQuantity: number;
  sku?: string;
  tags: string[];
  specifications?: Record<string, string>;
  ratings: {
    average: number;
    count: number;
  };
  favoriteCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  whatsappMessageSent: boolean;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Admin Types
export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  orders: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

export interface ProductPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

// Filter Types
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Analytics Types
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductAnalytics {
  productId: string;
  name: string;
  views: number;
  orders: number;
  revenue: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: Order[];
  topProducts: ProductAnalytics[];
  salesData: SalesData[];
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CheckoutForm {
  name: string;
  phone: string;
  email?: string;
  address: string;
  termsAccepted: boolean;
}

export interface ProductForm {
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  maxOrderQuantity: number;
  sku?: string;
  tags: string[];
  specifications: Record<string, string>;
  isActive: boolean;
}

export interface CategoryForm {
  name: string;
  image?: File;
  parentCategory?: string;
  isActive: boolean;
}

// Notification Types
export interface NotificationState {
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  [key: string]: any;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}
