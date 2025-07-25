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
      <>
       <svg className="mr-3  size-4 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
       <p className="text-sm">
          {inWishlist ? 'إزالة من الأمنيات...' : 'إضافة للأمنيات...'}
        </p>
      </>
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
