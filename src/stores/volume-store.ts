import { create } from 'zustand';
import { VolumeData, VolumeRoot } from '@/types/manga';

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
      const response = await fetch(`http://192.168.100.108:7000/api/v1/volumes/${volumeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: VolumeRoot = await response.json();
      
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
