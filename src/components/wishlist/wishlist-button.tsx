'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/stores/use-wishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  mangaId: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export default function WishlistButton({ 
  mangaId, 
  variant = 'ghost', 
  size = 'icon',
  className,
  showText = false
}: WishlistButtonProps) {
  const { 
    isInWishlist, 
    toggleWishlist, 
    isLoading, 
    isAuthenticated,
    error,
    clearError
  } = useWishlist();
  
  const [localLoading, setLocalLoading] = useState(false);
  const inWishlist = isInWishlist(mangaId);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      // Could emit an event or show a toast here
      return;
    }

    setLocalLoading(true);
    clearError();

    try {
      await toggleWishlist(mangaId);
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      // Error is handled by the store
    } finally {
      setLocalLoading(false);
    }
  };

  const isButtonLoading = isLoading || localLoading;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isButtonLoading}
      className={cn(
        "transition-all duration-200",
        inWishlist && "text-red-500 hover:text-red-600",
        className
      )}
      title={
        !isAuthenticated 
          ? "يجب تسجيل الدخول أولاً" 
          : inWishlist 
            ? "إزالة من قائمة الأمنيات" 
            : "إضافة إلى قائمة الأمنيات"
      }
    >
      {isButtonLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : (
        <>
          <Heart 
            className={cn(
              "h-4 w-4 transition-all",
              inWishlist && "fill-current"
            )} 
          />
          {showText && (
            <span className="mr-2">
              {inWishlist ? 'في قائمة الأمنيات' : 'أضف للأمنيات'}
            </span>
          )}
        </>
      )}
    </Button>
  );
}
