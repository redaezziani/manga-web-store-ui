'use client';

import { Heart, X, Trash2 } from 'lucide-react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { useWishlist } from '@/stores/use-wishlist';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground relative size-8 rounded-full shadow-none"
          aria-label="فتح قائمة الأمنيات"
        >
          <Heart size={16} className="stroke-1" />
          {totalCount > 0 && (
            <div className="bg-primary absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center text-xs text-white font-medium">
              {totalCount > 99 ? '99+' : totalCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-80 md:w-96 p-1" align="end">
        {!isAuthenticated ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              يجب تسجيل الدخول لعرض قائمة الأمنيات
            </p>
            <Button asChild size="sm">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-4 px-3 py-2">
              <div className="text-sm font-semibold">قائمة الأمنيات</div>
              {items.length > 0 && (
                <button
                  className="text-xs font-medium hover:underline text-destructive"
                  onClick={handleClearWishlist}
                  disabled={isLoading}
                >
                  مسح الكل
                </button>
              )}
            </div>

            <div
              role="separator"
              aria-orientation="horizontal"
              className="bg-border -mx-1 my-1 h-px"
            />

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="mr-3 size-4 animate-spin text-white invert" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm">جاري التحميل...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="px-3 py-8 text-center text-muted-foreground">
                  <Heart size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">قائمة الأمنيات فارغة</p>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="hover:bg-accent rounded-md px-3 py-3 transition-colors border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative w-12 h-16 rounded-md overflow-hidden border flex-shrink-0">
                          <Image
                            src={item.manga.coverImage}
                            alt={item.manga.title}
                            layout="fill"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium line-clamp-1">
                                {item.manga.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {item.manga.author}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleRemoveItem(item.manga.id, e)}
                              className="text-muted-foreground hover:text-destructive p-1"
                              disabled={isLoading}
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="font-medium">
                              {formatCurrencyAr(item.manga.minPrice)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {item.manga.volumeCount} مجلد
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="px-3 py-3 bg-muted/30 rounded-md mx-2 mt-2 space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>عدد العناصر:</span>
                      <span>{totalCount} عنصر</span>
                    </div>
                    <Button
                      asChild
                      className="w-full mt-2"
                      size="sm"
                    >
                      <Link href="/wishlist">عرض الكل</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
