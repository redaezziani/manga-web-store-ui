'use client';

import { useEffect } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/stores/use-wishlist';
import { useCart } from '@/stores/use-cart';
import { formatCurrencyAr } from '@/lib/currency';

export default function WishlistPage() {
  const { 
    items, 
    totalCount, 
    isLoading, 
    error,
    removeMangaFromWishlist, 
    clearWishlist,
    isAuthenticated,
    fetchWishlist
  } = useWishlist();

  const { addToCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleRemoveItem = async (mangaId: string) => {
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

  const handleAddToCart = async (mangaId: string) => {
    // Find the first available volume for this manga
    // This is a simplified approach - in practice, you might want to show a volume selector
    try {
      // For now, we'll just show an alert - you'll need to implement volume selection
      alert('يرجى اختيار المجلد المحدد من صفحة المانغا');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">قائمة الأمنيات</h1>
          <p className="text-muted-foreground mb-6">
            يجب تسجيل الدخول لعرض قائمة الأمنيات الخاصة بك
          </p>
          <Button asChild>
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">قائمة الأمنيات</h1>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mt-2"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[2/3] bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-destructive mb-6" />
          <h1 className="text-2xl font-bold mb-4">خطأ في تحميل قائمة الأمنيات</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => fetchWishlist()}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">قائمة الأمنيات فارغة</h1>
          <p className="text-muted-foreground mb-6">
            لم تقم بإضافة أي مانغا إلى قائمة الأمنيات بعد
          </p>
          <Button asChild>
            <Link href="/catalog">تصفح المانغا</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">قائمة الأمنيات</h1>
          <p className="text-muted-foreground mt-1">
            {totalCount} {totalCount === 1 ? 'عنصر' : 'عنصر'}
          </p>
        </div>
        
        {totalCount > 0 && (
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            disabled={isLoading}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            مسح الكل
          </Button>
        )}
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-[2/3] overflow-hidden">
              <Link href={`/manga/${item.manga.id}`}>
                <Image
                  src={item.manga.coverImage}
                  alt={item.manga.title}
                  layout="fill"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Remove from wishlist button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveItem(item.manga.id)}
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <Link href={`/manga/${item.manga.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                      {item.manga.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.manga.author}
                  </p>
                </div>

                {/* Categories */}
                {item.manga.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.manga.categories.slice(0, 2).map((category) => (
                      <Badge key={category.id} variant="secondary" className="text-xs">
                        {category.name}
                      </Badge>
                    ))}
                    {item.manga.categories.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.manga.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Price and Volume Info */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-primary">
                      {formatCurrencyAr(item.manga.minPrice)}
                    </span>
                    <span className="text-muted-foreground mr-2">
                      من
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {item.manga.volumeCount} مجلد
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    asChild 
                    className="flex-1"
                    size="sm"
                  >
                    <Link href={`/manga/${item.manga.id}`}>
                      عرض التفاصيل
                    </Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => handleRemoveItem(item.manga.id)}
                    title="إزالة من قائمة الأمنيات"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          هل تريد إضافة المزيد من المانغا إلى قائمة الأمنيات؟
        </p>
        <Button asChild variant="outline">
          <Link href="/catalog">
            متابعة التسوق
          </Link>
        </Button>
      </div>
    </div>
  );
}
