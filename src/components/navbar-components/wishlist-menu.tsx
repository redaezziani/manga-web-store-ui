'use client';

import { Heart, Trash2, X } from 'lucide-react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/stores/use-wishlist';
import { formatCurrencyAr } from '@/lib/currency';

export default function WishlistMenu() {
  const { 
    items, 
    totalCount, 
    isLoading, 
    removeMangaFromWishlist, 
    clearWishlist,
    isAuthenticated 
  } = useWishlist();

  const handleRemoveItem = async (mangaId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await removeMangaFromWishlist(mangaId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Heart className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              يجب تسجيل الدخول لعرض قائمة الأمنيات
            </p>
            <Button asChild size="sm">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
             {/* <ShoppingBasket size={16} aria-hidden="true" />
          {totalItems > 0 && (
            <div
              aria-hidden="true"
              className="bg-primary absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center text-xs text-white font-medium"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </div>
          )} */}
          <Heart size={16} aria-hidden="true" className=' stroke-1' />
          {totalCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 size-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalCount > 99 ? '99+' : totalCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">قائمة الأمنيات</h3>
            {totalCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearWishlist}
                disabled={isLoading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                مسح الكل
              </Button>
            )}
          </div>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} عنصر
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">جاري التحميل...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">قائمة الأمنيات فارغة</p>
            <p className="text-sm text-muted-foreground">
              أضف بعض المانغا المفضلة لديك
            </p>
          </div>
        ) : (
          <div>
            <div className="h-80 overflow-y-auto">
              <div className="p-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Link 
                      href={`/manga/${item.manga.id}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={item.coverImage}
                          alt={item.manga.title}
                          layout="fill"
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {item.manga.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.manga.author}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium">
                            {formatCurrencyAr(item.manga.minPrice)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.manga.volumeCount} مجلد
                          </span>
                        </div>
                      </div>
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleRemoveItem(item.manga.id, e)}
                      className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t">
              <Button asChild className="w-full" size="sm">
                <Link href="/wishlist">عرض قائمة الأمنيات كاملة</Link>
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
