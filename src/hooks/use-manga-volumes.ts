import { useState, useEffect } from 'react';
import { VolumeListResponse, VolumeListItem } from '@/types/manga';

export const useMangaVolumes = (mangaId: string) => {
  const [volumes, setVolumes] = useState<VolumeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const fetchVolumes = async (page: number = 1, limit: number = 20) => {
    if (!mangaId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://192.168.100.108:7000/api/v1/volumes?page=${page}&limit=${limit}&mangaId=${mangaId}`,
        {
          headers: {
            'accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VolumeListResponse = await response.json();

      if (data.success) {
        setVolumes(data.data.data);
        setMeta(data.data.meta);
      } else {
        throw new Error(data.message || 'Failed to fetch volumes');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumes();
  }, [mangaId]);

  return {
    volumes,
    isLoading,
    error,
    meta,
    refetch: fetchVolumes,
  };
};
