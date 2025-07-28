import { create } from 'zustand';
import { 
  FilterData, 
  FilterDataResponse, 
  VolumeListItem, 
  VolumeQueryParams, 
  VolumeFiltersResponse,
  Meta
} from '@/types/manga';
import { httpClient, apiCall } from '@/lib/http-client';

interface FilterStore {
  // Filter data
  filterData: FilterData | null;
  isLoadingFilterData: boolean;
  filterDataError: string | null;
  
  // Filtered volumes
  volumes: VolumeListItem[];
  meta: Meta | null;
  isLoadingVolumes: boolean;
  volumesError: string | null;
  
  // Current filters
  currentFilters: VolumeQueryParams;
  
  // Actions
  fetchFilterData: () => Promise<void>;
  fetchVolumes: (params?: VolumeQueryParams) => Promise<void>;
  updateFilters: (filters: Partial<VolumeQueryParams>) => void;
  resetFilters: () => void;
  clearErrors: () => void;
}

const defaultFilters: VolumeQueryParams = {
  page: 1,
  limit: 20,
  isAvailable: true,
  inStock: true,
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  // State
  filterData: null,
  isLoadingFilterData: false,
  filterDataError: null,
  
  volumes: [],
  meta: null,
  isLoadingVolumes: false,
  volumesError: null,
  
  currentFilters: defaultFilters,

  // Fetch filter data (authors, categories, price range)
  fetchFilterData: async () => {
    set({ isLoadingFilterData: true, filterDataError: null });
    
    try {
      const data = await apiCall<FilterDataResponse>(
        () => httpClient.get('/volumes/filter-data', false), // Public endpoint
        'Failed to fetch filter data'
      );
      
      if (data.success) {
        set({ 
          filterData: data.data, 
          isLoadingFilterData: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch filter data');
      }
    } catch (error) {
      set({ 
        filterDataError: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoadingFilterData: false 
      });
    }
  },

  // Fetch volumes with filters
  fetchVolumes: async (params?: VolumeQueryParams) => {
    const filters = params || get().currentFilters;
    set({ isLoadingVolumes: true, volumesError: null });
    
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle arrays (authors, categories)
            value.forEach(item => queryParams.append(key, item));
          } else {
            queryParams.set(key, String(value));
          }
        }
      });
      
      const data = await apiCall<VolumeFiltersResponse>(
        () => httpClient.get(`/volumes?${queryParams.toString()}`, false),
        'Failed to fetch volumes'
      );
      
      if (data.success) {
        set({ 
          volumes: data.data.data,
          meta: data.data.meta,
          currentFilters: filters,
          isLoadingVolumes: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch volumes');
      }
    } catch (error) {
      set({ 
        volumesError: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoadingVolumes: false 
      });
    }
  },

  // Update filters and fetch new data
  updateFilters: (newFilters: Partial<VolumeQueryParams>) => {
    const updatedFilters = { ...get().currentFilters, ...newFilters };
    set({ currentFilters: updatedFilters });
    get().fetchVolumes(updatedFilters);
  },

  // Reset filters to default
  resetFilters: () => {
    set({ currentFilters: defaultFilters });
    get().fetchVolumes(defaultFilters);
  },

  // Clear all errors
  clearErrors: () => {
    set({ 
      filterDataError: null, 
      volumesError: null 
    });
  },
}));
