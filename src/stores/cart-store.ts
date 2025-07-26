import { create } from 'zustand';
import { 
  Cart, 
  CartResponse, 
  AddToCartRequest, 
  UpdateCartItemRequest,
  CartCountResponse,
  ClearCartResponse
} from '@/types/manga';
import { httpClient, apiCall } from '@/lib/http-client';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (request: AddToCartRequest) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => Promise<number>;
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

  removeFromCart: async (cartItemId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<CartResponse>(
        () => httpClient.delete(`/cart/remove/${cartItemId}`),
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

  updateQuantity: async (cartItemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<CartResponse>(
        () => httpClient.put('/cart/update', { cartItemId, quantity }),
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
      const data = await apiCall<ClearCartResponse>(
        () => httpClient.delete('/cart/clear'),
        'Failed to clear cart'
      );
      
      if (data.success) {
        // After clearing, set cart to null since it's empty
        set({ cart: null, isLoading: false });
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

  getCartCount: async () => {
    try {
      const data = await apiCall<CartCountResponse>(
        () => httpClient.get('/cart/count'),
        'Failed to get cart count'
      );
      
      if (data.success) {
        return data.data.count;
      } else {
        throw new Error(data.message || 'Failed to get cart count');
      }
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  clearError: () => set({ error: null }),
}));
