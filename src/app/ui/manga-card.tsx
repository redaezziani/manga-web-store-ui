'use client';
import React from 'react';
import Image from "next/legacy/image";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SkeletonCard from './skelton-card';
import Link from 'next/link';
import { Manga } from '@/types/manga';

interface MangaCardProps {
    data: Manga;
}

const MangaCard = ({ data }: MangaCardProps) => {
    
    return (
        (<Link
            prefetch={true}
            href={`/manga/${data.id}`}
            className="block"


        >
            <Card className="group bg-transparent dark:bg-transparent overflow-hidden border-none shadow-none  ">
                <div className="relative aspect-[10/14] w-full overflow-hidden rounded-lg">

                    <Image
                        src={data.coverImage}
                        alt={data.title}
                        style={{ objectFit: "cover" }}
                        loading='lazy'
                        priority={false}
                        placeholder='blur'
                        blurDataURL={data.coverImage}
                        quality={100}
                        layout="fill"
                    />

                    <div className="absolute right-2 top-2">
                        <span lang="ar" className="rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                            {data.isAvailable ? 'متوفر' : 'غير متوفر'}
                        </span>
                    </div>
                </div>
               
                <div className=" w-full">
                     <h3
                        lang={
                            /[\u0600-\u06FF]/.test(data.title)
                                ? 'ar'
                                : 'en'
                        }
                        className="line-clamp-1 text-md"
                    >
                        {data.title}
                    </h3>
                    <p lang="ar" className="line-clamp-1 text-sm text-gray-600">
                        {data.description}
                    </p>
                </div>
                
            </Card>
        </Link>)
    );
};

export default MangaCard;