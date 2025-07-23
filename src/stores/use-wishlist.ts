import { useEffect, useState } from 'react';
import { useWishlistStore } from './wishlist-store';
import { useAuth } from './use-auth';

export const useWishlist = () => {
  const {
    items,
    totalCount,
    isLoading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getWishlistCount,
    checkInWishlist,
    clearError,
  } = useWishlistStore();

  const { isAuthenticated } = useAuth();

  // Auto-fetch wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  // Helper functions
  const addMangaToWishlist = async (mangaId: string) => {
    if (!isAuthenticated) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    
    try {
      await addToWishlist({ mangaId });
      return true;
    } catch (error) {
      throw error;
    }
  };

  const removeMangaFromWishlist = async (mangaId: string) => {
    if (!isAuthenticated) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    
    try {
      await removeFromWishlist({ mangaId });
      return true;
    } catch (error) {
      throw error;
    }
  };

  const toggleWishlist = async (mangaId: string) => {
    if (!isAuthenticated) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    const inWishlist = await checkInWishlist(mangaId);
    
    if (inWishlist) {
      await removeMangaFromWishlist(mangaId);
      return false; // Removed from wishlist
    } else {
      await addMangaToWishlist(mangaId);
      return true; // Added to wishlist
    }
  };

  const isInWishlist = (mangaId: string) => {
    return items.some(item => item.manga.id === mangaId);
  };

  return {
    // State
    items,
    totalCount,
    isLoading,
    error,
    isAuthenticated,
    
    // Actions
    addMangaToWishlist,
    removeMangaFromWishlist,
    toggleWishlist,
    clearWishlist,
    fetchWishlist,
    getWishlistCount,
    checkInWishlist,
    clearError,
    
    // Helpers
    isInWishlist,
    isEmpty: items.length === 0,
  };
};
