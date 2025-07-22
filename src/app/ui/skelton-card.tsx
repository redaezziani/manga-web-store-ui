import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="group bg-transparent dark:bg-transparent overflow-hidden animate-pulse">
            <div className="relative aspect-[10/14] w-full overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
                <div className="absolute right-2 top-2">
                    <div className="rounded-md bg-gray-400 dark:bg-gray-600 px-2 py-1 h-4 w-16"></div>
                </div>
            </div>
            <div className="p-3">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            </div>
            <div className="p-3 pt-0">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            </div>
            <div className="flex items-center justify-between p-3">
                <div className="flex flex-wrap gap-1">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-10"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
