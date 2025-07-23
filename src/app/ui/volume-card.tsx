'use client';
import React from 'react';
import Image from "next/legacy/image";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SkeletonCard from './skelton-card';
import Link from 'next/link';


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

export interface Meta {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}


interface VolumeCardProps {
    data: Volume;
}

const VolumeCard = ({ data }: VolumeCardProps) => {
    
    return (
        (<Link
            prefetch={true}
            href={`/volume/${data.id}`}
            className="block"


        >
            <Card className="group bg-transparent dark:bg-transparent overflow-hidden border-none shadow-none  ">
                <div className="relative border border-neutral-400/35 aspect-[10/14] w-full overflow-hidden rounded-lg">

                    <img
                        src={data.coverImage || data.manga.coverImage}
                        alt={data.manga.title}
                        style={{ objectFit: "cover" }}
                        loading='lazy'
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
                            /[\u0600-\u06FF]/.test(data.manga.title)
                                ? 'ar'
                                : 'en'
                        }
                        className="line-clamp-1 text-md"
                    >
                        {data.manga.title}
                    </h3>
                    <p lang="ar" className="line-clamp-1 text-sm text-gray-600">
                        {data.manga.description}
                    </p>
                    <h3 className="line-clamp-1 text-md font-medium mt-1">
                        المجلد {data.volumeNumber}
                    </h3>
                    <div className="flex items-center gap-0.5 mt-1 ">
                        <span className="text-xs  text-gray-900">
                            {data.finalPrice} درهم
                        </span>
                        {"-"}
                        {data.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                                {data.price} درهم
                            </span>
                        )}
                        </div>
                </div>
                
            </Card>
        </Link>)
    );
};

export default VolumeCard;