import { useEffect } from 'react';
import { useVolumeStore } from './volume-store';

export const useVolume = (volumeId: string | null) => {
  const { volume, isLoading, error, fetchVolume, clearVolume } = useVolumeStore();

  useEffect(() => {
    if (volumeId) {
      fetchVolume(volumeId);
    } else {
      clearVolume();
    }
  }, [volumeId, fetchVolume, clearVolume]);

  return {
    volume,
    isLoading,
    error,
    refetch: () => volumeId && fetchVolume(volumeId),
  };
};
