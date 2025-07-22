import { useEffect } from 'react';
import { useCartStore } from './cart-store';
import { useAuth } from './use-auth';

export const useCart = () => {
  const {
    cart,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    clearError
  } = useCartStore();

  const { isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [fetchCart, isAuthenticated]);

  // Helper functions
  const getTotalItems = () => cart?.summary?.totalItems || 0;
  const getUniqueItems = () => cart?.summary?.uniqueItems || 0;
  const getTotalPrice = () => cart?.summary?.total || 0;
  const getSubtotal = () => cart?.summary?.subtotal || 0;
  const getTotalDiscount = () => cart?.summary?.totalDiscount || 0;
  
  const isInCart = (volumeId: string) => 
    cart?.items.some(item => item.volume.id === volumeId) || false;
  
  const getItemQuantity = (volumeId: string) => 
    cart?.items.find(item => item.volume.id === volumeId)?.quantity || 0;

  const isEmpty = !cart || cart.items.length === 0;

  return {
    // State
    cart,
    isLoading,
    error,
    isEmpty,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    clearError,
    
    // Helpers
    getTotalItems,
    getUniqueItems,
    getTotalPrice,
    getSubtotal,
    getTotalDiscount,
    isInCart,
    getItemQuantity,
  };
};
