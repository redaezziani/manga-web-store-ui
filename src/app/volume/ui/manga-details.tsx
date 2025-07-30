'use client';

import Image from "next/legacy/image";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { useVolume } from '@/stores/use-volume';
import { useCart } from '@/stores/use-cart';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import MangaVolumesList from '@/components/manga/manga-volumes-list';
import WishlistButton from '@/components/wishlist/wishlist-button';
import Link from "next/link";
import { formatCurrencyAr } from "@/lib/currency";
import { Card } from "@/components/ui/card";
import { BookOpen, Instagram, Mail, Twitter } from "lucide-react";
// import MangaDetailsSkeleton from './MangaSkeleton';

interface MangaDetailsProps {
    volumeId: string;
}


export interface Volume {
    id: string
    volumeNumber: number
    price: number
    discount: number
    finalPrice: number
    stock: number
    coverImage?: string
    isAvailable: boolean
    manga: Manga
}

export interface Manga {
    id: string
    title: string
    author: string
    coverImage: string
    isAvailable: boolean
    description: string
}

export default function MangaDetails({ volumeId }: MangaDetailsProps) {
    const { volume, isLoading, error } = useVolume(volumeId);
    const { addToCart, isLoading: cartLoading } = useCart();
    const [quantity, setQuantity] = useState(1);

    const [relatedVolumes, setRelatedVolumes] = useState<Volume[]>([]);

    const handelRelatedVolumes = async (volumeId: string) => {
        try {
            const res = await fetch(`http://localhost:7000/api/v1/volumes/${volumeId}/related?limit=6`);
            if (!res.ok) {
                throw new Error('Failed to fetch related volumes');
            }
            const data = await res.json();
            const volumes = data.data;
            setRelatedVolumes(volumes);
        }
        catch (error) {
            console.error("Error fetching related volumes:", error);
        }
    };

    useEffect(() => {
        handelRelatedVolumes(volumeId);
    }, [volumeId]);

    const handleAddToCart = async () => {
        // made a fake delay to simulate network request using promise


        if (volume) {
            await addToCart({
                volumeId: volume.id,
                quantity: quantity
            });
        }
    };

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
    if (!manga) {
        return <div className="text-center text-lg py-8">لا توجد معلومات متاحة لهذا المجلد.</div>;
    }



    return (
        <div className="space-y-10">
            <div className="mt-4 flex w-full flex-col items-start justify-start gap-4 md:gap-10 overflow-x-hidden md:flex-row">
                {/* Volume Cover */}
                <div className="relative aspect-[2/3] min-w-60 overflow-hidden rounded-lg border border-gray-400/45">
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
                                    السعر: {volume.price} درهم
                                </p>
                                {volume.discount > 0 && (
                                    <p className="text-muted-foreground text-sm">
                                        الخصم: {volume.discount}%
                                    </p>
                                )}
                                <p className="text-muted-foreground text-sm font-semibold">
                                    السعر النهائي: {volume.finalPrice} درهم
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

                        {/* Add to Cart Section */}
                        <div className="space-y-4 pt-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium">الكمية:</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-8 w-8 rounded-md bg-white border border-border flex items-center justify-center hover:bg-accent"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-medium min-w-[30px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(volume.stock, quantity + 1))}
                                        className="h-8 w-8 rounded-md bg-white border border-border flex items-center justify-center hover:bg-accent"
                                        disabled={quantity >= volume.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button and Wishlist */}
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={!volume.isAvailable || volume.stock === 0 || cartLoading}
                                    className="flex-1 max-w-1/2 md:flex-none"
                                >
                                    {cartLoading ? (
                                        <>
                                            <svg className="mr-3  size-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>

                                            إضافة للسلة...
                                        </>
                                    ) : volume.isAvailable && volume.stock > 0 ? (
                                        `إضافة إلى السلة (${(volume.finalPrice * quantity).toFixed(2)} درهم)`
                                    ) : (
                                        'غير متوفر'
                                    )}
                                </Button>
                                <WishlistButton
                                    mangaId={manga.id}
                                    variant="outline"
                                    size="default"
                                    showText={true}
                                />
                            </div>
                        </div>
                        <MangaVolumesList
                            mangaId={manga.id}
                            currentVolumeId={volume.id}
                        />
                        {relatedVolumes.length > 0 && (

                            <div className="">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">المجلدات المشابهة </h2>

                                    <span className="text-sm text-muted-foreground">
                                        {relatedVolumes.length} مجلدات
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {relatedVolumes.map((relatedVolume) => (
                                        <div
                                        key={relatedVolume.id}
                                        className={`group relative `}>
                                            <Link href={`/volume/${relatedVolume.id}`} className="block">
                                                <Card className="group bg-transparent dark:bg-transparent overflow-hidden border-none shadow-none">
                                                    <div className="relative aspect-[10/14] w-full overflow-hidden rounded-lg">
                                                        <Image
                                                            src={relatedVolume.coverImage || relatedVolume.manga.coverImage}
                                                            alt={`${relatedVolume.manga.title} - المجلد ${relatedVolume.volumeNumber}`}
                                                            style={{ objectFit: "cover" }}
                                                            loading='lazy'
                                                            placeholder='blur'
                                                            blurDataURL={relatedVolume.coverImage || relatedVolume.manga.coverImage}
                                                            quality={100}
                                                            layout="fill"
                                                        />



                                                        {/* Add to cart button overlay */}
                                                        {relatedVolume.isAvailable && relatedVolume.stock > 0 && (
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
                                                            المجلد {relatedVolume.volumeNumber}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            {relatedVolume.discount > 0 ? (
                                                                <>
                                                                    <span className="text-xs  text-gray-900">
                                                                        {formatCurrencyAr(relatedVolume.finalPrice)}
                                                                    </span>
                                                                    <span className="text-xs  text-gray-900">
                                                                        {formatCurrencyAr(relatedVolume.price)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-500 line-through">
                                                                    {formatCurrencyAr(relatedVolume.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <footer className="mt-20 border-t border-border pt-10 pb-6 px-4 md:px-0 text-center text-muted-foreground text-sm">
                            <div className="max-w-4xl mx-auto space-y-5">
                                {/* Mission / Tagline */}
                                <div>
                                    <p className="text-lg font-semibold text-foreground">
                                        مكتبة المانجا — حيث تبدأ مغامرتك!
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                        نقدم لك أفضل المانجا مترجمة للعربية مع تجربة تسوق سلسة وآمنة، تناسب جميع الأذواق من الأكشن إلى الرومانسية.
                                    </p>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex justify-center gap-4 flex-wrap text-sm">
                                    <Link href="/about" className="hover:underline">من نحن</Link>
                                    <Link href="/privacy" className="hover:underline">سياسة الخصوصية</Link>
                                    <Link href="/terms" className="hover:underline">شروط الاستخدام</Link>
                                    <Link href="/contact" className="hover:underline">اتصل بنا</Link>
                                </div>

                                {/* Social Icons */}
                                <div className="flex justify-center gap-5 text-muted-foreground">
                                    <Link
                                        href="https://www.instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Twitter"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="mailto:support@manga-store.com"
                                        className="hover:text-foreground transition-colors"
                                        aria-label="Email"
                                    >
                                        <Mail className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="/catalog"
                                        className="hover:text-foreground transition-colors"
                                        aria-label="Catalog"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                    </Link>
                                </div>

                                {/* Copyright */}
                                <p className="text-xs text-muted-foreground pt-4">
                                    © {new Date().getFullYear()} جميع الحقوق محفوظة لمكتبة المانجا
                                </p>
                            </div>
                        </footer>

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