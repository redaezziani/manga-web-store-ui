'use client';

import React, { useState } from 'react';
import Image from "next/legacy/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrencyAr } from '@/lib/currency';
import { useMangaVolumes } from '@/hooks/use-manga-volumes';
import { useCart } from '@/stores/use-cart';
import { VolumeListItem } from '@/types/manga';

interface MangaVolumesListProps {
  mangaId: string;
  currentVolumeId?: string;
}

interface VolumeCardProps {
  volume: VolumeListItem;
  isCurrentVolume: boolean;
}

function VolumeCard({ volume, isCurrentVolume }: VolumeCardProps) {
  const { addToCart, isLoading: cartLoading } = useCart();
  const [quantity] = useState(1);

  const handleAddToCart = async (e: React.MouseEvent) => {
    // add a fake delay to simulate network request using promise
    e.preventDefault(); 
    await addToCart({
      volumeId: volume.id,
      quantity: quantity
    });
  };

  return (
    <div className={`group relative ${isCurrentVolume ? '' : ''}`}>
      <Link href={`/volume/${volume.id}`} className="block">
        <Card className="group bg-transparent dark:bg-transparent overflow-hidden border-none shadow-none">
          <div className="relative aspect-[10/14] w-full overflow-hidden rounded-lg">
            <Image
              src={volume.coverImage || volume.manga.coverImage}
              alt={`${volume.manga.title} - المجلد ${volume.volumeNumber}`}
              style={{ objectFit: "cover" }}
              loading='lazy'
              placeholder='blur'
              blurDataURL={volume.coverImage || volume.manga.coverImage}
              quality={100}
              layout="fill"
            />

            {/* Top badges */}
            <div className="absolute right-2 top-2 flex flex-col gap-1">
              {isCurrentVolume && (
                <span className="rounded-md bg-primary/90 px-2 py-1 text-xs text-white">
                  الحالي
                </span>
              )}

            </div>

            {/* Add to cart button overlay */}
            {!isCurrentVolume && volume.isAvailable && volume.stock > 0 && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  size="sm"
                  className="transform scale-90 group-hover:scale-100 transition-transform"
                >
                  {cartLoading ? (
                    <>
                      <svg className="mr-3  size-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>

                      إضافة للسلة...
                    </>
                  ) : (
                    'إضافة للسلة'
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="w-full">
            <h3 className="line-clamp-1 text-md font-medium">
              المجلد {volume.volumeNumber}
            </h3>
            <div className="flex items-center gap-2">
              {volume.discount > 0 ? (
                <>
                  <span className="text-xs  text-gray-900">
                    {formatCurrencyAr(volume.finalPrice)}
                  </span>
                  <span className="text-xs  text-gray-900">
                    {formatCurrencyAr(volume.price)}
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrencyAr(volume.price)}
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

export default function MangaVolumesList({ mangaId, currentVolumeId }: MangaVolumesListProps) {
  const { volumes, isLoading, error } = useMangaVolumes(mangaId);

  if (isLoading) {
    return (
      <div className=" mt-4">
        <h2 className="text-2xl font-bold">مجلدات أخرى من نفس السلسلة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-[10/14] bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">مجلدات أخرى من نفس السلسلة</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>حدث خطأ أثناء تحميل المجلدات الأخرى</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!volumes.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">مجلدات أخرى من نفس السلسلة</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>لا توجد مجلدات أخرى متاحة لهذه السلسلة</p>
        </div>
      </div>
    );
  }

  // Sort volumes by volume number
  const sortedVolumes = [...volumes].sort((a, b) => a.volumeNumber - b.volumeNumber);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold ">مجلدات أخرى من نفس السلسلة</h2>
        <span className="text-sm text-muted-foreground">
          {volumes.length} مجلد متاح
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {sortedVolumes.map((volume) => (
          <VolumeCard
            key={volume.id}
            volume={volume}
            isCurrentVolume={volume.id === currentVolumeId}
          />
        ))}
      </div>
    </div>
  );
}
