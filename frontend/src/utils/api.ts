import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('admin');
          window.location.href = '/admin/login';
        } else if (error.response?.status === 429) {
          // Rate limit exceeded
          console.warn('Rate limit exceeded. Please wait before making more requests.');
          // Don't redirect, just show a warning
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return (response.data.data || response.data) as T;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return (response.data.data || response.data) as T;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return (response.data.data || response.data) as T;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return (response.data.data || response.data) as T;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return (response.data.data || response.data) as T;
  }

  // File upload method
  async upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return (response.data.data || response.data) as T;
  }

  // Paginated requests
  async getPaginated<T = any>(
    url: string,
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    const response = await this.client.get<ApiResponse<{orders: T[], pagination: any}>>(url, { params });
    
    // Handle the actual backend response structure: {success: true, data: {orders: [...], pagination: {...}}}
    if (response.data.success && response.data.data) {
      return {
        success: true,
        orders: response.data.data.orders,
        pagination: response.data.data.pagination
      } as PaginatedResponse<T>;
    }
    
    // Fallback to direct response structure
    return response.data as unknown as PaginatedResponse<T>;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// API endpoints
export const api = {
  // Health check
  health: () => apiClient.get('/health'),

  // Products
  products: {
    getAll: async (params?: Record<string, any>) => {
      // Backend returns { success, data: { products, pagination } }
      const response = await apiClient.get<{ products: any[]; pagination: any } | { products?: any[]; pagination?: any }>(
        '/products',
        { params }
      );
      // apiClient.get unwraps .data once; response is the inner data
      // Normalize to { success, data: Product[], pagination }
      const products = (response as any).products || (response as any).data?.products || [];
      const pagination = (response as any).pagination || (response as any).data?.pagination || {
        page: 1,
        pages: 1,
        total: products.length,
        limit: params?.limit || 10,
      };
      return {
        success: true,
        data: products,
        pagination,
      } as any;
    },
    getById: async (id: string) => {
      const res = await apiClient.get<any>(`/products/${id}`);
      // Backend returns { product, relatedProducts }
      return (res as any).product || res;
    },
    create: (data: FormData) => apiClient.upload('/admin/products', data),
    update: async (id: string, data: FormData) => {
      // Ensure multipart PUT
      const response = await (apiClient as any).client.put(`/admin/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return (response.data.data || response.data) as any;
    },
    delete: (id: string) => apiClient.delete(`/admin/products/${id}`),
    getLowStock: () => apiClient.get('/products/low-stock'),
    incrementFavorite: (id: string) => apiClient.post(`/products/${id}/favorite`),
    decrementFavorite: (id: string) => apiClient.delete(`/products/${id}/favorite`),
  },

  // Categories
  categories: {
    getAll: () => apiClient.get('/categories'),
    getById: (id: string) => apiClient.get(`/categories/${id}`),
    create: (data: FormData) => apiClient.upload('/admin/categories', data),
    update: async (id: string, data: FormData) => {
      const response = await (apiClient as any).client.put(`/admin/categories/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return (response.data.data || response.data) as any;
    },
    delete: (id: string) => apiClient.delete(`/admin/categories/${id}`),
    getProducts: (id: string, params?: Record<string, any>) => 
      apiClient.getPaginated(`/categories/${id}/products`, params),
  },

  // Orders
  orders: {
    create: (data: any) => apiClient.post('/orders', data),
    getAll: (params?: Record<string, any>) => apiClient.getPaginated('/admin/orders', params),
    getById: (id: string) => apiClient.get(`/admin/orders/${id}`),
    getStatus: (orderId: string) => apiClient.get(`/orders/${orderId}/status`),
    updateStatus: (id: string, data: { status: string; reason?: string }) => 
      apiClient.put(`/admin/orders/${id}/status`, data),
    cancel: (id: string, data: { reason: string }) => 
      apiClient.put(`/admin/orders/${id}/cancel`, data),
    getStats: () => apiClient.get('/admin/orders/stats'),
  },

  // Customer Orders
  customerOrders: {
    sync: (orders: any[]) => apiClient.post('/customer-orders/sync', { orders }),
    getAll: (params?: Record<string, any>) => apiClient.getPaginated('/customer-orders/customer-orders', params),
    getById: (orderId: string) => apiClient.get(`/customer-orders/${orderId}`),
    updateStatus: (orderId: string, data: { status: string; reason?: string }) => 
      apiClient.put(`/customer-orders/${orderId}/status`, data),
  },

  // Admin
  admin: {
    login: (data: { email: string; password: string }) => 
      apiClient.post('/admin/login', data),
    verifyToken: () => apiClient.get('/admin/verify-token'),
    getProfile: () => apiClient.get('/admin/profile'),
    updateProfile: (data: any) => apiClient.put('/admin/profile', data),
    changePassword: (data: { currentPassword: string; newPassword: string }) => 
      apiClient.put('/admin/change-password', data),
    getDashboard: () => apiClient.get('/admin/dashboard'),
    createAdmin: (data: any) => apiClient.post('/admin/create-admin', data),
    getAllAdmins: () => apiClient.get('/admin/admins'),
    updateAdminStatus: (id: string, data: { isActive: boolean }) => 
      apiClient.put(`/admin/admins/${id}/status`, data),
  },

  // Analytics
  analytics: {
    getSales: (params?: Record<string, any>) => 
      apiClient.get('/admin/analytics/sales', { params }),
    getProducts: (params?: Record<string, any>) => 
      apiClient.get('/admin/analytics/products', { params }),
    getLowStock: () => apiClient.get('/admin/analytics/low-stock'),
    getOrders: (params?: Record<string, any>) => 
      apiClient.get('/admin/analytics/orders', { params }),
    getDashboard: () => apiClient.get('/admin/analytics/dashboard'),
  },
};

export default api;
