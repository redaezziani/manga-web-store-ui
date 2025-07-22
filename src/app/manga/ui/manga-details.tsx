'use client';

import Image from "next/legacy/image";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { useVolume } from '@/stores/use-volume';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
// import MangaDetailsSkeleton from './MangaSkeleton';

interface MangaDetailsProps {
    volumeId: string;
}

export default function MangaDetails({ volumeId }: MangaDetailsProps) {
    const { volume, isLoading, error } = useVolume(volumeId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (error || !volume) {
        return <div className="text-center text-lg py-8">عذراً، حدث خطأ أثناء تحميل تفاصيل المجلد. يرجى المحاولة مرة أخرى لاحقاً.</div>;
    }

    const { manga } = volume;

    return (
        <div className="space-y-10">
            <div className="mt-4 flex w-full flex-col items-start justify-start gap-10 overflow-x-hidden md:flex-row">
                {/* Volume Cover */}
                <div className="relative aspect-[2/3] w-full max-w-60 overflow-hidden rounded-lg border border-gray-400/45">
                    <Image
                        placeholder='blur'
                        layout="fill"
                        blurDataURL={volume.coverImage || manga.coverImage}
                        src={volume.coverImage || manga.coverImage}
                        alt={manga.title}
                        className="object-cover"
                        priority
                    />
                </div>
                
                {/* Volume Details */}
                <div className="flex w-full flex-col gap-4">
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold">{manga.title}</h1>
                            <p className="text-muted-foreground text-sm">المجلد {volume.volumeNumber}</p>
                            <p className="text-muted-foreground text-sm">بواسطة: {manga.author}</p>
                        </div>

                        {/* Manga Description */}
                        <p className="text-muted-foreground max-w-3xl text-sm">
                            {manga.description || 'لا توجد وصف متاح لهذا المجلد.'}
                        </p>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 max-w-lg">
                            {manga.categories.map((category: any) => (
                                <Badge key={category.id} variant="secondary">
                                    {category.nameAr || category.name}
                                </Badge>
                            ))}
                        </div>

                        {/* Volume Information */}
                        <section className="w-full ">
                            <div className="space-y-2 w-full">
                                <p className="text-muted-foreground text-sm">
                                    رقم المجلد: {volume.volumeNumber}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    السعر: {volume.price} ريال
                                </p>
                                {volume.discount > 0 && (
                                    <p className="text-muted-foreground text-sm">
                                        الخصم: {volume.discount}%
                                    </p>
                                )}
                                <p className="text-muted-foreground text-sm font-semibold">
                                    السعر النهائي: {volume.finalPrice} ريال
                                </p>
                               <div className="grid w-full grid-cols-3 md:grid-cols-1 gap-2">
                                 <p className="text-muted-foreground text-sm">
                                    المخزون: {volume.stock} قطعة
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    الحالة: {volume.isAvailable ? 'متوفر' : 'غير متوفر'}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    تاريخ الإضافة: {format(new Date(volume.createdAt), 'PP', { locale: ar })}
                                </p>
                               </div>
                            </div>
                        </section>

                        {/* Add to Cart Button */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                disabled={!volume.isAvailable || volume.stock === 0}
                                className={`transition-colors ${
                                    volume.isAvailable && volume.stock > 0
                                        ? ' text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {volume.isAvailable && volume.stock > 0 ? 'إضافة إلى السلة' : 'غير متوفر'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Images */}
            {volume.previewImages && volume.previewImages.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">
                        معاينة المجلد
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {volume.previewImages.map((image: any, index: number) => (
                            <div key={index} className="relative aspect-[2/3] overflow-hidden rounded-lg border">
                                <Image
                                    src={image}
                                    alt={`معاينة ${index + 1}`}
                                    layout="fill"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}