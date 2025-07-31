import { create } from 'zustand';
import { 
  WishlistResponse, 
  WishlistItem, 
  WishlistCountResponse, 
  WishlistCheckResponse,
  AddToWishlistRequest,
  RemoveFromWishlistRequest
} from '@/types/manga';
import { httpClient, apiCall } from '@/lib/http-client';

interface WishlistStore {
  items: WishlistItem[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (request: AddToWishlistRequest) => Promise<void>;
  removeFromWishlist: (request: RemoveFromWishlistRequest) => Promise<void>;
  clearWishlist: () => Promise<void>;
  getWishlistCount: () => Promise<number>;
  checkInWishlist: (mangaId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  totalCount: 0,
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<WishlistResponse>(
        () => httpClient.get('/wishlist'),
        'Failed to fetch wishlist'
      );

      console.log('Fetched wishlist:', data);
      
      if (data.success) {
        set({ 
          items: data.data.items, 
          totalCount: data.data.totalCount,
          isLoading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch wishlist');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
    }
  },

  addToWishlist: async (request: AddToWishlistRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<{ success: boolean; message: string; data: any }>(
        () => httpClient.post('/wishlist', request),
        'Failed to add to wishlist'
      );
      
      if (data.success) {
        // Refetch wishlist to get updated data
        await get().fetchWishlist();
      } else {
        throw new Error(data.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
      throw error; // Re-throw to handle in UI
    }
  },

  removeFromWishlist: async (request: RemoveFromWishlistRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<{ success: boolean; message: string; data: any }>(
        () => httpClient.delete('/wishlist', request),
        'Failed to remove from wishlist'
      );
      
      if (data.success) {
        // Remove item from local state
        const currentItems = get().items;
        const updatedItems = currentItems.filter(item => item.manga.id !== request.mangaId);
        set({ 
          items: updatedItems,
          totalCount: updatedItems.length,
          isLoading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
      throw error; // Re-throw to handle in UI
    }
  },

  clearWishlist: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<{ success: boolean; message: string; data: any }>(
        () => httpClient.delete('/wishlist/clear'),
        'Failed to clear wishlist'
      );
      
      if (data.success) {
        set({ 
          items: [],
          totalCount: 0,
          isLoading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to clear wishlist');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
      throw error;
    }
  },

  getWishlistCount: async () => {
    try {
      const data = await apiCall<WishlistCountResponse>(
        () => httpClient.get('/wishlist/count'),
        'Failed to get wishlist count'
      );
      
      if (data.success) {
        set({ totalCount: data.data.count });
        return data.data.count;
      } else {
        throw new Error(data.message || 'Failed to get wishlist count');
      }
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  },

  checkInWishlist: async (mangaId: string) => {
    try {
      const data = await apiCall<WishlistCheckResponse>(
        () => httpClient.get(`/wishlist/check/${mangaId}`),
        'Failed to check wishlist status'
      );
      
      if (data.success) {
        return data.data.inWishlist;
      } else {
        throw new Error(data.message || 'Failed to check wishlist status');
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
