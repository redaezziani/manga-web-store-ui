'use client';
import { use  } from 'react';
import MangaDetails from '../ui/manga-details';


export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    return (
        <main
        aria-label="Manga Details Page"
        lang="ar" className="container mx-auto mt-2 px-4">
            <section
            aria-label='Manga Details Section'
            className="my-6 flex flex-col items-start justify-start">
                <h2 lang="ar" className="mt-3 text-lg font-semibold text-gray-800 dark:text-gray-50">
                    تفاصيل المجلد
                </h2>
                <p lang="ar" className="text-sm text-gray-500 dark:text-gray-300">
                    استكشف تفاصيل هذا المجلد، بما في ذلك السعر والمخزون والمعلومات الأساسية
                </p>
            </section>

            <MangaDetails
                volumeId={resolvedParams.id}
            />
           
        </main>
    );
}