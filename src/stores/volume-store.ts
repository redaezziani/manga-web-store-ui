import { create } from 'zustand';
import { VolumeData, VolumeRoot } from '@/types/manga';
import { httpClient, apiCall } from '@/lib/http-client';

interface VolumeStore {
  volume: VolumeData | null;
  isLoading: boolean;
  error: string | null;
  fetchVolume: (volumeId: string) => Promise<void>;
  clearVolume: () => void;
}

export const useVolumeStore = create<VolumeStore>((set, get) => ({
  volume: null,
  isLoading: false,
  error: null,

  fetchVolume: async (volumeId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await apiCall<VolumeRoot>(
        () => httpClient.get(`/volumes/${volumeId}`, false), // Public endpoint
        'Failed to fetch volume'
      );
      
      if (data.success) {
        set({ volume: data.data, isLoading: false });
      } else {
        throw new Error(data.message || 'Failed to fetch volume');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false 
      });
    }
  },

  clearVolume: () => {
    set({ volume: null, error: null, isLoading: false });
  },
}));
