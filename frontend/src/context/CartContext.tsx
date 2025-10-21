import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, CartItem, CartState } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  removeInvalidProducts: (invalidProductIds: string[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);
      
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, product.maxOrderQuantity);
        const updatedItems = state.items.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: updatedItems.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),
        };
      } else {
        const newItem: CartItem = { product, quantity: Math.min(quantity, product.maxOrderQuantity) };
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: updatedItems.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.product._id !== action.payload.productId);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId } });
      }
      
      const updatedItems = state.items.map(item => {
        if (item.product._id === productId) {
          const maxQuantity = Math.min(quantity, item.product.maxOrderQuantity);
          return { ...item, quantity: maxQuantity };
        }
        return item;
      });
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: updatedItems.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
    
    case 'LOAD_CART': {
      const items = action.payload;
      return {
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: items.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),
      };
    }
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedCart, setStoredCart] = useLocalStorage<CartItem[]>('cart', []);
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_CART', payload: storedCart });
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    setStoredCart(state.items);
  }, [state.items, setStoredCart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock === 0) {
      throw new Error('Product is out of stock');
    }
    
    if (quantity > product.maxOrderQuantity) {
      throw new Error(`Maximum quantity allowed is ${product.maxOrderQuantity}`);
    }
    
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) return;
    
    const item = state.items.find(item => item.product._id === productId);
    if (!item) return;
    
    const maxQuantity = Math.min(quantity, item.product.maxOrderQuantity);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity: maxQuantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item.product._id === productId);
  };

  const removeInvalidProducts = (invalidProductIds: string[]) => {
    invalidProductIds.forEach(productId => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
    });
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    removeInvalidProducts,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
