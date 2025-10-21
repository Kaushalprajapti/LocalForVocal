import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { Order, OrderFilters, PaginatedResponse } from '../types';

export function useOrders(filters?: OrderFilters) {
  return useQuery<PaginatedResponse<Order>>(
    ['orders', filters],
    () => api.orders.getAll(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes - increased to reduce API calls
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: (failureCount, error: any) => {
        // Don't retry on 429 (rate limit) errors
        if (error?.response?.status === 429) {
          return false;
        }
        return failureCount < 2; // Only retry twice for other errors
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    }
  );
}

export function useOrder(id: string) {
  return useQuery<Order>(
    ['order', id],
    () => api.orders.getById(id),
    {
      enabled: !!id,
    }
  );
}

export function useOrderStatus(orderId: string) {
  // Additional validation to prevent any invalid API calls
  const isValidOrderId = Boolean(orderId && 
    orderId !== '' && 
    orderId !== 'undefined' && 
    orderId !== 'null' &&
    orderId.length > 0 &&
    !orderId.includes('undefined'));

  return useQuery<Order>(
    ['order-status', orderId],
    () => api.orders.getStatus(orderId),
    {
      enabled: isValidOrderId,
      refetchInterval: isValidOrderId ? 60000 : false, // Increased to 60 seconds to reduce API calls
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: (failureCount, error: any) => {
        // Don't retry on 404 or 429 errors
        if (error?.response?.status === 404 || error?.response?.status === 429) {
          return false;
        }
        return failureCount < 1; // Only retry once for other errors
      },
      retryDelay: 5000, // 5 second delay
    }
  );
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation(api.orders.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: { status: string; reason?: string } }) => 
      api.orders.updateStatus(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['orders']);
        queryClient.invalidateQueries(['order', id]);
        queryClient.invalidateQueries(['order-status']);
      },
      onError: (error: any) => {
        console.error('Order status update failed:', error);
      },
    }
  );
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, reason }: { id: string; reason: string }) => 
      api.orders.cancel(id, { reason }),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['orders']);
        queryClient.invalidateQueries(['order', id]);
      },
    }
  );
}

export function useOrderStats() {
  return useQuery(
    ['orders', 'stats'],
    () => api.orders.getStats(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}
