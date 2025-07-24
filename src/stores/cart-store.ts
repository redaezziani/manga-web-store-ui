import { create } from 'zustand';
import { Cart, CartResponse, AddToCartRequest } from '@/types/manga';
import { httpClient, apiCall } from '@/lib/http-client';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (request: AddToCartRequest) => Promise<void>;
  removeFromCart: (volumeId: string) => Promise<void>;
  updateQuantity: (volumeId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearError: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,
  isCartOpen: false,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<CartResponse>(
        () => httpClient.get('/cart'),
        'Failed to fetch cart'
      );
      
      if (data.success) {
        set({ cart: data.data, isLoading: false });
      } else {
        throw new Error(data.message || 'Failed to fetch cart');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
    }
  },

  addToCart: async (request: AddToCartRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<CartResponse>(
        () => httpClient.post('/cart/add', request),
        'Failed to add item to cart'
      );
      
      if (data.success) {
        set({ cart: data.data, isLoading: false });
      } else {
        throw new Error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
    }
  },

  removeFromCart: async (volumeId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<CartResponse>(
        () => httpClient.delete(`/cart/remove/${volumeId}`),
        'Failed to remove item from cart'
      );
      
      if (data.success) {
        set({ cart: data.data, isLoading: false });
      } else {
        throw new Error(data.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
    }
  },

  updateQuantity: async (volumeId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<CartResponse>(
        () => httpClient.put('/cart/update', { volumeId, quantity }),
        'Failed to update cart item'
      );
      
      if (data.success) {
        set({ cart: data.data, isLoading: false });
      } else {
        throw new Error(data.message || 'Failed to update cart item');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<CartResponse>(
        () => httpClient.delete('/cart/clear'),
        'Failed to clear cart'
      );
      
      if (data.success) {
        set({ cart: data.data, isLoading: false });
      } else {
        throw new Error(data.message || 'Failed to clear cart');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
    }
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  clearError: () => set({ error: null }),
}));
