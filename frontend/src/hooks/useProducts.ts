import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { Product, ProductFilters, ProductPaginatedResponse } from '../types';
import { mockProducts } from '../data/mockData';

export function useProducts(filters?: ProductFilters) {
  return useQuery<ProductPaginatedResponse<Product>>(
    ['products', filters],
    async () => {
      try {
        return await api.products.getAll(filters);
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', error);
        const limit = filters?.limit || 10;
        const page = filters?.page || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = mockProducts.slice(startIndex, endIndex);
        
        return {
          success: true,
          data: paginatedProducts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(mockProducts.length / limit),
            totalProducts: mockProducts.length,
            hasNext: endIndex < mockProducts.length,
            hasPrev: page > 1,
            limit,
          },
        };
      }
    },
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

export function useProduct(id: string) {
  return useQuery<Product>(
    ['product', id],
    () => api.products.getById(id),
    {
      enabled: !!id,
    }
  );
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation(api.products.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: FormData }) => 
      api.products.update(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['products']);
        queryClient.invalidateQueries(['product', id]);
      },
    }
  );
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation(api.products.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
}

export function useLowStockProducts() {
  return useQuery<Product[]>(
    ['products', 'low-stock'],
    () => api.products.getLowStock(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
}
