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
    getCartCount,
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

  const getCartItemId = (volumeId: string) => 
    cart?.items.find(item => item.volume.id === volumeId)?.id || null;

  // Wrapper functions to work with volume IDs (for backward compatibility)
  const removeFromCartByVolumeId = async (volumeId: string) => {
    const cartItemId = getCartItemId(volumeId);
    if (cartItemId) {
      await removeFromCart(cartItemId);
    }
  };

  const updateQuantityByVolumeId = async (volumeId: string, quantity: number) => {
    const cartItemId = getCartItemId(volumeId);
    if (cartItemId) {
      await updateQuantity(cartItemId, quantity);
    }
  };

  const isEmpty = !cart || cart.items.length === 0;

  return {
    // State
    cart,
    isLoading,
    error,
    isEmpty,
    
    // Actions
    addToCart,
    removeFromCart: removeFromCartByVolumeId, // For backward compatibility with volume IDs
    updateQuantity: updateQuantityByVolumeId, // For backward compatibility with volume IDs
    removeFromCartByItemId: removeFromCart, // Direct cart item ID access
    updateQuantityByItemId: updateQuantity, // Direct cart item ID access
    clearCart,
    fetchCart,
    getCartCount,
    clearError,
    
    // Helpers
    getTotalItems,
    getUniqueItems,
    getTotalPrice,
    getSubtotal,
    getTotalDiscount,
    isInCart,
    getItemQuantity,
    getCartItemId,
  };
};
