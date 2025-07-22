import { create } from 'zustand';
import { Cart, CartResponse, AddToCartRequest } from '@/types/manga';

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
      const response = await fetch('http://localhost:7000/api/v1/cart', {
        headers: {
          'accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CartResponse = await response.json();
      
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
      const response = await fetch('http://localhost:7000/api/v1/cart/add', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CartResponse = await response.json();
      
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
      const response = await fetch(`http://localhost:7000/api/v1/cart/remove/${volumeId}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CartResponse = await response.json();
      
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
      const response = await fetch('http://localhost:7000/api/v1/cart/update', {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volumeId, quantity }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CartResponse = await response.json();
      
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
      const response = await fetch('http://localhost:7000/api/v1/cart/clear', {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CartResponse = await response.json();
      
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
