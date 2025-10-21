import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../utils/api';
import { Category } from '../types';
import { mockCategories } from '../data/mockData';

export function useCategories() {
  return useQuery<Category[]>(
    ['categories'],
    async () => {
      try {
        return await api.categories.getAll();
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn('Categories API failed, using mock data:', error);
        return mockCategories;
      }
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

export function useCategory(id: string) {
  return useQuery<Category>(
    ['category', id],
    () => api.categories.getById(id),
    {
      enabled: !!id,
    }
  );
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation(api.categories.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: FormData }) => 
      api.categories.update(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['categories']);
        queryClient.invalidateQueries(['category', id]);
      },
    }
  );
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation(api.categories.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });
}
