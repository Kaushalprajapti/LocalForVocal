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
