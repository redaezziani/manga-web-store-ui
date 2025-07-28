import { useEffect } from 'react';
import { useFilterStore } from './filter-store';
import { VolumeQueryParams } from '@/types/manga';

export const useFilters = () => {
  const {
    filterData,
    isLoadingFilterData,
    filterDataError,
    volumes,
    meta,
    isLoadingVolumes,
    volumesError,
    currentFilters,
    fetchFilterData,
    fetchVolumes,
    updateFilters,
    resetFilters,
    clearErrors,
  } = useFilterStore();

  // Load filter data on mount
  useEffect(() => {
    if (!filterData) {
      fetchFilterData();
    }
  }, [filterData, fetchFilterData]);

  // Load initial volumes
  useEffect(() => {
    if (volumes.length === 0) {
      fetchVolumes();
    }
  }, [volumes.length, fetchVolumes]);

  // Helper functions
  const setPage = (page: number) => {
    updateFilters({ page });
  };

  const setLimit = (limit: number) => {
    updateFilters({ limit, page: 1 }); // Reset to first page when changing limit
  };

  const setPriceRange = (minPrice: number, maxPrice: number) => {
    updateFilters({ minPrice, maxPrice, page: 1 });
  };

  const toggleAvailability = (isAvailable: boolean) => {
    updateFilters({ isAvailable, page: 1 });
  };

  const toggleInStock = (inStock: boolean) => {
    updateFilters({ inStock, page: 1 });
  };

  const setAuthors = (authors: string[]) => {
    updateFilters({ authors, page: 1 });
  };

  const setCategories = (categories: string[]) => {
    updateFilters({ categories, page: 1 });
  };

  const setMangaId = (mangaId: string) => {
    updateFilters({ mangaId, page: 1 });
  };

  const addAuthor = (author: string) => {
    const currentAuthors = currentFilters.authors || [];
    if (!currentAuthors.includes(author)) {
      setAuthors([...currentAuthors, author]);
    }
  };

  const removeAuthor = (author: string) => {
    const currentAuthors = currentFilters.authors || [];
    setAuthors(currentAuthors.filter(a => a !== author));
  };

  const addCategory = (category: string) => {
    const currentCategories = currentFilters.categories || [];
    if (!currentCategories.includes(category)) {
      setCategories([...currentCategories, category]);
    }
  };

  const removeCategory = (category: string) => {
    const currentCategories = currentFilters.categories || [];
    setCategories(currentCategories.filter(c => c !== category));
  };

  const hasNextPage = meta?.hasNextPage || false;
  const hasPreviousPage = meta?.hasPreviousPage || false;
  const totalPages = meta?.totalPages || 0;
  const totalItems = meta?.totalItems || 0;
  const currentPage = meta?.currentPage || 1;

  return {
    // Data
    filterData,
    volumes,
    meta,
    currentFilters,
    
    // Loading states
    isLoadingFilterData,
    isLoadingVolumes,
    isLoading: isLoadingFilterData || isLoadingVolumes,
    
    // Errors
    filterDataError,
    volumesError,
    error: filterDataError || volumesError,
    
    // Actions
    fetchFilterData,
    fetchVolumes,
    updateFilters,
    resetFilters,
    clearErrors,
    
    // Helper actions
    setPage,
    setLimit,
    setPriceRange,
    toggleAvailability,
    toggleInStock,
    setAuthors,
    setCategories,
    setMangaId,
    addAuthor,
    removeAuthor,
    addCategory,
    removeCategory,
    
    // Pagination helpers
    hasNextPage,
    hasPreviousPage,
    totalPages,
    totalItems,
    currentPage,
  };
};
