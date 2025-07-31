// VolumeList.tsx
'use client';
import React, { useId } from 'react';
import Link from 'next/link';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import VolumeCard from './volume-card';
import SkeletonCard from './skelton-card';

export interface Manga {
  id: string
  title: string
  author: string
  coverImage: string
  isAvailable: boolean
  description: string
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


interface VolumeListProps {
  title?: string;
  mangas: Volume[];
  isLoading: boolean;
  skeletonCount?: number;
  breakpoints?: {
    [key: number]: {
      slidesPerView: number;
      spaceBetween: number;
    };
  };
}

const VolumeList = ({ 
  title, 
  mangas, 
  isLoading, 
  skeletonCount = 7,
  breakpoints = {
    320: { slidesPerView: 2, spaceBetween: 10 },
    480: { slidesPerView: 2, spaceBetween: 15 },
    768: { slidesPerView: 2, spaceBetween: 15 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
    1280: { slidesPerView: 9, spaceBetween: 20 },
  }
}: VolumeListProps) => {

  const id = useId().replace(/:/g, '');
  const prevButtonClass = `prev-button-${id}`;
  const nextButtonClass = `next-button-${id}`;

  const renderContent = () => {
    if (isLoading) {
      return Array(skeletonCount)
        .fill(0)
        .map((_, index) => (
          <SwiperSlide key={`skeleton-${index}`}>
            <SkeletonCard />
          </SwiperSlide>
        ));
    }

    return mangas?.map((manga) => (
      <SwiperSlide key={manga.id}>
        <VolumeCard data={manga} />
      </SwiperSlide>
    ));
  };

  return (
    <div lang="ar" className="container relative mx-auto flex-col space-y-1 ">
      {title && <h3 className="text-xl font-bold ">{title}</h3>}
      <div className="flex w-full items-end justify-between pb-2">
        <Link href={'/catalog'} lang="ar" className="text-sm text-gray-500">
          عرض الكل
        </Link>
        <div className="flex gap-4">
          <button className={`${prevButtonClass} rounded-full p-2 text-gray-700 dark:text-primary`}>
            <ChevronRight size={18} />
          </button>
          <button className={`${nextButtonClass} rounded-full p-2 text-gray-700 dark:text-primary`}>
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={15}
        navigation={{
          prevEl: `.${prevButtonClass}`,
          nextEl: `.${nextButtonClass}`,
        }}
        pagination={false}
        breakpoints={breakpoints}
        className="py-8"
      >
        {renderContent()}
      </Swiper>
    </div>
  );
};

export default VolumeList;